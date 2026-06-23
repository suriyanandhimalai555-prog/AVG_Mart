import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserModel, findUserByEmailModel } from "../models/userModel.js";

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if account already exists
    const existingUser = await findUserByEmailModel(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password for security storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine role (Default to 'user' if not specified or specified from Postman)
    const userRole = role === "admin" ? "admin" : "user";

    // Create user profile in PostgreSQL
    const newUser = await createUserModel(name, email, hashedPassword, userRole);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Lookup credentials
    const user = await findUserByEmailModel(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Match stored password hash against submitted data
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create secure authentication login token
    const token = jwt.sign(
      { id: user.id, role: user.role },
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};