import { pool } from '../config/db.js';

const BranchAdminModel = {
  // Find record by primary database serial ID
  findById: async (id) => {
    const query = 'SELECT * FROM branch_admins WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Check for historical duplicates prior to allocation
  findByEmail: async (email) => {
    const query = 'SELECT id, node_id AS "nodeId", name, email, branch, pincodes, password, created_at FROM branch_admins WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  // Insert a fresh administrator node vector
  create: async ({ nodeId, name, email, branch, pincodes, hashedPassword }) => {
    const query = `
      INSERT INTO branch_admins (node_id, name, email, branch, pincodes, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, node_id AS "nodeId", name, email, branch, pincodes, password, created_at;
    `;
    const values = [nodeId, name, email, branch, pincodes, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Pull all active entries compiled within the ledger state
  getAll: async () => {
    const query = 'SELECT id, node_id AS "nodeId", name, email, branch, pincodes, password, created_at FROM branch_admins ORDER BY id DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  // FIXED: Changed function key name back to 'update' to match controller expectations
  update: async (id, { name, email, branch, pincodes }) => {
    const query = `
      UPDATE branch_admins 
      SET name = $1, email = $2, branch = $3, pincodes = $4
      WHERE id = $5
      RETURNING id, node_id AS "nodeId", name, email, branch, pincodes, password;
    `;
    const values = [name, email, branch, pincodes, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

export default BranchAdminModel;