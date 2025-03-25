import { Request, Response } from 'express';
import Content from '../models/Content';

export const getContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOne({ page: req.params.page });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;
    const updatedContent = await Content.findOneAndUpdate(
      { page: req.params.page },
      { title, description, content },
      { new: true, upsert: true }
    );
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 