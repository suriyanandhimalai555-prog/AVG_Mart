// Import the named pool instance from your db configuration file
import { pool } from '../config/db.js'; 

export const ProductModel = {
  create: async ({ name, category, sizes, description, originalPrice, offerPrice, count, images, isFeatured }) => {
    const query = `
      INSERT INTO products (name, category, sizes, description, original_price, offer_price, count, images, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [name, category, sizes, description, originalPrice, offerPrice, count, images, isFeatured || false];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findAll: async () => {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  update: async (id, { name, category, sizes, description, originalPrice, offerPrice, count, images, isFeatured }) => {
    const findQuery = 'SELECT * FROM products WHERE id = $1';
    const currentRes = await pool.query(findQuery, [id]);
    if (currentRes.rows.length === 0) return null;

    const finalImages = images !== undefined ? images : currentRes.rows[0].images;
    // Fall back to old value if isFeatured isn't explicitly provided
    const finalFeatured = isFeatured !== undefined ? isFeatured : currentRes.rows[0].is_featured;

    const query = `
      UPDATE products 
      SET name = $1, category = $2, sizes = $3, description = $4, original_price = $5, offer_price = $6, count = $7, images = $8, is_featured = $9
      WHERE id = $10
      RETURNING *;
    `;
    const values = [name, category, sizes, description, originalPrice, offerPrice, count, finalImages, finalFeatured, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};