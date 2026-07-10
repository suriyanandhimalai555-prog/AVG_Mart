import { pool } from '../config/db.js';

export const CategoryModel = {
  create: async ({ name, imageUrl }) => {
    const query = `
      INSERT INTO categories (name, image_url)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name.toLowerCase(), imageUrl]);
    return rows[0];
  },

  findAll: async () => {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const { rows } = await pool.query(query);
    return rows;
  }
};