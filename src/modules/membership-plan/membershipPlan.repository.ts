import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

export const create = (data: Prisma.MembershipPlanCreateInput) => {
  return prisma.membershipPlan.create({
    data,
  });
};

export const findById = (id: string) => {
  return prisma.membershipPlan.findUnique({
    where: {
      id,
    },
  });
};

export const findByName = (
  gymId: string,
  name: string
) => {
  return prisma.membershipPlan.findFirst({
    where: {
      gymId,
      name,
    },
  });
};

export const findMany = (gymId: string) => {
  return prisma.membershipPlan.findMany({
    where: {
      gymId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const update = (
  id: string,
  data: Prisma.MembershipPlanUpdateInput
) => {
  return prisma.membershipPlan.update({
    where: {
      id,
    },
    data,
  });
};

export const remove = (id: string) => {
  return prisma.membershipPlan.delete({
    where: {
      id,
    },
  });
};

export const countMemberships = (planId: string) => {
  return prisma.memberMembership.count({
    where: {
      membershipPlanId: planId,
    },
  });
};

export const deactivate = (id: string) => {
  return prisma.membershipPlan.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
};

export const activate = (id: string) => {
  return prisma.membershipPlan.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });
};

