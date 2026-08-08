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