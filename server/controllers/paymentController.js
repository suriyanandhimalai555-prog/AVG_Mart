import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { pool } from "../config/db.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Configure Nodemailer for Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // SSL required for 465
  auth: {
    user: process.env.EMAIL_USER, // e.g., support@avgmart.com
    pass: process.env.EMAIL_PASS  // Hostinger Email / App Password
  }
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

    // 1. Verify standard HMAC SHA256 Signature[cite: 2]
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

    // Fetch user details for sending email
    const userQuery = "SELECT name, email FROM users WHERE id = $1 LIMIT 1;";
    const { rows: userRows } = await client.query(userQuery, [req.user.id]);
    const userDetails = userRows[0] || { name: 'Valued Customer', email: '' };

    // Fetch contents of the cart before wiping[cite: 2]
    const cartQuery = "SELECT * FROM cart WHERE user_id = $1;";
    const { rows: cartItems } = await client.query(cartQuery, [req.user.id]);

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cannot checkout an empty loadout terminal registry." });
    }

    // 2. STOCK CHECK & DECREMENT: Check available inventory for each item[cite: 2]
    for (const item of cartItems) {
      const productRes = await client.query("SELECT count FROM products WHERE id = $1 FOR UPDATE;", [item.product_id]);
      
      if (productRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Product ID ${item.product_id} no longer exists.` });
      }

      const currentCount = Number(productRes.rows[0].count || 0);
      const requestedQty = Number(item.quantity || 1);

      if (currentCount < requestedQty) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Product "${item.name}" is out of stock or insufficient quantity available.` });
      }

      // Decrement the product count[cite: 2]
      await client.query(
        "UPDATE products SET count = GREATEST(count - $1, 0) WHERE id = $2;",
        [requestedQty, item.product_id]
      );
    }

    // Fetch delivery address details[cite: 2]
    const addressQuery = "SELECT * FROM addresses WHERE id = $1 LIMIT 1;";
    const { rows: addressRows } = await client.query(addressQuery, [address_id]);
    
    if (addressRows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Delivery address node not found." });
    }
    const addressObj = addressRows[0];
    const orderPincode = String(addressObj.pincode).trim();

    // Match branch admin based on pincodes[cite: 2]
    const findBranchQuery = `
      SELECT id, node_id FROM branch_admins 
      WHERE pincodes LIKE $1 OR pincodes LIKE $2 OR pincodes LIKE $3 OR pincodes = $4 LIMIT 1;
    `;
    const searchPatterns = [
      `%, ${orderPincode},%`,
      `${orderPincode},%`,
      `%, ${orderPincode}`,
      orderPincode
    ];
    
    const { rows: branchRows } = await client.query(findBranchQuery, searchPatterns);
    const assignedBranchNodeId = branchRows.length > 0 ? branchRows[0].node_id : null;

    // Insert into master orders ledger[cite: 2]
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

    // Snapshot individual order items[cite: 2]
    const insertItemQuery = `
      INSERT INTO order_items (order_id, product_id, name, price, quantity, image, selected_size)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    for (const item of cartItems) {
      const productSize = item.selected_size || item.size || null;

      await client.query(insertItemQuery, [
        razorpay_order_id, 
        item.product_id, 
        item.name, 
        item.price, 
        item.quantity, 
        item.image,
        productSize
      ]);
    }

    // Clear active user cart[cite: 2]
    const clearCartQuery = "DELETE FROM cart WHERE user_id = $1;";
    await client.query(clearCartQuery, [req.user.id]);

    await client.query("COMMIT");

    // 3. SEND CONFIRMATION EMAIL TO CUSTOMER WITH PREMIER BRANDED TEMPLATE
    if (userDetails.email) {
      try {
        const itemsListHtml = cartItems.map((item, idx) => `
          <tr style="border-bottom: 1px solid #EBEBEB; background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB'};">
            <td style="padding: 14px 16px; width: 60px; text-align: center;">
              ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #E5E7EB;" />` : '<div style="width: 48px; height: 48px; background: #E5E7EB; border-radius: 8px;"></div>'}
            </td>
            <td style="padding: 14px 16px; font-size: 14px; color: #0A224E; font-weight: 600;">
              ${item.name}
              ${item.selected_size ? `<span style="display: block; font-size: 11px; color: #6B7280; font-weight: 400; margin-top: 2px;">Size: ${item.selected_size}</span>` : ''}
            </td>
            <td style="padding: 14px 16px; font-size: 14px; color: #0A224E; font-weight: 700; text-align: center;">
              x${item.quantity}
            </td>
            <td style="padding: 14px 16px; font-size: 14px; color: #0A224E; font-weight: 700; text-align: right;">
              ₹${Number(item.price).toFixed(2)}
            </td>
          </tr>
        `).join('');

        const formattedAddress = `${addressObj.street_name || addressObj.streetName}${addressObj.landmark ? `, ${addressObj.landmark}` : ''}, ${addressObj.city}, ${addressObj.district ? `${addressObj.district}, ` : ''}${addressObj.state} - ${addressObj.pincode}`;

        const emailOptions = {
          from: `"AVG Mart" <${process.env.EMAIL_USER}>`,
          to: userDetails.email,
          subject: `Order Confirmed #${razorpay_order_id.slice(-8).toUpperCase()} - AVG Mart`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #EBEBEB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #EBEBEB; padding: 30px 10px;">
                <tr>
                  <td align="center">
                    
                    <!-- Main Card Container -->
                    <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
                      
                      <!-- Header Banner -->
                      <tr>
                        <td style="background-color: #0A224E; padding: 32px 24px; text-align: center;">
                          <h1 style="color: #A5CE00; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                            AVG MART
                          </h1>
                          <p style="color: #FFFFFF; margin: 8px 0 0 0; font-size: 13px; font-weight: 500; opacity: 0.9;">
                            Order Confirmation & Payment Receipt
                          </p>
                        </td>
                      </tr>

                      <!-- Welcome Greeting Block -->
                      <tr>
                        <td style="padding: 32px 28px 20px 28px;">
                          <div style="background-color: #F4F8E8; border-left: 4px solid #A5CE00; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                            <h2 style="color: #0A224E; margin: 0 0 4px 0; font-size: 18px; font-weight: 800;">
                              Order Confirmed!
                            </h2>
                            <p style="color: #4B5563; margin: 0; font-size: 13px; line-height: 1.5;">
                              Hello <strong>${userDetails.name}</strong>, thank you for your order! We have registered your transaction and are processing your shipment.
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Metadata Snapshot Grid -->
                      <tr>
                        <td style="padding: 0 28px 24px 28px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
                            <tr>
                              <td style="padding: 6px 8px; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase; width: 35%;">Order Reference</td>
                              <td style="padding: 6px 8px; font-size: 13px; color: #0A224E; font-weight: 700; font-family: monospace;">${razorpay_order_id}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 8px; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase;">Payment Token</td>
                              <td style="padding: 6px 8px; font-size: 13px; color: #0A224E; font-weight: 700; font-family: monospace;">${razorpay_payment_id}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 8px; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase;">Shipping To</td>
                              <td style="padding: 6px 8px; font-size: 12px; color: #0A224E; font-weight: 600; line-height: 1.4;">${formattedAddress}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Cart Items Heading -->
                      <tr>
                        <td style="padding: 0 28px 12px 28px;">
                          <h3 style="color: #10367D; margin: 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                            Purchased Items
                          </h3>
                        </td>
                      </tr>

                      <!-- Items Breakdown Table -->
                      <tr>
                        <td style="padding: 0 28px 20px 28px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; border-collapse: separate;">
                            <thead>
                              <tr style="background-color: #10367D; color: #FFFFFF;">
                                <th style="padding: 10px; font-size: 11px; text-transform: uppercase; font-weight: 700; text-align: center;">Item</th>
                                <th style="padding: 10px; font-size: 11px; text-transform: uppercase; font-weight: 700; text-align: left;">Product Details</th>
                                <th style="padding: 10px; font-size: 11px; text-transform: uppercase; font-weight: 700; text-align: center;">Qty</th>
                                <th style="padding: 10px; font-size: 11px; text-transform: uppercase; font-weight: 700; text-align: right;">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${itemsListHtml}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- Grand Total Summary Box -->
                      <tr>
                        <td style="padding: 0 28px 32px 28px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A224E; border-radius: 12px; padding: 20px;">
                            <tr>
                              <td style="color: #FFFFFF; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                Total Amount Paid
                              </td>
                              <td style="color: #A5CE00; font-size: 24px; font-weight: 900; text-align: right; font-family: monospace;">
                                ₹${Number(amount).toFixed(2)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Support Footer -->
                      <tr>
                        <td style="background-color: #F9FAFB; padding: 24px 28px; text-align: center; border-top: 1px solid #E5E7EB;">
                          <p style="color: #6B7280; font-size: 12px; margin: 0 0 6px 0; font-weight: 500;">
                            Need assistance with your delivery? Contact our fulfillment support team.
                          </p>
                          <a href="mailto:support@avgmart.com" style="color: #10367D; font-size: 12px; font-weight: 700; text-decoration: none;">
                            support@avgmart.com
                          </a>
                          <p style="color: #9CA3AF; font-size: 11px; margin: 16px 0 0 0;">
                            &copy; ${new Date().getFullYear()} AVG Mart Inc. All rights reserved.
                          </p>
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>

            </body>
            </html>
          `
        };

        // Send email asynchronously
        transporter.sendMail(emailOptions).catch(mailErr => {
          console.error("Non-blocking order email delivery error:", mailErr);
        });

      } catch (mailPreparationError) {
        console.error("Order confirmation email payload build failure:", mailPreparationError);
      }
    }

    return res.status(200).json({ message: "Order processed, stock updated, email confirmation queued, and routed seamlessly." });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Signature processing error:", error);
    return res.status(500).json({ message: "Failed to persist operational ledger sequences." });
  }
  finally {
    client.release();
  }
};

export const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Access denied. Node missing payload identity signatures." });
    }

    const rawUserId = req.user.id;
    const parsedUserId = parseInt(rawUserId, 10);
    const finalUserId = isNaN(parsedUserId) ? rawUserId : parsedUserId;

    const query = `
      SELECT 
        o.id, 
        o.total_price AS "totalPrice", 
        o.status, 
        o.created_at AS "date",
        o.created_at,
        o.expected_delivery,
        o.dispatched_at,
        o.delivered_at,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', oi.product_id,
              'name', oi.name, 
              'price', oi.price, 
              'quantity', oi.quantity, 
              'image', oi.image,
              'selected_size', oi.selected_size
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id::text = $1::text
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    
    const { rows } = await pool.query(query, [String(finalUserId)]);
    return res.status(200).json(rows);
    
  } catch (error) {
    console.error("Fetch Live Orders Error:", error);
    return res.status(500).json({ message: "Failed retrieving order telemetry vectors." });
  }
};

export const getAllCustomerOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let isBranchAdmin = false;
    let branchNodeId = null;
    let branchPincodes = null;

    if (req.user.role === "branch_admin") {
      isBranchAdmin = true;

      const { rows } = await pool.query(
        `SELECT node_id, pincodes FROM branch_admins WHERE id = $1 LIMIT 1;`,
        [req.user.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Branch admin not found." });
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

        COALESCE(u.name, 'Customer') AS customer,
        COALESCE(u.email, 'N/A') AS email,
        COALESCE(a.phone, 'N/A') AS phone,

        CONCAT_WS(', ',
          NULLIF(a.street_name, ''),
          NULLIF(a.landmark, ''),
          NULLIF(a.city, ''),
          NULLIF(a.district, ''),
          NULLIF(a.state, ''),
          NULLIF(a.pincode, '')
        ) AS address,

        COALESCE(
          json_agg(
            json_build_object(
              'name', oi.name,
              'qty', oi.quantity,
              'image', oi.image,
              'size', oi.selected_size
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items

      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN addresses a ON a.id = o.address_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
    `;

    const params = [];

    if (isBranchAdmin) {
      query += `
        WHERE o.branch_node_id = $1
        OR $2 LIKE '%' || a.pincode || '%'
      `;
      params.push(branchNodeId, branchPincodes);
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

      ORDER BY o.created_at DESC;
    `;

    const { rows } = await pool.query(query, params);

    const formatted = rows.map(order => ({
      id: order.id,
      customer: order.customer || 'Customer',
      email: order.email || 'N/A',
      phone: order.phone || 'N/A',
      address: order.address || 'No Address Mapped',
      status: order.status || 'Preparing for Dispatch',
      total: `₹${Number(order.total_price || 0).toFixed(2)}`,
      items: order.items || [],
      timeline: {
        preparingDate: order.created_at ? new Date(order.created_at).toLocaleString('en-GB') : 'Not Tracked'
      }
    }));

    return res.json(formatted);

  } catch (err) {
    console.error("getAllCustomerOrders error:", err);
    return res.status(500).json({ message: err.message });
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

    const updatedOrder = rows[0];

    // FETCH CUSTOMER DETAILS TO SEND STATUS UPDATE EMAIL
    try {
      const customerQuery = `
        SELECT u.name, u.email 
        FROM users u 
        JOIN orders o ON o.user_id = u.id 
        WHERE o.id = $1 LIMIT 1;
      `;
      const { rows: customerRows } = await pool.query(customerQuery, [orderId]);

      if (customerRows.length > 0 && customerRows[0].email) {
        const customer = customerRows[0];
        
        // Define contextual message and badge based on new status
        let statusBadgeColor = '#10367D'; // Default Royal Blue
        let statusDescription = `Your order status has been updated to "${status}".`;

        if (status === 'Dispatched') {
          statusBadgeColor = '#0A224E';
          statusDescription = 'Your package has been packaged, cleared our facility, and dispatched with our delivery partner!';
        } else if (status === 'Delivered') {
          statusBadgeColor = '#A5CE00';
          statusDescription = 'Your shipment has been successfully handed off and marked as delivered. Enjoy your purchase!';
        } else if (status === 'Preparing' || status === 'Preparing for Dispatch') {
          statusBadgeColor = '#10367D';
          statusDescription = 'Our warehouse team is actively packaging and preparing your order for transit.';
        }

        const emailOptions = {
          from: `"AVG Mart Logistics" <${process.env.EMAIL_USER}>`,
          to: customer.email,
          subject: `Order Status Update: ${status} - #${orderId.slice(-8).toUpperCase()}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #EBEBEB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #EBEBEB; padding: 30px 10px;">
                <tr>
                  <td align="center">
                    
                    <!-- Main Container Card -->
                    <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
                      
                      <!-- Brand Banner Header -->
                      <tr>
                        <td style="background-color: #0A224E; padding: 32px 24px; text-align: center;">
                          <h1 style="color: #A5CE00; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                            AVG MART
                          </h1>
                          <p style="color: #FFFFFF; margin: 8px 0 0 0; font-size: 13px; font-weight: 500; opacity: 0.9;">
                            Live Logistics & Shipment Tracking Update
                          </p>
                        </td>
                      </tr>

                      <!-- Dynamic Status Banner -->
                      <tr>
                        <td style="padding: 32px 28px 20px 28px;">
                          <div style="background-color: #F4F8E8; border-left: 5px solid #A5CE00; padding: 20px; border-radius: 0 10px 10px 0;">
                            <span style="display: inline-block; background-color: ${statusBadgeColor}; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                              ${status}
                            </span>
                            <h2 style="color: #0A224E; margin: 6px 0 4px 0; font-size: 20px; font-weight: 800;">
                              Shipment Milestone Reached
                            </h2>
                            <p style="color: #4B5563; margin: 0; font-size: 14px; line-height: 1.5;">
                              Hello <strong>${customer.name}</strong>, ${statusDescription}
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Order Reference Block -->
                      <tr>
                        <td style="padding: 0 28px 24px 28px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
                            <tr>
                              <td style="padding: 6px 8px; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase; width: 40%;">Order ID</td>
                              <td style="padding: 6px 8px; font-size: 13px; color: #0A224E; font-weight: 700; font-family: monospace;">${orderId}</td>
                            </tr>
                            ${expectedDelivery ? `
                            <tr>
                              <td style="padding: 6px 8px; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase;">Estimated Arrival</td>
                              <td style="padding: 6px 8px; font-size: 13px; color: #10367D; font-weight: 800;">${expectedDelivery}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 6px 8px; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase;">Updated On</td>
                              <td style="padding: 6px 8px; font-size: 12px; color: #0A224E; font-weight: 600;">${new Date().toLocaleDateString('en-GB')}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Tracking Portal CTA Button -->
                      <tr>
                        <td style="padding: 0 28px 32px 28px; text-align: center;">
                          <a href="https://avgmart.com/orders/track/${orderId}" target="_blank" style="display: inline-block; background-color: #A5CE00; color: #0A224E; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(165,206,0,0.3);">
                            Track Order Live
                          </a>
                        </td>
                      </tr>

                      <!-- Customer Support Footer -->
                      <tr>
                        <td style="background-color: #F9FAFB; padding: 24px 28px; text-align: center; border-top: 1px solid #E5E7EB;">
                          <p style="color: #6B7280; font-size: 12px; margin: 0 0 6px 0; font-weight: 500;">
                            Have questions regarding this update? Contact our support team.
                          </p>
                          <a href="mailto:support@avgmart.com" style="color: #10367D; font-size: 12px; font-weight: 700; text-decoration: none;">
                            support@avgmart.com
                          </a>
                          <p style="color: #9CA3AF; font-size: 11px; margin: 16px 0 0 0;">
                            &copy; ${new Date().getFullYear()} AVG Mart Inc. All rights reserved.
                          </p>
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>

            </body>
            </html>
          `
        };

        // Send email asynchronously in the background
        transporter.sendMail(emailOptions).catch(mailErr => {
          console.error("Non-blocking status change email delivery failure:", mailErr);
        });
      }
    } catch (emailFetchErr) {
      console.error("Failed preparing customer email payload for status update:", emailFetchErr);
    }

    return res.status(200).json({ 
      message: "Order logistics tracking state updated successfully.",
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Admin order pipeline patch breakdown:", error);
    return res.status(500).json({ message: "Failed updating logistics lifecycle." });
  }
};