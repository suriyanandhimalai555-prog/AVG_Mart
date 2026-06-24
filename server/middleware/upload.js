import multer from 'multer';

// Keep file memory raw buffers intact instead of writing temporary files onto local disk
const storage = multer.memoryStorage();

export const uploadFiles = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only system image files are accepted!'), false);
    }
  }
});