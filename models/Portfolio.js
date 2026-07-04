import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Portfolio owner (creator) is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Portfolio category is required'],
    },
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Portfolio media URL is required'],
    },
    mediaType: {
      type: String,
      enum: {
        values: ['image', 'video', 'audio'],
        message: '{VALUE} is not a valid media type. Choose image, video, or audio.',
      },
      required: [true, 'Media type is required'],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    toolsUsed: [
      {
        type: String,
        trim: true,
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster category and creator portfolio retrieval
portfolioSchema.index({ creator: 1 });
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ skills: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
