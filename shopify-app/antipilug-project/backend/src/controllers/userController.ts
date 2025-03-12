import { Request, Response } from 'express';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';

// Get user profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from authenticated request
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      birthDay,
      birthMonth,
      birthYear,
      city,
      education,
      educationCustom,
      militaryService,
      militaryServiceCustom,
    } = req.body;
    
    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }
    
    // Format birth date
    const birthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password, // Will be hashed by pre-save hook
      birthDate,
      city,
      education,
      educationCustom,
      militaryService,
      militaryServiceCustom,
      // Default values for other fields are set in the model
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Update user questionnaire changes left
export const updateQuestionnaireChanges = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    if (user.questionnaireChangesLeft <= 0) {
      res.status(400).json({ error: 'No questionnaire changes left' });
      return;
    }
    
    user.questionnaireChangesLeft -= 1;
    await user.save();
    
    res.json({ 
      success: true, 
      changesLeft: user.questionnaireChangesLeft 
    });
  } catch (error) {
    console.error('Error updating questionnaire changes:', error);
    res.status(500).json({ error: 'Failed to update questionnaire changes' });
  }
};