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
  endDate.setDate(endDate.getDate() + plan.durationDays - 1);

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

  // Don't allow multiple advance renewals
  const upcomingMembership =
    await membershipRepository.findUpcomingMembership(memberId);

  if (upcomingMembership) {
    throw new AppError(
      "Member already has an upcoming membership.",
      409
    );
  }

  return membershipRepository.renewWithTransaction(
    memberId,
    plan.id,
    data.paymentMethod,
    plan.durationDays,
    plan.price
  );

  
  
};

export const updateMembershipStatuses = async () => {
  return membershipRepository.updateMembershipStatuses();
};



export const getUpcomingAndExpiringMemberships = async (
  gymId: string,
  days: number
) => {
  return membershipRepository.findUpcomingAndExpiring(
    gymId,
    days
  );
};

export const cancelMembership = async (
  gymId: string,
  membershipId: string
) => {
  
  const membership =
  await membershipRepository.findByIdForGym(
    membershipId,
    gymId
  );

  if (!membership) {
    throw new AppError("Membership not found.", 404);
  }

  
  if (
    membership.status !== "ACTIVE" &&
    membership.status !== "UPCOMING"
  ) {
    throw new AppError(
      "Only active or upcoming memberships can be cancelled.",
      400
    );
  }

  return membershipRepository.cancel(membershipId);
};

export const getMembershipById = async (
  gymId: string,
  membershipId: string
) => {
  const membership =
    await membershipRepository.findById(membershipId);

  if (
    !membership ||
    membership.member.gymId !== gymId
  ) {
    throw new AppError("Membership not found.", 404);
  }

  return membership;
};