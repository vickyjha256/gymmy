import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { UserRole } from "@prisma/client";
import * as userRepository from "../../modules/user/user.repository";


export const authenticate = async (
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


    const user = await userRepository.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new AppError("Account is inactive.", 401);
    }



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


export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};