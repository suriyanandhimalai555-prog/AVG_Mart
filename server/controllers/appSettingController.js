// controllers/appSettingController.js
import AppSettingModel from '../models/appSettingModel.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await AppSettingModel.getSettings();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error getting app settings:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updatedSettings = await AppSettingModel.updateSettings(req.body);
    return res.status(200).json({
      success: true,
      message: 'App version settings updated successfully',
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating app settings:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};