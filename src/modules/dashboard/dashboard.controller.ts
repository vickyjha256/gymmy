import { NextFunction, Request, Response } from "express";
import * as dashboardService from "./dashboard.service";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await dashboardService.getDashboardStats(
      req.user!.gymId
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};