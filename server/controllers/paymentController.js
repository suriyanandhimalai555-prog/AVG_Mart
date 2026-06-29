import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    let { amount } = req.body;
    if (amount) {
      const sanitizedAmount = String(amount).replace(/[^\d.]/g, '');
      amount = parseFloat(sanitizedAmount);
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid numerical amount structure received." });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_rcpt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Generation Error:", error);
    return res.status(500).json({ message: "Failed generating gateway asset tracking routes." });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  const client = await pool.connect(); // Use a client connection for an atomic ACID transaction
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address_id, amount } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !address_id) {
      return res.status(400).json({ message: "Missing required verification token parameters." });
    }

    // 1. Verify standard HMAC SHA256 Signature
    const textData = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(textData)
      .digest("hex");

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(razorpay_signature, "utf-8"),
      Buffer.from(expectedSign, "utf-8")
    );

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Invalid verification handshake payload data signature." });
    }

    // 2. Begin transaction to write order records and clear cart state atomatically
    await client.query("BEGIN");

    // Fetch the contents of the cart before clearing it
    const cartQuery = "SELECT * FROM cart WHERE user_id = $1;";
    const { rows: cartItems } = await client.query(cartQuery, [req.user.id]);

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cannot checkout an empty loadout terminal registry." });
    }

    // Insert into the master orders log row
    const insertOrderQuery = `
      INSERT INTO orders (id, user_id, address_id, total_price, payment_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    await client.query(insertOrderQuery, [razorpay_order_id, req.user.id, address_id, amount, razorpay_payment_id]);

    // Snapshot individual items into structural rows
    const insertItemQuery = `
      INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    for (const item of cartItems) {
      await client.query(insertItemQuery, [razorpay_order_id, item.product_id, item.name, item.price, item.quantity, item.image]);
    }

    // Clear active cart parameters completely
    const clearCartQuery = "DELETE FROM cart WHERE user_id = $1;";
    await client.query(clearCartQuery, [req.user.id]);

    await client.query("COMMIT");
    return res.status(200).json({ message: "Order processed and active memory array cleared cleanly." });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Signature processing or structural DB transaction fault:", error);
    return res.status(500).json({ message: "Failed to persist operational ledger sequences." });
  } finally {
    client.release();
  }
};

// 3. New Fetch API Controller targeting profile historical traces
// New Fetch API Controller targeting profile historical traces
export const getUserOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.total_price as "totalPrice", o.status, o.created_at as date,
             o.expected_delivery as "expected_delivery",
             o.delivered_at as "delivered_at", -- ADDED THIS LINE TO FETCH COMPLETED DELIVERY DATE
             json_agg(json_build_object('name', oi.name, 'price', oi.price, 'qty', oi.quantity, 'image', oi.image)) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    const { rows } = await pool.query(query, [req.user.id]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Fetch Live Orders Error Trace:", error);
    return res.status(500).json({ message: "Failed retrieving order telemetry vectors." });
  }
};

// Fetch all customer orders for the Admin Panel
export const getAllCustomerOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.total_price as total, o.status, o.created_at,
             u.name as customer, u.email,
             a.phone, CONCAT(a.street_name, ', ', a.landmark, ', ', a.city, ', ', a.district, ', ', a.state, ' - ', a.pincode) as address,
             json_agg(json_build_object(
               'name', oi.name, 
               'qty', oi.quantity,
               'image', oi.image,
               'selected_size', oi.selected_size
             )) as items_summary,
             -- Timeline properties block
             to_char(o.created_at, 'DD/MM/YYYY, HH24:MI:SS') as "preparingDate",
             o.dispatched_at as "dispatchedDate",
             o.delivered_at as "deliveredDate",
             o.expected_delivery as "expectedDelivery"
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      CROSS JOIN LATERAL (
         SELECT phone, street_name, landmark, city, district, state, pincode 
         FROM addresses WHERE id = o.address_id LIMIT 1
      ) a
      GROUP BY o.id, u.name, u.email, a.phone, a.street_name, a.landmark, a.city, a.district, a.state, a.pincode
      ORDER BY o.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    
    // Pass items summary down as a clean structural JSON block array
    const formattedRows = rows.map(row => ({
      ...row,
      items: row.items_summary, 
      total: `₹${Number(row.total).toLocaleString('en-IN')}`,
      timeline: {
        preparingDate: row.preparingDate,
        dispatchedDate: row.dispatchedDate,
        deliveredDate: row.deliveredDate,
        expectedDelivery: row.expectedDelivery || "Not Set"
      }
    }));

    return res.status(200).json(formattedRows);
  } catch (error) {
    console.error("Admin Fetch Orders Error Trace:", error);
    return res.status(500).json({ message: "Failed retrieving marketplace master registry." });
  }
};

// Update order status workflow increments from Admin UI
export const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, expectedDelivery, dispatchedDate, deliveredDate } = req.body;

    // Dynamically construct update vector based on workflow progression
    let updateQuery = `UPDATE orders SET status = $1`;
    const queryParams = [status];

    if (expectedDelivery !== undefined) {
      updateQuery += `, expected_delivery = $${queryParams.length + 1}`;
      queryParams.push(expectedDelivery);
    }
    if (dispatchedDate !== undefined) {
      updateQuery += `, dispatched_at = $${queryParams.length + 1}`;
      queryParams.push(dispatchedDate);
    }
    if (deliveredDate !== undefined) {
      updateQuery += `, delivered_at = $${queryParams.length + 1}`;
      queryParams.push(deliveredDate);
    }

    updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING *;`;
    queryParams.push(orderId);

    // Assuming pool or client is imported from db configuration
    const { rows } = await pool.query(updateQuery, queryParams);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Target order tracking node not found." });
    }

    return res.status(200).json({ 
      message: "Order logistics tracking state updated successfully.",
      order: rows[0] 
    });
  } catch (error) {
    console.error("Admin order pipeline patch breakdown:", error);
    return res.status(500).json({ message: "Failed updating logistics lifecycle." });
  }
};