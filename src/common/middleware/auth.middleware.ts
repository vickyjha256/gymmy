import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token) as {
      userId: string;
      gymId: string;
      role: "OWNER";
    };

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }

    next(error);
  }
};