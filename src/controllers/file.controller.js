const { uploadImageBuffer, deleteImage } = require('../services/cloudinary.service');

/**
 * POST /api/files/upload
 * Securely uploads a single file to Cloudinary
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please attach an image file in the "image" field' });
    }

    // Call Cloudinary upload helper (uses stream upload)
    const result = await uploadImageBuffer(req.file.buffer);

    return res.status(200).json({
      message: 'File uploaded successfully',
      secure_url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/files/delete
 * Securely deletes an asset from Cloudinary by its public_id
 */
const deleteFile = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: 'public_id is required' });
    }

    await deleteImage(public_id);

    return res.status(200).json({
      message: 'File deleted successfully from Cloudinary'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
