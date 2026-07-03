import BranchAdminModel from '../models/branchAdminModel.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { pool } from '../config/db.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

export const createBranchAdmin = async (req, res) => {
  try {
    const { name, email, branch, pincodes, password } = req.body;

    if (!name || !email || !branch || !pincodes || !password) {
      return res.status(400).json({ message: "All form field vectors are strictly mandatory." });
    }

    const existingAdmin = await BranchAdminModel.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: "An administrator with this email target already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const nodeId = `BR-${Math.floor(100 + Math.random() * 900)}`;

    const newAdmin = await BranchAdminModel.create({
      nodeId,
      name,
      email,
      branch,
      pincodes,
      hashedPassword: hashedPassword
    });

    const mailOptions = {
      from: `"Corporate Logistics Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'AVG-Mart Access Admin Credentials Assigned',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #0d1117; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #a3e635; text-transform: uppercase;">Administrative Access Confirmed</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>You have been assigned as the official branch admin for: <strong>${branch}</strong>.</p>
          <hr style="border: 1px solid #21262d; margin: 20px 0;" />
          <p style="font-size: 13px; color: #8b949e;">Your system access credentials are provided below:</p>
          <div style="background-color: #161b22; padding: 15px; border-radius: 8px; border: 1px solid #30363d; font-family: monospace;">
            <p style="margin: 4px 0;"><strong>System Node ID:</strong> ${nodeId}</p>
            <p style="margin: 4px 0;"><strong>Username Email:</strong> ${email}</p>
            <p style="margin: 4px 0;"><strong>Access Password:</strong> ${password}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Admin registered successfully. Credentials emailed.", admin: newAdmin });
  } catch (err) {
    console.error("Fulfillment pipeline error caught:", err);
    res.status(500).json({ message: "Internal server processing failure down the cluster pipeline." });
  }
};

// Filter data depending on user role
export const getAllBranchAdmins = async (req, res) => {
  try {

    if (req.user.role === "admin") {
      const admins = await BranchAdminModel.getAll();
      return res.status(200).json(admins);
    }

    if (req.user.role === "branch_admin") {

      const admin = await BranchAdminModel.findById(req.user.id);

      if (!admin) {
        return res.status(404).json({
          message: "Branch admin not found."
        });
      }

      return res.status(200).json(admin);
    }

    return res.status(403).json({
      message: "Unauthorized"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const updateBranchAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, branch, pincodes, currentPassword, newPassword } = req.body; 
    
    // Authorization Check
    if (req.user && req.user.role !== 'admin') {
      const targetAdmin = await BranchAdminModel.findById(id);
      if (!targetAdmin || targetAdmin.id !== Number(req.user.id)) {
        return res.status(403).json({ message: "Unauthorized action." });
      }
    }

    // Handle Secure Password Updates Separately
    if (newPassword) {
      // Fetch the full record containing the current hashed password
      const userRecord = await BranchAdminModel.findById(id);
      
      // Verify current password match
      const isMatch = await bcrypt.compare(currentPassword, userRecord.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password verification sequence." });
      }

      // Hash and commit the new password token
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await pool.query(
        `UPDATE branch_admins SET password = $1 WHERE id = $2`,
        [hashedPassword, id]
      );

      return res.status(200).json({ message: "Security gateway password modified cleanly." });
    }

    // Normal Profile Info Update (No password payload provided)
    const updated = await BranchAdminModel.update(id, { name, email, branch, pincodes });
    return res.status(200).json({ message: "Profile parameters synchronized successfully.", admin: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed updating database admin records." });
  }
};