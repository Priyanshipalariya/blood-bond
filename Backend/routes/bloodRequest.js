import express from 'express';
import { authenticate } from '../middleware/auth.js';
import BloodRequest from '../models/BloodRequest.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/blood-requests
// @desc    Create a new blood request
// @access  Private
router.post('/', authenticate, [
  body('patientName').trim().notEmpty(),
  body('patientAge').isInt({ min: 0, max: 120 }),
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('unitsNeeded').isInt({ min: 1, max: 10 }),
  body('hospitalName').trim().notEmpty(),
  body('urgencyLevel').isIn(['low', 'medium', 'high', 'critical']),
  body('contactName').trim().notEmpty(),
  body('contactPhone').notEmpty()
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

    const requestData = {
      userId: req.user._id,
      ...req.body,
      requestDate: new Date()
    };

    const bloodRequest = new BloodRequest(requestData);
    await bloodRequest.save();

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      requestId: bloodRequest._id.toString(),
      request: bloodRequest
    });
  } catch (error) {
    console.error('Create blood request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/blood-requests/user/:userId
// @desc    Get all blood requests for a user
// @access  Private
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to view their own requests or admins
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    const requests = await BloodRequest.find({ userId })
      .sort({ requestDate: -1 });

    res.json({
      success: true,
      requests: requests.map(req => ({
        id: req._id.toString(),
        ...req.toObject()
      }))
    });
  } catch (error) {
    console.error('Get blood requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/blood-requests/:requestId
// @desc    Get a specific blood request
// @access  Private
router.get('/:requestId', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BloodRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blood request not found' 
      });
    }

    // Only allow the owner or admins to view
    if (request.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      request: {
        id: request._id.toString(),
        ...request.toObject()
      }
    });
  } catch (error) {
    console.error('Get blood request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/blood-requests/:requestId/status
// @desc    Update blood request status
// @access  Private
router.put('/:requestId/status', authenticate, [
  body('status').isIn(['pending', 'fulfilled', 'cancelled'])
], async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await BloodRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blood request not found' 
      });
    }

    // Only allow the owner or admins to update
    if (request.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: 'Blood request status updated',
      request
    });
  } catch (error) {
    console.error('Update blood request status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/blood-requests/:requestId
// @desc    Delete a blood request
// @access  Private
router.delete('/:requestId', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BloodRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blood request not found' 
      });
    }

    // Only allow the owner or admins to delete
    if (request.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    await BloodRequest.findByIdAndDelete(requestId);

    res.json({
      success: true,
      message: 'Blood request deleted successfully'
    });
  } catch (error) {
    console.error('Delete blood request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

