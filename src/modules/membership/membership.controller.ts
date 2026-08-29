import { NextFunction, Request, Response } from "express";
import * as membershipService from "./membership.service";
import { createMembershipSchema, renewMembershipSchema } from "./membership.validation";
import { AppError } from "../../common/utils/AppError";


type MembershipParams = {
  memberId: string;
  membershipId: string;
};

type CancelMembershipParams = {
  membershipId: string;
};


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


type RenewMembershipParams = {
  memberId: string;
};

export const renewMembership = async (
  req: Request<RenewMembershipParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = renewMembershipSchema.parse(req.body);

    const membership = await membershipService.renewMembership(
      req.user!.gymId,
      req.params.memberId,
      data
    );

    res.status(201).json({
      success: true,
      message: "Membership renewed successfully.",
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};


export const getUpcomingAndExpiringMemberships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const days = Number(req.query.days) || 7;

    if (days < 1 || days > 30) {
      throw new AppError(
        "Days must be between 1 and 30.",
        400
      );
    }

    const memberships =
      await membershipService.getUpcomingAndExpiringMemberships(
        req.user!.gymId,
        days
      );

    res.status(200).json({
      success: true,
      data: memberships,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMembership = async (
  req: Request<CancelMembershipParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const membership =
      await membershipService.cancelMembership(
        req.user!.gymId,
        req.params.membershipId
      );

    res.status(200).json({
      success: true,
      message: "Membership cancelled successfully.",
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};


export const getMembershipById = async (
  req: Request<MembershipParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const membership =
      await membershipService.getMembershipById(
        req.user!.gymId,
        req.params.membershipId
      );

    res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};