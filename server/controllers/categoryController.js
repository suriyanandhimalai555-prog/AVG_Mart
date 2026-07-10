import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { CategoryModel } from '../models/categoryModel.js';
import crypto from 'crypto';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    let imageUrl = '';
    if (req.file) {
      const uniqueToken = crypto.randomBytes(16).toString('hex');
      const s3Key = `categories/${uniqueToken}-${req.file.originalname.replace(/\s+/g, '-')}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(uploadCommand);
      imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    } else {
      return res.status(400).json({ success: false, message: 'Category image is required' });
    }

    const newCategory = await CategoryModel.create({ name, imageUrl });
    return res.status(201).json({ success: true, message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error in createCategory:', error);
    if (error.code === '23505') { // Unique violation error code
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};