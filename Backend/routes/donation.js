import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/donations
// @desc    Record a new donation
// @access  Private
router.post('/', authenticate, [
  body('donationDate').isISO8601(),
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('units').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    // Find donor record
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must be registered as a donor first' 
      });
    }

    const donationData = {
      userId: req.user._id,
      donorId: donor._id,
      ...req.body
    };

    const donation = new Donation(donationData);
    await donation.save();

    // Update donor's last donation date
    donor.lastDonationDate = new Date(donationData.donationDate);
    await donor.save();

    // Update user's donation status
    await User.findByIdAndUpdate(req.user._id, {
      hasSuccessfullyDonated: true
    });

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      donation
    });
  } catch (error) {
    console.error('Record donation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/donations/user/:userId
// @desc    Get donation history for a user
// @access  Private
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to view their own donations or admins
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    const donations = await Donation.find({ userId })
      .sort({ donationDate: -1 })
      .populate('bloodCampId', 'campName location');

    res.json({
      success: true,
      donations: donations.map(donation => ({
        id: donation._id.toString(),
        donationDate: donation.donationDate,
        bloodType: donation.bloodType,
        units: donation.units,
        location: donation.location,
        bloodCamp: donation.bloodCampId ? {
          id: donation.bloodCampId._id.toString(),
          campName: donation.bloodCampId.campName,
          location: donation.bloodCampId.location
        } : null,
        notes: donation.notes
      }))
    });
  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

