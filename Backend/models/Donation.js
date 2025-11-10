import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  donationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    default: 1,
    min: 1
  },
  location: {
    type: String,
    trim: true
  },
  bloodCampId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodCamp'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
donationSchema.index({ userId: 1, donationDate: -1 });
donationSchema.index({ donorId: 1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;

