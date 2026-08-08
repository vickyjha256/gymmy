import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const create = (
  data: Prisma.MemberMembershipCreateInput
) => {
  return prisma.memberMembership.create({
    data,
  });
};

export const findActiveMembership = (
  memberId: string
) => {
  return prisma.memberMembership.findFirst({
    where: {
      memberId,
      status: "ACTIVE",
    },
  });
};

export const update = (
  id: string,
  data: Prisma.MemberMembershipUpdateInput
) => {
  return prisma.memberMembership.update({
    where: {
      id,
    },
    data,
  });
};

export const findByMember = (memberId: string) => {
  return prisma.memberMembership.findMany({
    where: {
      memberId,
    },
    include: {
      membershipPlan: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });
};

export const findActiveMembershipByMember = (
  memberId: string
) => {
  return prisma.memberMembership.findFirst({
    where: {
      memberId,
      status: "ACTIVE",
    },
    orderBy: {
      endDate: "desc",
    },
  });
};

export const renew = async (
  membershipId: string,
  data: Prisma.MemberMembershipCreateInput
) => {
  return prisma.$transaction(async (tx) => {
    await tx.memberMembership.update({
      where: {
        id: membershipId,
      },
      data: {
        status: "EXPIRED",
      },
    });

    return tx.memberMembership.create({
      data,
    });
  });
};