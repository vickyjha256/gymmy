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

export const findUpcomingMembership = (memberId: string) => {
  return prisma.memberMembership.findFirst({
    where: {
      memberId,
      status: "UPCOMING",
    },
    orderBy: {
      startDate: "asc",
    },
  });
};




export const renew = (
  data: Prisma.MemberMembershipCreateInput
) => {
  return prisma.memberMembership.create({
    data,
  });
};



export const updateMembershipStatuses = async () => {
  const now = new Date();

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Expire memberships whose end date has passed
    await tx.memberMembership.updateMany({
      where: {
        status: "ACTIVE",
        endDate: {
          lt: now,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    // Activate upcoming memberships whose start date has arrived
    await tx.memberMembership.updateMany({
      where: {
        status: "UPCOMING",
        startDate: {
          lte: now,
        },
      },
      data: {
        status: "ACTIVE",
      },
    });
  });
};



