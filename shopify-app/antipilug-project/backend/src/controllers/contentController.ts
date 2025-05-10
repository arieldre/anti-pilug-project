import { Request, Response } from 'express';
import { Content, RecommendedContent, IRecommendedContent } from '../models/Content';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Helper function to get thumbnail URL from various sources
const getThumbnailUrl = (link: string): string => {
  try {
    // YouTube video
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      const videoId = link.includes('youtube.com') 
        ? link.split('v=')[1]?.split('&')[0]
        : link.split('youtu.be/')[1];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // For other links, use the screenshot service
    const apiKey = process.env.SCREENSHOT_API_KEY;
    if (!apiKey) {
      console.warn('Screenshot API key not found in environment variables');
      return 'https://via.placeholder.com/300x200';
    }

    return `https://api.screenshotmachine.com?key=${apiKey}&url=${encodeURIComponent(link)}&dimension=1024x768`;
  } catch (error) {
    console.error('Error getting thumbnail:', error);
    return 'https://via.placeholder.com/300x200';
  }
};

// Get content for a specific page
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

// Get personalized content recommendations
export const getRecommendedContent = async (req: Request, res: Response) => {
  try {
    // Get user from token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's political alignment (mock data for now)
    const mockPoliticalAlignment = 0; // This will be replaced with actual questionnaire data

    // Build query based on user profile
    const query = {
      $or: [
        { education: user.education },
        { militaryService: user.militaryService },
        { city: user.city },
        { level: { $lte: user.level } }
      ],
      politicalAlignment: {
        $gte: mockPoliticalAlignment - 2,
        $lte: mockPoliticalAlignment + 2
      }
    };

    // Get recommended content
    let recommendedContent = await RecommendedContent.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    // Add thumbnails to content
    const contentWithThumbnails = recommendedContent.map(content => {
      const contentObj = content.toObject();
      return {
        ...contentObj,
        imageUrl: getThumbnailUrl(contentObj.link)
      };
    });

    res.json(contentWithThumbnails);
  } catch (error) {
    console.error('Error getting recommended content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update content for a specific page
export const updateContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      req.body,
      { new: true }
    );
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 