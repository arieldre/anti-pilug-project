import mongoose from 'mongoose';

interface IContent {
  page: 'home' | 'profile' | 'about' | 'contact';
  title: string;
  description?: string;
  content: any;
  updatedAt: Date;
}

export interface IRecommendedContent {
  type: 'video' | 'research' | 'news';
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  date: Date;
  tags: string[];
  education: string;
  militaryService: string;
  city: string;
  level: number;
  politicalAlignment: number;
  createdAt: Date;
}

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
    required: true,
  },
  tags: [String],
  education: String,
  militaryService: String,
  city: String,
  level: Number,
  politicalAlignment: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Content = mongoose.model<IContent>('Content', contentSchema);
export const RecommendedContent = mongoose.model<IRecommendedContent>('RecommendedContent', recommendedContentSchema); 