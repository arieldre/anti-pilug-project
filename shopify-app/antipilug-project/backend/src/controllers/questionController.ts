import { Request, Response } from 'express';
import Question from '../models/QuestionModel';
import UserQuestion from '../models/UserQuestionModel';

// Get all questions by type
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    
    const query = type ? { type } : {};
    
    const questions = await Question.find(query);
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// Save user's questionnaire answers
export const saveUserAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { answers } = req.body;
    
    // Validate answers format
    if (!Array.isArray(answers)) {
      res.status(400).json({ error: 'Answers must be an array' });
      return;
    }
    
    // Delete any previous answers for this user
    await UserQuestion.deleteMany({ userId });
    
    // Save new answers
    const userAnswers = answers.map((answer) => ({
      userId,
      questionId: answer.questionId,
      answer: answer.answer,
      rank: answer.rank,
    }));
    
    await UserQuestion.insertMany(userAnswers);
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving questionnaire answers:', error);
    res.status(500).json({ error: 'Failed to save questionnaire answers' });
  }
};

// Get user's questionnaire answers
export const getUserAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    const userAnswers = await UserQuestion.find({ userId })
      .populate('questionId');
    
    res.json(userAnswers);
  } catch (error) {
    console.error('Error fetching user answers:', error);
    res.status(500).json({ error: 'Failed to fetch user answers' });
  }
};