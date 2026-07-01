import { StockRequestModel } from '../models/stockRequestModel.js';

export const createRequest = async (req, res) => {
  try {
    const { productId, category, requestedCount, totalAmount } = req.body;
    
    if (!productId || !category || !requestedCount) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    // PAKKA FIX: Tie the request to the logged-in user's ID
    const adminId = req.user.id;

    const newRequest = await StockRequestModel.create({
      productId,
      category,
      requestedCount,
      totalAmount,
      adminId // 👈 Pass this to your model query
    });

    return res.status(201).json({ success: true, message: 'Stock request placed successfully', request: newRequest });
  } catch (error) {
    console.error('Error in createRequest controller:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    // PAKKA FIX: Pass user context down to model to handle dynamic isolation logic
    const data = await StockRequestModel.findAll({
      adminId: req.user.id,
      role: req.user.role
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getAllRequests controller:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expects 'Approved' or 'Rejected'

    // Only allow global admins to change status pipelines
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized action. Admin access only.' });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update option' });
    }

    const updatedRequest = await StockRequestModel.updateStatus(id, status);
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Stock request record not found' });
    }

    return res.status(200).json({ success: true, message: `Request successfully ${status}`, request: updatedRequest });
  } catch (error) {
    console.error('Error in updateRequestStatus controller:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};