import { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement proper authentication
  // For now, just pass through
  next();
}; 