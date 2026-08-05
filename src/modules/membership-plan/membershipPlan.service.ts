import { AppError } from "../../common/utils/AppError";
import * as membershipPlanRepository from "./membershipPlan.repository";

import {
  CreateMembershipPlanInput,
  UpdateMembershipPlanInput,
} from "./membershipPlan.validation";

export const createMembershipPlan = async (
  gymId: string,
  data: CreateMembershipPlanInput
) => {
  const existing =
    await membershipPlanRepository.findByName(
      gymId,
      data.name
    );

  if (existing) {
    throw new AppError(
      "Membership plan already exists.",
      409
    );
  }

  return membershipPlanRepository.create({
    ...data,
    gym: {
      connect: {
        id: gymId,
      },
    },
  });
};


export const getMembershipPlans = async (gymId: string) => {
  return membershipPlanRepository.findMany(gymId);
};

export const updateMembershipPlan = async (
  gymId: string,
  planId: string,
  data: UpdateMembershipPlanInput
) => {
  const plan = await membershipPlanRepository.findById(planId);

  if (!plan || plan.gymId !== gymId) {
    throw new AppError("Membership plan not found.", 404);
  }

  if (data.name && data.name !== plan.name) {
    const existing = await membershipPlanRepository.findByName(
      gymId,
      data.name
    );

    if (existing) {
      throw new AppError("Membership plan already exists.", 409);
    }
  }

  return membershipPlanRepository.update(planId, data);
};

export const deleteMembershipPlan = async (
  gymId: string,
  planId: string
) => {
  const plan = await membershipPlanRepository.findById(planId);

  if (!plan || plan.gymId !== gymId) {
    throw new AppError("Membership plan not found.", 404);
  }

  await membershipPlanRepository.remove(planId);
};