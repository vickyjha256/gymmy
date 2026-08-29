import { NextFunction, Request, Response } from "express";
import * as gymService from "./gym.service";
import { updateGymSchema } from "./gym.validation";

export const getGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gym = await gymService.getGym(
      req.user!.gymId
    );

    res.status(200).json({
      success: true,
      data: gym,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateGymSchema.parse(req.body);

    const gym = await gymService.updateGym(
      req.user!.gymId,
      data
    );

    res.status(200).json({
      success: true,
      message: "Gym updated successfully.",
      data: gym,
    });
  } catch (error) {
    next(error);
  }
};