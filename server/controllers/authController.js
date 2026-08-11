import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { 
  createUserModel, 
  findUserByEmailModel, 
  findOrCreateGoogleUserModel,
  saveOtpModel,
  verifyOtpModel,
  markUserAsVerifiedModel,
  updatePasswordModel
} from "../models/userModel.js";
import BranchAdminModel from "../models/branchAdminModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper: Send Branded OTP Email
const sendOtpEmail = async (email, otp, title, messageText) => {
  const mailOptions = {
    from: `"AVG Mart Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${title} - AVG Mart Security Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #071640; font-family: sans-serif; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width: 500px; background-color: #0d1e4e; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 32px; text-align: center;">
                <tr>
                  <td>
                    <h1 style="color: #a3e635; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">AVG MART</h1>
                    <p style="color: #8b949e; font-size: 12px; margin-top: 4px; text-transform: uppercase;">Security Verification Code</p>
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
                    <p style="font-size: 14px; color: #e2e8f0; line-height: 1.5;">${messageText}</p>
                    
                    <div style="background-color: #071640; border: 1px solid #a3e635; border-radius: 12px; padding: 18px; margin: 24px 0;">
                      <span style="font-family: monospace; font-size: 32px; font-weight: 900; color: #a3e635; letter-spacing: 8px;">${otp}</span>
                    </div>

                    <p style="font-size: 11px; color: #64748b;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
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
  await transporter.sendMail(mailOptions);
};

// 1. SIGNUP STEP 1: CREATE ACCOUNT & SEND OTP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await findUserByEmailModel(email);
    if (existingUser) {
      if (existingUser.is_verified) {
        return res.status(400).json({ message: "Email is already registered. Please login." });
      }
      // If user exists but is unverified, update password and send fresh OTP
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await updatePasswordModel(existingUser.id, hashedPassword);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userRole = role === "admin" ? "admin" : "user";
      await createUserModel(name, email, hashedPassword, userRole, false);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await saveOtpModel(email, otp, "signup");

    // Send verification email
    await sendOtpEmail(email, otp, "Verify Your Email", "Use the OTP code below to verify your account registration.");

    return res.status(200).json({
      message: "Account initiated. Verification OTP sent to your email address.",
      email
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Failed to process signup request." });
  }
};

// 2. SIGNUP STEP 2: VERIFY SIGNUP OTP
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are strictly required." });
    }

    const isValid = await verifyOtpModel(email, otp, "signup");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP code." });
    }

    const updatedUser = await markUserAsVerifiedModel(email);
    
    // Auto-login token after verification
    const token = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Email verified successfully!",
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Verify Signup OTP Error:", error);
    return res.status(500).json({ message: "Failed verifying email address." });
  }
};

// 3. LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    let user = null;
    let assignedRole = "";

    const standardUser = await findUserByEmailModel(email);

    if (standardUser) {
      if (!standardUser.is_verified) {
        // Unverified user check
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await saveOtpModel(email, otp, "signup");
        await sendOtpEmail(email, otp, "Verify Your Email", "Please verify your email address to log in.");
        
        return res.status(403).json({ 
          message: "Email address is unverified. Verification OTP sent to email.",
          requiresVerification: true,
          email
        });
      }

      user = standardUser;
      assignedRole = standardUser.role;
    } else {
      const branchAdmin = await BranchAdminModel.findByEmail(email);
      if (branchAdmin) {
        user = branchAdmin;
        assignedRole = "branch_admin";
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: assignedRole },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: assignedRole,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 4. FORGOT PASSWORD STEP 1: REQUEST RESET OTP
export const requestForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const user = await findUserByEmailModel(email);
    if (!user) {
      return res.status(404).json({ message: "No account found registered with this email address." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await saveOtpModel(email, otp, "forgot_password");

    await sendOtpEmail(email, otp, "Password Reset Request", "You requested a password reset. Use the code below to update your password.");

    return res.status(200).json({
      message: "Password reset OTP sent to your email.",
      email
    });
  } catch (error) {
    console.error("Forgot Password OTP Error:", error);
    return res.status(500).json({ message: "Failed processing password reset request." });
  }
};

// 5. FORGOT PASSWORD STEP 2: VERIFY OTP AND RESET PASSWORD
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are strictly required." });
    }

    const isValid = await verifyOtpModel(email, otp, "forgot_password");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP code." });
    }

    const user = await findUserByEmailModel(email);
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updatePasswordModel(user.id, hashedPassword);

    return res.status(200).json({ message: "Password updated successfully. You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Failed updating security password." });
  }
};

// 6. GOOGLE AUTH
export const googleAuth = async (req, res) => {
  try {
    const { token, access_token } = req.body;
    const googleToken = token || access_token;

    if (!googleToken) {
      return res.status(400).json({ message: "Google Token is required." });
    }

    let email = "";
    let name = "";

    if (typeof googleToken === "string" && googleToken.split(".").length === 3) {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload?.email;
      name = payload?.name;
    } else {
      const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${googleToken}` },
      });

      if (!googleRes.ok) {
        return res.status(401).json({ message: "Invalid Google Access Token." });
      }

      const googleUser = await googleRes.json();
      email = googleUser.email;
      name = googleUser.name;
    }

    if (!email) {
      return res.status(400).json({ message: "Failed to obtain email from Google token." });
    }

    const user = await findOrCreateGoogleUserModel(name, email);

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ message: "Google authentication failed." });
  }
};