import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import { changePasswordSchema, updateProfileSchema } from "./user.validation";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await userService.getProfile(
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const profile = await userService.updateProfile(
      req.user!.userId,
      req.user!.gymId,
      data
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = changePasswordSchema.parse(req.body);

    await userService.changePassword(
      req.user!.userId,
      data
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};