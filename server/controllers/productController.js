import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { ProductModel } from '../models/productModel.js';
import crypto from 'crypto';

export const createProduct = async (req, res) => {
  try {
    const { name, category, sizes, description, originalPrice, offerPrice, branchAdminPrice, count, isFeatured, sellerId } = req.body;
    
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    const featuredBool = isFeatured === 'true' || isFeatured === true;

    const filesToUpload = req.files 
      ? (Array.isArray(req.files) ? req.files : req.files['productImages'] || []) 
      : [];

    const uploadedImageUrls = [];
    if (filesToUpload.length > 0) {
      for (const file of filesToUpload) {
        const uniqueToken = crypto.randomBytes(16).toString('hex');
        const s3Key = `products/${uniqueToken}-${file.originalname.replace(/\s+/g, '-')}`;

        const uploadCommand = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(uploadCommand);
        uploadedImageUrls.push(`https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`);
      }
    } else {
      uploadedImageUrls.push("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500");
    }

    // Assign seller_id based on logged-in user role
let assignedSellerId = null;

if (req.user.role === "seller") {
  assignedSellerId = req.user.sellerId || req.user.id;
}

// Admin products will have seller_id = NULL
if (req.user.role === "admin") {
  assignedSellerId = null;
}

    // Include both seller_id and sellerId so SQL models handle column binding properly
    const newProduct = await ProductModel.create({
  name,
  category,
  sizes: parsedSizes,
  description,
  originalPrice,
  offerPrice,
  branchAdminPrice,
  count: count || 0,
  images: uploadedImageUrls,
  isFeatured: featuredBool,
  sellerId: assignedSellerId
});

    return res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error in createProduct Controller:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    let products;

    // Seller request
    if (req.query.sellerId) {
      products = await ProductModel.findAll(req.query.sellerId);
    } else {
      // Admin request
      products = await ProductModel.findAll();
    }

    const data = products.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      sizes: item.sizes,
      description: item.description,
      originalPrice: item.original_price,
      offerPrice: item.offer_price,
      branchAdminPrice: item.branch_admin_price,
      count: item.count,
      images: item.images,
      isFeatured: item.is_featured,
      sellerId: item.seller_id
    }));

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, originalPrice, offerPrice, branchAdminPrice, count, sizes, isFeatured } = req.body;

  try {
    let uploadedImageUrls = undefined;

    if (req.files && req.files.length > 0) {
      uploadedImageUrls = [];
      for (const file of req.files) {
        const uniqueToken = crypto.randomBytes(16).toString('hex');
        const s3Key = `products/${uniqueToken}-${file.originalname.replace(/\s+/g, '-')}`;

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

    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    const featuredBool = isFeatured === 'true' || isFeatured === true;

    const updatedProduct = await ProductModel.update(id, {
      name,
      category,
      sizes: parsedSizes,
      description,
      originalPrice,
      offerPrice,
      branchAdminPrice,
      count,
      images: uploadedImageUrls,
      isFeatured: featuredBool
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product record not found inside database." });
    }

    return res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error("Error in updateProduct Controller:", error);
    return res.status(500).json({ success: false, message: "Server update execution failure." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const itemDropped = await ProductModel.delete(id);

    if (!itemDropped) {
      return res.status(404).json({ success: false, message: 'Target inventory item record row missing' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted completely' });
  } catch (error) {
    console.error('Error in deleteProduct Controller:', error);
    return res.status(500).json({ success: false, message: 'Failed to drop item row' });
  }
};