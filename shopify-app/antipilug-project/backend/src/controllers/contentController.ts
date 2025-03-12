import { Request, Response } from 'express';
import Content from '../models/ContentModel';

export const getContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, subject, politicalPerspective, country, sortBy, limit = 10, page = 1 } = req.query;
    
    const query: any = {};
    
    // Apply filters if provided
    if (type) query.type = type;
    if (subject) query.subject = subject;
    if (politicalPerspective) query.politicalPerspective = politicalPerspective;
    if (country) query.country = country;
    
    // Determine sort order
    let sortOptions: any = { date: -1 }; // Default: most recent
    if (sortBy === 'popular') {
      sortOptions = { views: -1 };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const content = await Content.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Content.countDocuments(query);
    
    res.json({
      content,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      totalItems: total,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);
    
    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }
    
    // Increment view count
    content.views = (content.views || 0) + 1;
    await content.save();
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

export const getFeaturedContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const featuredContent = await Content.find({ featured: true })
      .sort({ date: -1 })
      .limit(5);
    
    res.json(featuredContent);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Failed to fetch featured content' });
  }
};