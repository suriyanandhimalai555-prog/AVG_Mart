import { pool } from '../config/db.js';

export const StockRequestModel = {
  // PAKKA FIX: Capture and insert the adminId into the database column
  create: async ({ productId, category, requestedCount, totalAmount, adminId }) => {
    const query = `
      INSERT INTO stock_requests (product_id, category, requested_count, total_amount, admin_id, status)
      VALUES ($1, $2, $3, $4, $5, 'Pending')
      RETURNING *;
    `;
    const values = [productId, category, requestedCount, totalAmount, adminId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // PAKKA FIX: Receive user context object and apply dynamic data filtering
  findAll: async ({ adminId, role }) => {
    let query;
    let values = [];

    // If master admin, let them track all dispatched branch invoices
    if (role === 'admin') {
      query = `
        SELECT sr.*, p.name as product_name, p.branch_admin_price 
        FROM stock_requests sr
        LEFT JOIN products p ON sr.product_id = p.id
        ORDER BY sr.created_at DESC;
      `;
    } else {
      // If branch admin, strictly bind the output to their active administrative row identity
      query = `
        SELECT sr.*, p.name as product_name, p.branch_admin_price 
        FROM stock_requests sr
        LEFT JOIN products p ON sr.product_id = p.id
        WHERE sr.admin_id = $1
        ORDER BY sr.created_at DESC;
      `;
      values = [adminId];
    }

    const { rows } = await pool.query(query, values);
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