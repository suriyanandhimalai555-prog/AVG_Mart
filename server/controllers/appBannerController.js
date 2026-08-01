import { pool } from '../config/db.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../config/s3.js';

// Get all banners with linked product details
export const getBanners = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id, 
        b.title, 
        b.image_url, 
        b.product_id, 
        b.created_at,
        p.name AS product_name
      FROM app_banners b
      LEFT JOIN products p ON b.product_id = p.id
      ORDER BY b.id DESC
    `;
    const result = await pool.query(query);
    res.status(200).json({ success: true, banners: result.rows });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ success: false, message: 'Server Error: Unable to fetch banners' });
  }
};

// Upload a new banner linked optionally to a product
export const createBanner = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const file = req.file;
    const title = req.body.title || '';
    const productId = req.body.productId && req.body.productId !== 'null' ? parseInt(req.body.productId, 10) : null;

    // Generate unique S3 object key
    const fileName = `banners/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

    // Upload raw buffer to AWS S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Public S3 URL construct
    const region = process.env.AWS_REGION || 'us-east-1';
    const imageUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

    // Insert banner details along with product_id into Postgres
    const insertQuery = `
      INSERT INTO app_banners (title, image_url, product_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [title, imageUrl, productId]);

    res.status(201).json({
      success: true,
      message: 'Banner uploaded successfully',
      banner: result.rows[0],
    });
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ success: false, message: 'Server Error: Unable to upload banner' });
  }
};

// Delete a banner from DB and S3
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch banner record from Postgres
    const bannerQuery = await pool.query('SELECT * FROM app_banners WHERE id = $1', [id]);
    if (bannerQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Banner record not found' });
    }

    const banner = bannerQuery.rows[0];
    const imageUrl = banner.image_url;

    // Delete S3 object
    if (imageUrl) {
      try {
        const urlObj = new URL(imageUrl);
        const s3Key = urlObj.pathname.substring(1);

        if (s3Key) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
          }));
        }
      } catch (s3Err) {
        console.error('Failed to purge object from S3:', s3Err);
      }
    }

    // Remove row from Postgres
    await pool.query('DELETE FROM app_banners WHERE id = $1', [id]);

    res.status(200).json({ success: true, message: 'Banner removed successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error)
    res.status(500).json({ success: false, message: 'Server Error: Unable to delete banner' });
  }
};