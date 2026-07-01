// Import the named 'pool' export directly from your db.js config file
import { pool } from '../config/db.js'; 

// Get all stock entries
export const getStock = async (req, res) => {
  try {
    let result;
    
    // PAKKA FIX: If supreme master admin, fetch all branch listings. If branch admin, filter strictly by their token id
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT * FROM branch_stock ORDER BY updated_at DESC');
    } else {
      result = await pool.query(
        'SELECT * FROM branch_stock WHERE admin_id = $1 ORDER BY updated_at DESC',
        [req.user.id]
      );
    }
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Internal server error fetching stock data pipelines." });
  }
};

// Add new or update existing stock entry
export const addOrUpdateStock = async (req, res) => {
  const { id, product_name, category, count } = req.body;
  const adminId = req.user.id; // 👈 Extract active logged-in admin context

  try {
    if (id) {
      // PAKKA FIX: Authorization Guard — Check row ownership before updating if not main master admin
      if (req.user.role !== 'admin') {
        const ownershipCheck = await pool.query('SELECT admin_id FROM branch_stock WHERE id = $1', [id]);
        if (ownershipCheck.rows[0] && ownershipCheck.rows[0].admin_id !== adminId) {
          return res.status(403).json({ message: "Access Denied. You do not own this warehouse stock node entry." });
        }
      }

      // Update operation
      const result = await pool.query(
        'UPDATE branch_stock SET product_name = $1, category = $2, count = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [product_name, category, parseInt(count), id]
      );
      return res.status(200).json(result.rows[0]);
    } else {
      // Insert operation — Explicitly link the record row to this branch operator's ID!
      const result = await pool.query(
        'INSERT INTO branch_stock (product_name, category, count, admin_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [product_name, category, parseInt(count), adminId]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error upserting stock record:", error);
    res.status(500).json({ message: "Database drop script execution failure." });
  }
};

// Delete stock entry
export const deleteStock = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  try {
    // PAKKA FIX: Authorization Guard — Check row ownership before running the delete execution statement
    if (req.user.role !== 'admin') {
      const ownershipCheck = await pool.query('SELECT admin_id FROM branch_stock WHERE id = $1', [id]);
      if (ownershipCheck.rows[0] && ownershipCheck.rows[0].admin_id !== adminId) {
        return res.status(403).json({ message: "Access Denied. Mismatched branch cluster ownership." });
      }
    }

    await pool.query('DELETE FROM branch_stock WHERE id = $1', [id]);
    res.status(200).json({ message: "Stock record permanently dropped." });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ message: "Failed to erase catalog element index." });
  }
};