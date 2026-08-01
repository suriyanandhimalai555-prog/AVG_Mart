import AppSettingModel from '../models/appSettingModel.js';

export const getSettings = async (req, res) => {
  try {
    const appType = req.query.appType || 'user';
    const settings = await AppSettingModel.getSettings(appType);
    
    if (!settings) {
      return res.status(200).json({
        success: true,
        data: {
          appType,
          androidCurrent: '',
          androidMinimum: '',
          iosCurrent: '',
          iosMinimum: '',
          releaseNotes: '',
          forceUpdate: true,
        }
      });
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