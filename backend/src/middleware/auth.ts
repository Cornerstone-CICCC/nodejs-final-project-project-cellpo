import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  session?: {
    isAuthenticated?: boolean;
    userId?: string;
    [key: string]: any;
  };
}

export const checkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.isAuthenticated && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
