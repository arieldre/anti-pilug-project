import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  militaryService: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
  },
  bio: {
    type: String,
    default: '',
  },
  coins: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  points: {
    type: Number,
    default: 0,
  },
  xpToNextLevel: {
    type: Number,
    default: 100,
  },
  callsMade: {
    type: Number,
    default: 0,
  },
  likesReceived: {
    type: Number,
    default: 0,
  },
  lastCalls: [{
    date: Date,
    duration: String,
    liked: Boolean,
  }],
  dailyStreak: {
    type: Number,
    default: 0,
  },
  questionnaireChangesLeft: {
    type: Number,
    default: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema); 