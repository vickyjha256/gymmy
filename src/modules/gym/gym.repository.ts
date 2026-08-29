import prisma from "../../config/prisma";

export const findById = (gymId: string) => {
  return prisma.gym.findUnique({
    where: {
      id: gymId,
    },
  });
};

export const update = (
  gymId: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    logo?: string;
  }
) => {
  return prisma.gym.update({
    where: {
      id: gymId,
    },
    data,
  });
};