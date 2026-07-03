import { pool } from '../config/db.js';

export const StockRequestModel = {
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

  // UPDATED: Added JOIN to branch_admins to fetch the 'branch' name column
  findAll: async ({ adminId, role }) => {
    let query;
    let values = [];

    if (role === 'admin') {
      query = `
        SELECT 
          sr.*, 
          p.name as product_name, 
          p.branch_admin_price,
          b.branch as branch_name
        FROM stock_requests sr
        LEFT JOIN products p ON sr.product_id = p.id
        LEFT JOIN branch_admins b ON sr.admin_id = b.id
        ORDER BY sr.created_at DESC;
      `;
    } else {
      query = `
        SELECT 
          sr.*, 
          p.name as product_name, 
          p.branch_admin_price,
          b.branch as branch_name
        FROM stock_requests sr
        LEFT JOIN products p ON sr.product_id = p.id
        LEFT JOIN branch_admins b ON sr.admin_id = b.id
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