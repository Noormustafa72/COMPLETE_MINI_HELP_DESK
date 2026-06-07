import { Request, Response, NextFunction } from 'express';

/* ================= Global Error Handler ================= */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('🔥 Error:', err);

/* ================= Mongoose Validation Error ================= */
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: err.message,
    });
  }

/* ================= Invalid MongoDB ID ================= */
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

/* ================= Duplicate Key Error ================= */
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

/* ================= Default Server Error ================= */
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}