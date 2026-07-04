import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant (creator) is required'],
    },
    message: {
      type: String,
      required: [true, 'Application message is required'],
      trim: true,
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a creator from applying to the same project multiple times
applicationSchema.index({ project: 1, applicant: 1 }, { unique: true });

// Pre-save hook to increment applicationsCount on the Project model
applicationSchema.post('save', async function (doc) {
  try {
    await mongoose.model('Project').findByIdAndUpdate(doc.project, {
      $inc: { applicationsCount: 1 },
    });
  } catch (err) {
    console.error(`[Application Hook Error] Failed to increment application count: ${err.message}`);
  }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
