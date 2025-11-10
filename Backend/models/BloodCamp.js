import mongoose from 'mongoose';

const bloodCampSchema = new mongoose.Schema({
  campName: {
    type: String,
    required: true,
    trim: true
  },
  campDate: {
    type: Date,
    required: true
  },
  campTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String
  },
  contactEmail: {
    type: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
bloodCampSchema.index({ state: 1, district: 1, campDate: 1 });

const BloodCamp = mongoose.model('BloodCamp', bloodCampSchema);

export default BloodCamp;

