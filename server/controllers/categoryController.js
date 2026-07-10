import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { CategoryModel } from '../models/categoryModel.js';
import { pool } from '../config/db.js'; // imported for inline edit/delete logic
import crypto from 'crypto';

// helper to parse attributes
const parseAttributes = (attributes) => {
  if (!attributes) return [];
  try {
    return typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
  } catch (e) {
    return typeof attributes === 'string' ? attributes.split(',') : [];
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, attributes } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    let imageUrl = '';
    if (req.file) {
      const uniqueToken = crypto.randomBytes(16).toString('hex');
      const s3Key = `categories/${uniqueToken}-${req.file.originalname.replace(/\s+/g, '-')}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }));
      imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    } else {
      return res.status(400).json({ success: false, message: 'Category image is required' });
    }

    const newCategory = await CategoryModel.create({ name, imageUrl, attributes: parseAttributes(attributes) });
    return res.status(201).json({ success: true, message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, attributes } = req.body;
    
    let imageUrl = req.body.imageUrl; // keep old one if no new file

    if (req.file) {
      const uniqueToken = crypto.randomBytes(16).toString('hex');
      const s3Key = `categories/${uniqueToken}-${req.file.originalname.replace(/\s+/g, '-')}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }));
      imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    }

    const parsedAttributes = parseAttributes(attributes);
    const query = `
      UPDATE categories 
      SET name = $1, image_url = $2, attributes = $3
      WHERE id = $4 RETURNING *;
    `;
    const { rows } = await pool.query(query, [name.toLowerCase(), imageUrl, parsedAttributes, id]);
    
    return res.status(200).json({ success: true, message: 'Category updated successfully', category: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *;', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};