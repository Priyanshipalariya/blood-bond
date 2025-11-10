import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import BloodCamp from '../models/BloodCamp.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/blood-camps
// @desc    Create a new blood camp (Admin only)
// @access  Private/Admin
router.post('/', authenticate, isAdmin, [
  body('campName').trim().notEmpty(),
  body('campDate').isISO8601(),
  body('campTime').trim().notEmpty(),
  body('location').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('district').trim().notEmpty(),
  body('organizer').trim().notEmpty()
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

    const campData = {
      ...req.body,
      createdBy: req.user._id
    };

    const bloodCamp = new BloodCamp(campData);
    await bloodCamp.save();

    res.status(201).json({
      success: true,
      message: 'Blood camp created successfully',
      camp: bloodCamp
    });
  } catch (error) {
    console.error('Create blood camp error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/blood-camps
// @desc    Get blood camps by state and district
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { state, district } = req.query;

    let query = { status: { $in: ['upcoming', 'ongoing'] } };
    
    if (state) {
      query.state = state;
    }
    if (district) {
      query.district = district;
    }

    const camps = await BloodCamp.find(query)
      .sort({ campDate: 1 })
      .populate('createdBy', 'fullName email');

    res.json({
      success: true,
      camps: camps.map(camp => ({
        id: camp._id.toString(),
        campName: camp.campName,
        campDate: camp.campDate,
        campTime: camp.campTime,
        location: camp.location,
        state: camp.state,
        district: camp.district,
        organizer: camp.organizer,
        description: camp.description,
        contactPhone: camp.contactPhone,
        contactEmail: camp.contactEmail,
        status: camp.status
      }))
    });
  } catch (error) {
    console.error('Get blood camps error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/blood-camps/:campId
// @desc    Get a specific blood camp
// @access  Public
router.get('/:campId', async (req, res) => {
  try {
    const { campId } = req.params;

    const camp = await BloodCamp.findById(campId)
      .populate('createdBy', 'fullName email');
    
    if (!camp) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blood camp not found' 
      });
    }

    res.json({
      success: true,
      camp: {
        id: camp._id.toString(),
        ...camp.toObject()
      }
    });
  } catch (error) {
    console.error('Get blood camp error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/blood-camps/:campId
// @desc    Update a blood camp (Admin only)
// @access  Private/Admin
router.put('/:campId', authenticate, isAdmin, async (req, res) => {
  try {
    const { campId } = req.params;

    const camp = await BloodCamp.findByIdAndUpdate(
      campId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!camp) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blood camp not found' 
      });
    }

    res.json({
      success: true,
      message: 'Blood camp updated successfully',
      camp
    });
  } catch (error) {
    console.error('Update blood camp error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/blood-camps/:campId
// @desc    Delete a blood camp (Admin only)
// @access  Private/Admin
router.delete('/:campId', authenticate, isAdmin, async (req, res) => {
  try {
    const { campId } = req.params;

    const camp = await BloodCamp.findByIdAndDelete(campId);
    
    if (!camp) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blood camp not found' 
      });
    }

    res.json({
      success: true,
      message: 'Blood camp deleted successfully'
    });
  } catch (error) {
    console.error('Delete blood camp error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

