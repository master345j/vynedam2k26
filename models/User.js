import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: {
        values: ['creator', 'recruiter'],
        message: '{VALUE} is not a valid role. Choose either creator or recruiter.',
      },
      required: [true, 'Role is required'],
    },
    profile: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
      },
      title: {
        type: String,
        trim: true, // e.g. "Senior VFX Artist", "Creative Recruiter"
      },
      bio: {
        type: String,
        trim: true,
      },
      profileImage: {
        type: String, // Cloudinary or media asset URL
        default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      },
      location: {
        type: String,
        trim: true,
      },
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
      socialLinks: {
        website: String,
        linkedin: String,
        github: String,
        behance: String,
        artstation: String,
      },
    },
    isVerified: {
      type: Boolean,
      default: false, // For "Verified Creator Profiles" feature
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'not-looking'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for portfolios (will be referenced from the Portfolio model)
userSchema.virtual('portfolios', {
  ref: 'Portfolio',
  localField: '_id',
  foreignField: 'creator',
});

// Virtual for projects (will be referenced from the Project model if recruiter)
userSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'recruiter',
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
