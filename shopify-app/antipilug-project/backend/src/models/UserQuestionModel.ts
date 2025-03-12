import mongoose, { Document, Schema } from 'mongoose';

export interface IUserQuestion extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  answer: string | number | string[];
  rank?: number; // For ranking questions
  createdAt: Date;
  updatedAt: Date;
}

const UserQuestionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answer: {
      type: Schema.Types.Mixed,
      required: true,
    },
    rank: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserQuestion>('UserQuestion', UserQuestionSchema);