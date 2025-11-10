import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 45,
    max: 200
  },
  height: {
    type: Number,
    required: true,
    min: 120,
    max: 250
  },
  medicalConditions: {
    type: [String],
    default: []
  },
  medications: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    required: true
  },
  emergencyContactPhone: {
    type: String,
    required: true
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
  consentBloodRequests: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'active', 'inactive'],
    default: 'registered'
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  lastDonationDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
donorSchema.index({ bloodGroup: 1, 'location.pincode': 1 });
donorSchema.index({ userId: 1 });

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;

