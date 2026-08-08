import { NextFunction, Request, Response } from "express";
import * as membershipService from "./membership.service";
import { createMembershipSchema } from "./membership.validation";

export const createMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createMembershipSchema.parse(req.body);

    const membership =
      await membershipService.createMembership(
        req.user!.gymId,
        data
      );

    res.status(201).json({
      success: true,
      message: "Membership assigned successfully.",
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};


type MembershipParams = {
  memberId: string;
};

export const getMembershipHistory = async (
  req: Request<MembershipParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberships =
      await membershipService.getMembershipHistory(
        req.user!.gymId,
        req.params.memberId
      );

    res.status(200).json({
      success: true,
      data: memberships,
    });
  } catch (error) {
    next(error);
  }
};