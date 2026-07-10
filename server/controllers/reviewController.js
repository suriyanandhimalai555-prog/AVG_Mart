import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { pool } from '../config/db.js';
import crypto from 'crypto';

// 1. Submit a product review (With robust validation & integer parsing)
export const addProductReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; 
    const userName = req.user.name || "Verified Buyer";

    // Parse values robustly to avoid integer syntax issues
    const parsedProductId = parseInt(productId, 10);
    const parsedRating = parseInt(rating, 10);

    if (!productId || isNaN(parsedProductId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or missing Product ID." 
      });
    }

    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid rating between 1 and 5 stars." 
      });
    }

    // Handle Image Uploads to AWS S3 securely
    const uploadedImageUrls = [];
    if (req.files && req.files.length > 0) {
      const targetFiles = req.files.slice(0, 5); // Max 5 items
      for (const file of targetFiles) {
        const uniqueToken = crypto.randomBytes(16).toString('hex');
        const s3Key = `reviews/${uniqueToken}-${file.originalname.replace(/\s+/g, '-')}`;

        const uploadCommand = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(uploadCommand);
        uploadedImageUrls.push(`https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`);
      }
    }

    // Database safe insertion query
    const insertQuery = `
      INSERT INTO product_reviews (product_id, user_id, user_name, rating, comment, images)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [parsedProductId, userId, userName, parsedRating, comment || '', uploadedImageUrls];
    const { rows } = await pool.query(insertQuery, values);

    return res.status(201).json({ 
      success: true, 
      message: "Review posted successfully!", 
      review: rows[0] 
    });
    
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error submitting review." 
    });
  }
};

// 2. Fetch all reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const parsedProductId = parseInt(productId, 10);
    if (!productId || isNaN(parsedProductId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or missing target Product parameter." 
      });
    }

    const query = `
      SELECT * FROM product_reviews 
      WHERE product_id = $1 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [parsedProductId]);
    
    return res.status(200).json({ 
      success: true, 
      reviews: rows 
    });
    
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error reading data loadout." 
    });
  }
};