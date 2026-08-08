import { MembershipStatus } from "@prisma/client";

import * as membershipRepository from "./membership.repository";
import { CreateMembershipInput, RenewMembershipInput } from "./membership.validation";
import { AppError } from "../../common/utils/AppError";

import * as memberRepository from "../member/member.repository";
import * as membershipPlanRepository from "../membership-plan/membershipPlan.repository";

export const createMembership = async (
  gymId: string,
  data: CreateMembershipInput
) => {
  const member = await memberRepository.findById(data.memberId);

  if (!member || member.gymId !== gymId) {
    throw new AppError("Member not found.", 404);
  }

  const plan = await membershipPlanRepository.findById(data.membershipPlanId);

  if (!plan || plan.gymId !== gymId) {
    throw new AppError("Membership plan not found.", 404);
  }

  if (!plan.isActive) {
    throw new AppError("Membership plan is inactive.", 400);
  }

  const activeMembership =
    await membershipRepository.findActiveMembership(member.id);

  if (activeMembership) {
    throw new AppError(
      "Member already has an active membership.",
      409
    );
  }

  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  return membershipRepository.create({
    startDate,
    endDate,
    amountPaid: plan.price,
    paymentMethod: data.paymentMethod,
    status: MembershipStatus.ACTIVE,

    member: {
      connect: {
        id: member.id,
      },
    },

    membershipPlan: {
      connect: {
        id: plan.id,
      },
    },
  });
};


export const getMembershipHistory = async (
  gymId: string,
  memberId: string
) => {
  const member = await memberRepository.findById(memberId);

  if (!member || member.gymId !== gymId) {
    throw new AppError("Member not found.", 404);
  }

  return membershipRepository.findByMember(memberId);
};

export const renewMembership = async (
  gymId: string,
  memberId: string,
  data: RenewMembershipInput
) => {
  const member = await memberRepository.findById(memberId);

  if (!member || member.gymId !== gymId) {
    throw new AppError("Member not found.", 404);
  }

  const plan = await membershipPlanRepository.findById(
    data.membershipPlanId
  );

  if (!plan || plan.gymId !== gymId) {
    throw new AppError("Membership plan not found.", 404);
  }

  if (!plan.isActive) {
    throw new AppError("Membership plan is inactive.", 400);
  }

  const currentMembership =
    await membershipRepository.findActiveMembershipByMember(
      memberId
    );

  if (!currentMembership) {
    throw new AppError(
      "Member does not have an active membership.",
      400
    );
  }

  const today = new Date();

  const startDate =
    currentMembership.endDate > today
      ? new Date(currentMembership.endDate)
      : today;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  return membershipRepository.renew(
    currentMembership.id,
    {
      startDate,
      endDate,
      amountPaid: plan.price,
      paymentMethod: data.paymentMethod,
      status: "ACTIVE",

      member: {
        connect: {
          id: memberId,
        },
      },

      membershipPlan: {
        connect: {
          id: plan.id,
        },
      },
    }
  );
};