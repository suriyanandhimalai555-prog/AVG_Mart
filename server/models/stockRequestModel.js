import { pool } from '../config/db.js';

export const StockRequestModel = {
  create: async ({ productId, category, requestedCount, totalAmount }) => {
    const query = `
      INSERT INTO stock_requests (product_id, category, requested_count, total_amount, status)
      VALUES ($1, $2, $3, $4, 'Pending')
      RETURNING *;
    `;
    const values = [productId, category, requestedCount, totalAmount];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findAll: async () => {
    const query = `
      SELECT sr.*, p.name as product_name, p.branch_admin_price 
      FROM stock_requests sr
      LEFT JOIN products p ON sr.product_id = p.id
      ORDER BY sr.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  updateStatus: async (id, status) => {
    const query = `
      UPDATE stock_requests 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
  }
};