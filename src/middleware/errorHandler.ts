import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof AppError) {
    ResponseHandler.error(res, error.message, error.statusCode);
    return;
  }

  ResponseHandler.error(res, 'Internal server error', 500);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHandler.error(res, `Route ${req.originalUrl} not found`, 404);
};
