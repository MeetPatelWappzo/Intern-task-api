const Profile = require('../models/profile.model');
const { uploadImageBuffer } = require('../services/cloudinary.service');

/**
 * Helper to map mongoose Profile document to OpenAPI response structure
 */
const mapProfileResponse = (profile) => {
  return {
    id: profile._id.toString(),
    authId: profile.authId.toString(),
    fullName: profile.fullName,
    gender: profile.gender,
    profileUrl: profile.profileUrl,
    address: profile.address,
    universityName: profile.universityName,
    city: profile.city,
    guardianName: profile.guardianName,
    guardianPhoneNumber: profile.guardianPhoneNumber,
    personalMobileNumber: profile.personalMobileNumber
  };
};

/**
 * GET /api/profile
 * Retrieve profile linked with current authenticated user
 */
const getProfile = async (req, res, next) => {
  try {
    const authId = req.user.id;
    const profile = await Profile.findOne({ authId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(mapProfileResponse(profile));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/profile
 * Update profile details and optional avatar image file
 */
const updateProfile = async (req, res, next) => {
  try {
    const authId = req.user.id;
    const profile = await Profile.findOne({ authId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Handle profile image upload if file exists in request
    if (req.file) {
      try {
        const uploadResult = await uploadImageBuffer(req.file.buffer);
        profile.profileUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ error: 'Image upload failed. Please try again.' });
      }
    }

    // Merge textual profile updates
    const updatableFields = [
      'fullName',
      'gender',
      'address',
      'universityName',
      'city',
      'guardianName',
      'guardianPhoneNumber',
      'personalMobileNumber'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    // Save updated profile document
    await profile.save();

    return res.status(200).json(mapProfileResponse(profile));
  } catch (error) {
    // Catch validation constraints
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
