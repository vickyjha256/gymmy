import { NextFunction, Request, Response } from "express";
import * as dashboardService from "./dashboard.service";
import { AppError } from "../../common/utils/AppError";

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

export const getRevenueStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = new Date();

    const from = req.query.from
      ? new Date(String(req.query.from))
      : new Date(now.getFullYear(), now.getMonth(), 1);

    const to = req.query.to
      ? new Date(String(req.query.to))
      : new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );

    if (
      Number.isNaN(from.getTime()) ||
      Number.isNaN(to.getTime())
    ) {
      throw new AppError(
        "Invalid date format. Use YYYY-MM-DD.",
        400
      );
    }

    if (from >= to) {
      throw new AppError(
        "From date must be before to date.",
        400
      );
    }

    const revenue = await dashboardService.getRevenueStats(
      req.user!.gymId,
      from,
      to
    );

    res.status(200).json({
      success: true,
      data: {
        from,
        to,
        ...revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};