import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = error.status || 500;
  const errorMessage =
    error.message || (statusCode === 500 ? 'Internal server error' : 'An error occurred');

  logger.error(errorMessage, { stack: error.stack });

  if (error.name === 'ValidationError') {
    res.status(400).json({ success: false, error: errorMessage });
    return;
  }

  if (error.name === 'UnauthorizedError') {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  res.status(statusCode).json({ success: false, error: errorMessage });
};
