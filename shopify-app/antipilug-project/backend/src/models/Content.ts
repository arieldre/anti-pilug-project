import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['home', 'profile', 'about', 'contact'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// New schema for recommended content
const recommendedContentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['video', 'research', 'news'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: [{
    type: String,
  }],
  education: {
    type: String,
    required: true,
  },
  militaryService: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  politicalAlignment: {
    type: Number,
    required: true,
    min: -10,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RecommendedContent = mongoose.model('RecommendedContent', recommendedContentSchema);
export default mongoose.model('Content', contentSchema); 