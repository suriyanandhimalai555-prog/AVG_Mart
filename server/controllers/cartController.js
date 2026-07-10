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

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      product_id, 
      name, 
      category, 
      price, 
      image, 
      selected_size, 
      fromCartItemId, 
      isSizeUpdateOnly 
    } = req.body;

    const sizeValue = selected_size ? String(selected_size).trim() : "";

    // 1. RULE: If explicitly updating an item's missing configuration directly from the Cart panel
    if (fromCartItemId || isSizeUpdateOnly) {
      const updateQuery = `
        UPDATE cart 
        SET selected_size = $1 
        WHERE id = $2 AND user_id::text = $3::text 
        RETURNING *;
      `;
      const { rows } = await pool.query(updateQuery, [sizeValue, fromCartItemId, String(userId)]);
      return res.status(200).json({ message: "Cart item variation updated.", cart: rows[0] });
    }

    // 2. CHECK THE LEDGER: Check for items matching BOTH product_id AND selected_size
    const findQuery = `
      SELECT * FROM cart 
      WHERE product_id = $1 AND user_id::text = $2::text;
    `;
    const { rows: existingRows } = await pool.query(findQuery, [product_id, String(userId)]);

    // Check if there is an item where size is empty/missing
    const emptySizeItem = existingRows.find(item => !item.selected_size || String(item.selected_size).trim() === "");
    // Check if there is an item matching the exact new size selected
    const exactMatchItem = existingRows.find(item => String(item.selected_size).trim() === sizeValue);

    if (emptySizeItem && sizeValue !== "") {
      // If a row exists with an unassigned blank size, update it right away!
      const patchQuery = `
        UPDATE cart 
        SET selected_size = $1 
        WHERE id = $2 
        RETURNING *;
      `;
      const { rows } = await pool.query(patchQuery, [sizeValue, emptySizeItem.id]);
      return res.status(200).json({ message: "Assigned configuration parameters to empty item.", cart: rows[0] });
    } 
    
    if (exactMatchItem) {
      // If the exact same size already exists, increment the quantity counter safely
      const incrementQuery = `
        UPDATE cart 
        SET quantity = quantity + 1 
        WHERE id = $1 
        RETURNING *;
      `;
      const { rows } = await pool.query(incrementQuery, [exactMatchItem.id]);
      return res.status(200).json({ message: "Incremented quantity of matching matrix.", cart: rows[0] });
    }

    // 3. SEPARATE ITEM CREATION: Create a brand new distinct row since sizes are different (e.g. M vs S)
    const insertQuery = `
      INSERT INTO cart (user_id, product_id, name, category, price, image, selected_size, quantity)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 1)
      RETURNING *;
    `;
    const values = [String(userId), product_id, name, category, price, image, sizeValue];
    const { rows: newRows } = await pool.query(insertQuery, values);

    return res.status(201).json({ message: "Added distinct asset configuration variation line.", cart: newRows[0] });

  } catch (error) {
    console.error("Cart Add Operation Error:", error);
    return res.status(500).json({ message: "Failed syncing resource configurations to cart matrix entries." });
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