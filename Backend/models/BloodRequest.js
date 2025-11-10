import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientAge: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsNeeded: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  hospitalName: {
    type: String,
    required: true,
    trim: true
  },
  urgencyLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  scheduledDate: {
    type: Date
  },
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    pincode: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
bloodRequestSchema.index({ bloodType: 1, 'location.pincode': 1, status: 1 });
bloodRequestSchema.index({ userId: 1 });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

export default BloodRequest;

