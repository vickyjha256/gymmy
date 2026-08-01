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