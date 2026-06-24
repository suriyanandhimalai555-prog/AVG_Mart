import bcrypt from "bcrypt";
// import { pool } from "../config/db.js";
import { 
  findUserByIdModel, 
  updatePasswordModel, 
  getAddressesByUserId, 
  createAddressModel, 
  updateAddressModel, 
  deleteAddressModel 
} from "../models/userModel.js";

// Fetch Current Active User Profile details
export const getProfile = async (req, res) => {
  try {
    const user = await findUserByIdModel(req.user.id);
    const addresses = await getAddressesByUserId(req.user.id);
    return res.status(200).json({ user, addresses });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user metrics profile data" });
  }
};

// Update active account security passwords
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Explicit Database row fetch with original secure hash payload 
    const query = "SELECT * FROM users WHERE id = $1;";
    const { rows } = await pool.query(query, [req.user.id]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User record not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect existing profile security string." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updatePasswordModel(req.user.id, hashedPassword);

    return res.status(200).json({ message: "Password structural update sequence absolute." });
  } catch (error) {
    console.error("Password Change System Error:", error); // <-- This prints the exact database issue to your terminal
    return res.status(500).json({ message: "Internal server handling system error." });
  }
};

// Create a new location address entry
export const addAddress = async (req, res) => {
  try {
    const { tag, phone, streetName, landmark, city, state, district, pincode } = req.body;

    // Structure the exact layout the model expects
    const addressData = {
      tag,
      phone,
      streetName,
      landmark,
      city,
      state,
      district,
      pincode
    };

    const newAddress = await createAddressModel(req.user.id, addressData);
    return res.status(201).json(newAddress);
  } catch (error) {
    console.error("Database Insert Error Matrix:", error); // This prints the true error to your backend terminal log
    return res.status(500).json({ message: "Failed adding structural geographic criteria." });
  }
};

// Update an existing location address entry
export const editAddress = async (req, res) => {
  try {
    const updated = await updateAddressModel(req.params.id, req.user.id, req.body);
    if (!updated) return res.status(404).json({ message: "Target metrics record unresolvable." });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed updating custom parameters layout." });
  }
};

// Remove a specific address record
export const removeAddress = async (req, res) => {
  try {
    const deleted = await deleteAddressModel(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: "Object reference not found or authorized." });
    return res.status(200).json({ message: "Resource deletion matrix successfully finalized." });
  } catch (error) {
    return res.status(500).json({ message: "Error removing physical context location." });
  }
};