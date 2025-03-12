import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  type: 'video' | 'talk' | 'research' | 'news';
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  date: Date;
  tags: string[];
  subject?: string;
  politicalPerspective?: 'progressive' | 'moderate' | 'conservative' | 'neutral';
  country?: string;
  views?: number;
  duration?: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['video', 'talk', 'research', 'news'],
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
    videoUrl: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
    subject: {
      type: String,
    },
    politicalPerspective: {
      type: String,
      enum: ['progressive', 'moderate', 'conservative', 'neutral'],
    },
    country: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContent>('Content', ContentSchema);