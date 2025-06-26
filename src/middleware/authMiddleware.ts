import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { UserService } from '../services/UserService';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
       res.status(401).json({ error: 'Access token required' });
       return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const user = await UserService.findById(decoded.userId);
    if (!user) {
       res.status(401).json({ error: 'Invalid token' });
       return;
    }

    if (user.is_blacklisted) {
       res.status(403).json({ error: 'User is blacklisted' });
       return;
    }

    req.user = user;
    next();
  } catch (error) {
     res.status(403).json({ error: 'Invalid token' });
     return;
  }
};