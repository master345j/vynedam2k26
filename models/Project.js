import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Project category is required'],
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    budget: {
      min: {
        type: Number,
        required: [true, 'Minimum budget is required'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum budget is required'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    duration: {
      type: String, // e.g. "2 weeks", "3 months"
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'filled', 'completed'],
      default: 'open',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for getting all applications associated with this project
projectSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'project',
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Indexes for projects
projectSchema.index({ recruiter: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
