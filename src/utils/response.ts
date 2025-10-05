import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ResponseHandler {
  static success<T>(res: Response, data: T, statusCode = 200, message?: string): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, error: string, statusCode = 500): void {
    const response: ApiResponse = {
      success: false,
      error,
    };
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): void {
    this.success(res, data, 201, message);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }
}
