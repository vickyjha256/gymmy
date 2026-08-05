import { NextFunction, Request, Response } from "express";
import * as membershipPlanService from "./membershipPlan.service";
import {
  createMembershipPlanSchema,
  updateMembershipPlanSchema,
} from "./membershipPlan.validation";

type PlanParams = {
  id: string;
};

export const createMembershipPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createMembershipPlanSchema.parse(req.body);

    const plan = await membershipPlanService.createMembershipPlan(
      req.user!.gymId,
      data
    );

    res.status(201).json({
      success: true,
      message: "Membership plan created successfully.",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const getMembershipPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plans = await membershipPlanService.getMembershipPlans(
      req.user!.gymId
    );

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMembershipPlan = async (
  req: Request<PlanParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateMembershipPlanSchema.parse(req.body);

    const plan = await membershipPlanService.updateMembershipPlan(
      req.user!.gymId,
      req.params.id,
      data
    );

    res.status(200).json({
      success: true,
      message: "Membership plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMembershipPlan = async (
  req: Request<PlanParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await membershipPlanService.deleteMembershipPlan(
      req.user!.gymId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Membership plan deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};