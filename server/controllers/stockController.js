// Import the named 'pool' export directly from your db.js config file
import { pool } from '../config/db.js'; 

// Get all stock entries
export const getStock = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branch_stock ORDER BY updated_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Internal server error fetching stock data pipelines." });
  }
};

// Add new or update existing stock entry
export const addOrUpdateStock = async (req, res) => {
  const { id, product_name, category, count } = req.body;

  try {
    if (id) {
      // Update operation
      const result = await pool.query(
        'UPDATE branch_stock SET product_name = $1, category = $2, count = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [product_name, category, parseInt(count), id]
      );
      return res.status(200).json(result.rows[0]);
    } else {
      // Insert operation
      const result = await pool.query(
        'INSERT INTO branch_stock (product_name, category, count) VALUES ($1, $2, $3) RETURNING *',
        [product_name, category, parseInt(count)]
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
  try {
    await pool.query('DELETE FROM branch_stock WHERE id = $1', [id]);
    res.status(200).json({ message: "Stock record permanently dropped." });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ message: "Failed to erase catalog element index." });
  }
};