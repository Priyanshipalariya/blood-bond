import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Donor from '../models/Donor.js';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/donors/register
// @desc    Register as a blood donor
// @access  Private
router.post('/register', authenticate, [
  body('donorName').trim().notEmpty(),
  body('phone').notEmpty(),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('dateOfBirth').isISO8601(),
  body('weight').isNumeric().isInt({ min: 45, max: 200 }),
  body('height').isNumeric().isInt({ min: 120, max: 250 })
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

    // Check if already registered
    const existingDonor = await Donor.findOne({ userId: req.user._id });
    if (existingDonor) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already registered as a donor' 
      });
    }

    // Format dateOfBirth to remove time component (set to start of day)
    let formattedDateOfBirth = req.body.dateOfBirth;
    if (req.body.dateOfBirth) {
      const dobDate = new Date(req.body.dateOfBirth);
      // Set time to 00:00:00 to avoid timezone issues
      dobDate.setHours(0, 0, 0, 0);
      formattedDateOfBirth = dobDate;
    }

    const donorData = {
      userId: req.user._id,
      ...req.body,
      dateOfBirth: formattedDateOfBirth,
      registrationDate: new Date()
    };

    const donor = new Donor(donorData);
    await donor.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      isRegisteredDonor: true,
      donorRegistrationDate: new Date(),
      donorStatus: 'registered',
      ...(req.body.location && {
        pincode: req.body.location.pincode,
        state: req.body.location.state,
        district: req.body.location.district,
        city: req.body.location.city
      })
    });

    res.status(201).json({
      success: true,
      message: 'Donor registration successful',
      donor
    });
  } catch (error) {
    console.error('Donor registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/donors/eligibility/:userId
// @desc    Check donation eligibility
// @access  Private
router.get('/eligibility/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to check their own eligibility or admins
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    const donor = await Donor.findOne({ userId });
    
    if (!donor) {
      return res.json({
        success: true,
        canDonate: false,
        reason: 'Not registered as a donor'
      });
    }

    // Check if last donation was more than 56 days ago
    const canDonate = !donor.lastDonationDate || 
      (new Date() - new Date(donor.lastDonationDate)) >= (56 * 24 * 60 * 60 * 1000);

    res.json({
      success: true,
      canDonate,
      reason: canDonate ? null : 'Last donation was less than 56 days ago'
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/donors/find
// @desc    Find available donors by blood type and pincode
// @access  Public
router.get('/find', async (req, res) => {
  try {
    const { bloodType, pincode } = req.query;

    if (!bloodType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Blood type is required' 
      });
    }

    console.log('Searching for donors with:', { bloodType, pincode });

    // First, find ALL donors with matching blood type (no filters)
    // Try exact match first
    let allDonorsWithBloodType = await Donor.find({ 
      bloodGroup: bloodType.trim() 
    });
    
    console.log(`Total donors in DB with blood type "${bloodType}": ${allDonorsWithBloodType.length}`);
    
    // If no results, try case-insensitive search
    if (allDonorsWithBloodType.length === 0) {
      console.log('No exact match, trying case-insensitive search...');
      allDonorsWithBloodType = await Donor.find({
        $expr: {
          $eq: [{ $toUpper: "$bloodGroup" }, bloodType.trim().toUpperCase()]
        }
      });
      console.log(`Case-insensitive search found: ${allDonorsWithBloodType.length} donors`);
    }
    
    if (allDonorsWithBloodType.length > 0) {
      const sample = allDonorsWithBloodType[0];
      console.log('Sample donor data:', {
        _id: sample._id,
        bloodGroup: sample.bloodGroup,
        pincode: sample.location?.pincode,
        consentBloodRequests: sample.consentBloodRequests,
        status: sample.status,
        isEligible: sample.isEligible,
        userId: sample.userId,
        donorName: sample.donorName,
        phone: sample.phone
      });
      
      // Also check if the query will match
      const testQuery = {
        bloodGroup: bloodType.trim(),
        status: { $in: ['registered', 'active'] }
      };
      const testResult = await Donor.find(testQuery);
      console.log(`Test query with status filter found: ${testResult.length} donors`);
    } else {
      console.log('No donors found with blood type:', bloodType);
    }

    // Build query progressively - start with just blood type
    let query = {
      bloodGroup: bloodType.trim()
    };

    // If pincode is provided, prioritize exact match
    let donors = [];
    
    if (pincode && pincode.trim().length === 6) {
      // Try exact pincode match first
      query['location.pincode'] = pincode.trim();
      query.consentBloodRequests = true;
      query.status = { $in: ['registered', 'active'] };
      query.isEligible = true;
      
      donors = await Donor.find(query).populate('userId', 'fullName email phone');
      console.log(`Found ${donors.length} donors with exact pincode match and all filters`);
    }

    // If no exact match or no pincode, search by blood type only
    if (donors.length === 0) {
      console.log('Searching by blood type only...');
      
      // Start with the simplest query - just blood type and status
      let searchQuery = {
        bloodGroup: bloodType.trim(),
        status: { $in: ['registered', 'active'] }
      };
      
      donors = await Donor.find(searchQuery).populate('userId', 'fullName email phone').limit(50);
      console.log(`Found ${donors.length} donors with blood type and status filters`);
      
      // If still no results, try with just blood type (no status filter)
      if (donors.length === 0) {
        console.log('Trying with just blood type (no status filter)...');
        searchQuery = {
          bloodGroup: bloodType.trim()
        };
        donors = await Donor.find(searchQuery).populate('userId', 'fullName email phone').limit(50);
        console.log(`Found ${donors.length} donors with blood type only`);
      }
      
      // If still no results, try with consent filter
      if (donors.length === 0) {
        console.log('Trying with consent filter...');
        searchQuery = {
          bloodGroup: bloodType.trim(),
          consentBloodRequests: true,
          status: { $in: ['registered', 'active'] }
        };
        donors = await Donor.find(searchQuery).populate('userId', 'fullName email phone').limit(50);
        console.log(`Found ${donors.length} donors with blood type, consent, and status filters`);
      }
    }

    // Calculate age for each donor
    console.log('Processing donors, total count:', donors.length);
    const donorsWithAge = donors.map((donor, index) => {
      try {
        console.log(`Processing donor ${index + 1}:`, {
          _id: donor._id,
          donorName: donor.donorName,
          bloodGroup: donor.bloodGroup,
          hasDateOfBirth: !!donor.dateOfBirth
        });
        
        // Handle both Mongoose document and plain object
        const donorObj = donor.toObject ? donor.toObject() : donor;
        
        const age = donorObj.dateOfBirth 
          ? new Date().getFullYear() - new Date(donorObj.dateOfBirth).getFullYear()
          : null;
        
        const processedDonor = {
          id: donorObj._id ? donorObj._id.toString() : null,
          donorName: donorObj.donorName || 'Unknown',
          phone: donorObj.phone || '',
          bloodGroup: donorObj.bloodGroup || bloodType,
          age: age || null,
          location: donorObj.location || {},
          registrationDate: donorObj.registrationDate || donorObj.createdAt || new Date()
        };
        
        console.log(`Processed donor ${index + 1}:`, processedDonor);
        return processedDonor;
      } catch (error) {
        console.error('Error processing donor:', error, donor);
        return null;
      }
    }).filter(donor => donor !== null); // Remove any null entries
    
    console.log('After processing, donors count:', donorsWithAge.length);

    console.log(`Returning ${donorsWithAge.length} donors`);
    console.log('Sample returned donor:', donorsWithAge.length > 0 ? donorsWithAge[0] : 'none');

    res.json({
      success: true,
      donors: donorsWithAge,
      count: donorsWithAge.length,
      searchParams: { bloodType, pincode }
    });
  } catch (error) {
    console.error('Find donors error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/donors/cancel/:userId
// @desc    Cancel donor registration
// @access  Private
router.delete('/cancel/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to cancel their own registration or admins
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    await Donor.findOneAndDelete({ userId });
    
    // Update user
    await User.findByIdAndUpdate(userId, {
      isRegisteredDonor: false,
      donorStatus: 'inactive'
    });

    res.json({
      success: true,
      message: 'Donor registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

