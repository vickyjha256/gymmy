import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const create = (data: Prisma.MemberCreateInput) => {
  return prisma.member.create({ data });
};

export const findById = (id: string) => {
  return prisma.member.findUnique({
    where: {
      id,
    },
    include: {
      membershipHistory: {
        where: {
          status: {
            in: ["ACTIVE", "UPCOMING"],
          },
        },
        include: {
          membershipPlan: true,
        },
        orderBy: {
          startDate: "asc",
        },
      },
    },
  });
};

export const findByPhone = (gymId: string, phone: string) => {
  return prisma.member.findFirst({
    where: {
      gymId,
      phone,
    },
  });
};

export const findMany = (
  where: Prisma.MemberWhereInput,
  skip: number,
  take: number
) => {
  return prisma.member.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const count = (where: Prisma.MemberWhereInput) => {
  return prisma.member.count({ where });
};

export const update = (
  id: string,
  data: Prisma.MemberUpdateInput
) => {
  return prisma.member.update({
    where: { id },
    data,
  });
};

export const remove = (id: string) => {
  return prisma.member.delete({
    where: { id },
  });
};