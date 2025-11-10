import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        uid: user._id.toString()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const allowedUpdates = [
      'fullName', 'displayName', 'phone', 'dob', 'dateOfBirth', 'gender',
      'bloodType', 'bloodGroup', 'pincode', 'state', 'district', 'city',
      'weight', 'height', 'medicalConditions', 'emergencyContact',
      'emergencyContactPhone', 'consentBloodRequests'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle date fields - format to remove time component
    if (updates.dob && typeof updates.dob === 'string') {
      const dobDate = new Date(updates.dob);
      dobDate.setHours(0, 0, 0, 0);
      updates.dob = dobDate;
    }
    if (updates.dateOfBirth && typeof updates.dateOfBirth === 'string') {
      const dobDate = new Date(updates.dateOfBirth);
      dobDate.setHours(0, 0, 0, 0);
      updates.dateOfBirth = dobDate;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...user.toJSON(),
        uid: user._id.toString()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

