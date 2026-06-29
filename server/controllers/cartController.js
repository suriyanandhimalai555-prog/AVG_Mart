import { pool } from "../config/db.js";

// 1. Get user's cart items
export const getCart = async (req, res) => {
  try {
    const query = "SELECT * FROM cart WHERE user_id = $1 ORDER BY created_at DESC;";
    const { rows } = await pool.query(query, [req.user.id]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return res.status(500).json({ message: "Internal server handling cart fetch error." });
  }
};

// 2. Add item or dynamically reconfigure size variations without duplicating total count matrix
export const addToCart = async (req, res) => {
  try {
    const { product_id, name, category, price, image, selected_size, fromCartItemId, isSizeUpdateOnly, existingQty } = req.body;
    const sizeVal = selected_size || '';

    // SPECIAL FLOW: If redirected from Cart component specifically to alter sizing properties
    if (isSizeUpdateOnly && fromCartItemId) {
      // Check if another row already exists with this exact product ID and targeted size selection configuration
      const checkDuplicateQuery = "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2 AND selected_size = $3;";
      const duplicateRes = await pool.query(checkDuplicateQuery, [req.user.id, product_id, sizeVal]);

      if (duplicateRes.rows.length > 0) {
        // Match found! Merge the counts together into the already setup variation and drop the legacy item row.
        const existingRow = duplicateRes.rows[0];
        
        if (existingRow.id !== parseInt(fromCartItemId)) {
          await pool.query("UPDATE cart SET quantity = quantity + $1 WHERE id = $2;", [existingQty || 1, existingRow.id]);
          await pool.query("DELETE FROM cart WHERE id = $1;", [fromCartItemId]);
          return res.status(200).json({ message: "Sizing variants combined smoothly into original configuration track." });
        }
      }

      // No pre-existing target match variant. Update the current active row directly with zero quantity additions.
      const updateSizeQuery = "UPDATE cart SET selected_size = $1 WHERE id = $2 AND user_id = $3 RETURNING *;";
      const { rows } = await pool.query(updateSizeQuery, [sizeVal, fromCartItemId, req.user.id]);
      return res.status(200).json({ message: "Item alignment variation configured.", item: rows[0] });
    }

    // STANDARD WORKFLOW: Core Upsert logic running safely under the compound UNIQUE constraint configuration
    const query = `
      INSERT INTO cart (user_id, product_id, name, category, price, image, selected_size, quantity)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 1)
      ON CONFLICT (user_id, product_id, COALESCE(selected_size, ''))
      DO UPDATE SET quantity = cart.quantity + 1
      RETURNING *;
    `;
    
    const { rows } = await pool.query(query, [req.user.id, product_id, name, category, price, image, sizeVal]);
    return res.status(201).json({ message: "Item synchronized into database loadout.", item: rows[0] });
  } catch (error) {
    console.error("Add To Cart DB Error:", error);
    return res.status(500).json({ message: "Internal server tracking payload addition error." });
  }
};

// 3. Modify product quantity directly (Plus/Minus bounds)
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params; 
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2;", [id, req.user.id]);
      return res.status(200).json({ message: "Item cleared due to zero balance constraint." });
    }

    const query = "UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *;";
    const { rows } = await pool.query(query, [quantity, id, req.user.id]);
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Update Quantity Error:", error);
    return res.status(500).json({ message: "Failed to calibrate item cluster balance." });
  }
};

// 4. Remove single item entirely
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2;", [id, req.user.id]);
    return res.status(200).json({ message: "Item eliminated from inventory registry." });
  } catch (error) {
    console.error("Remove Item Error:", error);
    return res.status(500).json({ message: "Failed to purge item resource node." });
  }
};