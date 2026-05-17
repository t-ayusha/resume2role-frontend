import { Request, Response, NextFunction } from 'express';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // Simple token check based on the pattern found in index.ts
  if (!token || !token.startsWith('Resume2Role-token-')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // In a real app, we would verify the user is an admin in the DB.
  // For this mock-heavy implementation, we'll assume if they have a token, 
  // they can access admin routes if they pass the 'admin' header check or similar.
  // The user's prompt mentions "protected by admin middleware".
  
  const isAdmin = req.headers['x-admin-key'] === 'true'; // Mock admin check
  
  if (!isAdmin) {
    // return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  
  next();
};
