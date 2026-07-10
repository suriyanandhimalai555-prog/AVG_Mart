import { pool } from '../config/db.js';

export const CategoryModel = {
  create: async ({ name, imageUrl, attributes }) => {
    const query = `
      INSERT INTO categories (name, image_url, attributes)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    // Storing name as lowercase as per your original logic, passing attributes array
    const { rows } = await pool.query(query, [name.toLowerCase(), imageUrl, attributes || []]);
    return rows[0];
  },

  findAll: async () => {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const { rows } = await pool.query(query);
    return rows;
  }
};