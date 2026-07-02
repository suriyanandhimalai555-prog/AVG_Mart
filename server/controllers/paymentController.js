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
  const client = await pool.connect(); 
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

    await client.query("BEGIN");

    // Fetch the target pincode for this order using address_id
    const addressQuery = "SELECT pincode FROM addresses WHERE id = $1 LIMIT 1;";
    const { rows: addressRows } = await client.query(addressQuery, [address_id]);
    
    if (addressRows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Delivery address node not found." });
    }
    const orderPincode = String(addressRows[0].pincode).trim();

    // DYNAMIC MATCHING ENGINE: Find branch admin that has this pincode assigned
    // This matches the comma-separated string formatting in your database table
    const findBranchQuery = `
      SELECT id, node_id FROM branch_admins 
      WHERE pincodes LIKE $1 OR pincodes LIKE $2 OR pincodes LIKE $3 OR pincodes = $4 LIMIT 1;
    `;
    // Formulate padding safeguards for comma-delimited matching variants
    const searchPatterns = [
      `%, ${orderPincode},%`, // Middle
      `${orderPincode},%`,    // Front
      `%, ${orderPincode}`,   // End
      orderPincode            // Single isolated value
    ];
    
    const { rows: branchRows } = await client.query(findBranchQuery, searchPatterns);
    const assignedBranchNodeId = branchRows.length > 0 ? branchRows[0].node_id : null;

    // Fetch contents of the cart before wiping
    const cartQuery = "SELECT * FROM cart WHERE user_id = $1;";
    const { rows: cartItems } = await client.query(cartQuery, [req.user.id]);

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cannot checkout an empty loadout terminal registry." });
    }

    // Insert into master orders ledger along with its assigned branch identity trace
    const insertOrderQuery = `
      INSERT INTO orders (id, user_id, address_id, total_price, payment_id, branch_node_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    await client.query(insertOrderQuery, [
      razorpay_order_id, 
      req.user.id, 
      address_id, 
      amount, 
      razorpay_payment_id, 
      assignedBranchNodeId
    ]);

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
    return res.status(200).json({ message: "Order processed and routed seamlessly." });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Signature processing error:", error);
    return res.status(500).json({ message: "Failed to persist operational ledger sequences." });
  } finally {
    client.release();
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.total_price as "totalPrice", o.status, o.created_at as date,
             o.expected_delivery as "expected_delivery", o.delivered_at as "delivered_at",
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
    console.error("Fetch Live Orders Error:", error);
    return res.status(500).json({ message: "Failed retrieving order telemetry vectors." });
  }
};

// Fetch all customer orders - Dynamically filtered for Branch Admins vs Super Admin
export const getAllCustomerOrders = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    let isAdmin = false;
    let isBranchAdmin = false;
    let branchNodeId = null;
    let branchPincodes = null;

    // MASTER ADMIN
    if (req.user.role === "admin") {
      isAdmin = true;
    }

    // BRANCH ADMIN
    if (req.user.role === "branch_admin") {

      isBranchAdmin = true;

      const { rows } = await pool.query(
        `
        SELECT
        node_id,
        pincodes
        FROM branch_admins
        WHERE id=$1
        LIMIT 1
        `,
        [req.user.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Branch admin not found."
        });
      }

      branchNodeId = rows[0].node_id;
      branchPincodes = rows[0].pincodes;
    }

    let query = `
      SELECT
        o.id,
        o.total_price,
        o.status,
        o.created_at,
        o.branch_node_id,

        u.name AS customer,
        u.email,

        a.phone,

        CONCAT(
          a.street_name, ', ',
          a.landmark, ', ',
          a.city, ', ',
          a.district, ', ',
          a.state, ' - ',
          a.pincode
        ) AS address,

        json_agg(
          json_build_object(
            'name',oi.name,
            'qty',oi.quantity,
            'image',oi.image
          )
        ) AS items

      FROM orders o

      JOIN users u
      ON u.id=o.user_id

      JOIN addresses a
      ON a.id=o.address_id

      JOIN order_items oi
      ON oi.order_id=o.id
    `;

    const params = [];

    if (isBranchAdmin) {

      query += `
      WHERE
      o.branch_node_id=$1
      OR
      $2 LIKE '%'||a.pincode||'%'
      `;

      params.push(branchNodeId);
      params.push(branchPincodes);
    }

    query += `
      GROUP BY
      o.id,
      u.name,
      u.email,
      a.phone,
      a.street_name,
      a.landmark,
      a.city,
      a.district,
      a.state,
      a.pincode

      ORDER BY o.created_at DESC
    `;

    const { rows } = await pool.query(query, params);

    const formatted = rows.map(order => ({
      id: order.id,
      customer: order.customer,
      email: order.email,
      phone: order.phone,
      address: order.address,
      status: order.status,
      total: `₹${Number(order.total_price).toFixed(2)}`,
      items: order.items,
      timeline: {
        preparingDate: order.created_at
      }
    }));

    return res.json(formatted);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: err.message
    });

  }
};

export const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, expectedDelivery, dispatchedDate, deliveredDate } = req.body;

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