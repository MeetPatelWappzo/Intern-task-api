const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer directly to Cloudinary using stream upload
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<Object>} - Resolves with Cloudinary upload result object
 */
const uploadImageBuffer = (fileBuffer, folder = 'profile_pictures') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteImage = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  uploadImageBuffer,
  deleteImage
};
