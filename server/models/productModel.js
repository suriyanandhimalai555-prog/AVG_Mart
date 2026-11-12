import { pool } from '../config/db.js'; 

export const ProductModel = {
  create: async ({ name, category, sizes, description, originalPrice, offerPrice, branchAdminPrice, count, images, isFeatured, sellerId }) => {
    // If sellerId exists, it's a seller product -> needs approval (false). If admin, auto-approved (true).
    const isApproved = !sellerId; 

    const query = `
      INSERT INTO products (name, category, sizes, description, original_price, offer_price, branch_admin_price, count, images, is_featured, seller_id, is_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      name, 
      category, 
      sizes, 
      description, 
      originalPrice, 
      offerPrice, 
      branchAdminPrice || 0, 
      count, 
      images, 
      isFeatured || false,
      sellerId || null,
      isApproved
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findAll: async (sellerId = null) => {
    if (sellerId) {
      const query = 'SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC';
      const { rows } = await pool.query(query, [sellerId]);
      return rows;
    }
    // Admin sees everything
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Use this specifically for user/public-facing catalogs to filter out unapproved items
  findApproved: async () => {
    const query = 'SELECT * FROM products WHERE is_approved = true ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM products WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  updateApprovalStatus: async (id, isApproved) => {
    const query = `
      UPDATE products 
      SET is_approved = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [isApproved, id]);
    return rows[0] || null;
  },

  update: async (id, { name, category, sizes, description, originalPrice, offerPrice, branchAdminPrice, count, images, isFeatured }) => {
    const findQuery = 'SELECT * FROM products WHERE id = $1';
    const currentRes = await pool.query(findQuery, [id]);
    if (currentRes.rows.length === 0) return null;

    const finalImages = images !== undefined ? images : currentRes.rows[0].images;
    const finalFeatured = isFeatured !== undefined ? isFeatured : currentRes.rows[0].is_featured;
    const finalBranchAdminPrice = branchAdminPrice !== undefined ? branchAdminPrice : currentRes.rows[0].branch_admin_price;

    const query = `
      UPDATE products 
      SET name = $1, category = $2, sizes = $3, description = $4, original_price = $5, offer_price = $6, branch_admin_price = $7, count = $8, images = $9, is_featured = $10
      WHERE id = $11
      RETURNING *;
    `;
    const values = [name, category, sizes, description, originalPrice, offerPrice, finalBranchAdminPrice, count, finalImages, finalFeatured, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};