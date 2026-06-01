const multer = require('multer');

// Configure storage in memory or disk (using memory storage as a simple standard for API handlers)
const storage = multer.memoryStorage();

/**
 * Shared Multer Upload Middleware
 * Enforces a strict 2MB limit on image uploads.
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB strict limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only JPEG and PNG image mime types
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png image files are allowed'), false);
    }
  }
});

module.exports = upload;
