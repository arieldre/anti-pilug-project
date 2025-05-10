import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    const userData = user.toObject();
    if ('password' in userData) {
      delete userData.password;
    }
    res.json(userData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, profileImage },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      name, 
      phoneNumber, 
      city, 
      birthDate, 
      education, 
      militaryService 
    } = req.body;

    const user = new User({
      email,
      name,
      phoneNumber,
      city,
      birthDate,
      education,
      militaryService,
      coins: 0,
      level: 1,
      points: 0,
      xpToNextLevel: 100,
      callsMade: 0,
      likesReceived: 0,
      lastCalls: [],
      dailyStreak: 0,
      bio: '',
      questionnaireChangesLeft: 3
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 