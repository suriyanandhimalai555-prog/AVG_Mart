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

// 2. Add item or increase quantity in cart
export const addToCart = async (req, res) => {
  try {
    const { product_id, name, category, price, image } = req.body;

    // Upsert logic: if item exists for user, increment quantity. Otherwise, insert it.
    const query = `
      INSERT INTO cart (user_id, product_id, name, category, price, image, quantity)
      VALUES ($1, $2, $3, $4, $5, $6, 1)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart.quantity + 1
      RETURNING *;
    `;
    
    const { rows } = await pool.query(query, [req.user.id, product_id, name, category, price, image]);
    return res.status(201).json({ message: "Item synchronized into database loadout.", item: rows[0] });
  } catch (error) {
    console.error("Add To Cart DB Error:", error);
    return res.status(500).json({ message: "Internal server tracking payload addition error." });
  }
};

// 3. Modify product quantity directly (Plus/Minus bounds)
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params; // cart item row primary key ID
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