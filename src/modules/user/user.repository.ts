import prisma from "../../config/prisma";

export const findById = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      gym: true,
    },
  });
};

export const updateUser = (
  userId: string,
  data: {
    name?: string;
    email?: string;
  }
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
};

export const updateGym = (
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

export const findByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const updatePassword = (
  userId: string,
  password: string
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
};



export const updateProfile = async (
  userId: string,
  gymId: string,
  userData: {
    name?: string;
    email?: string;
  },
  gymData: {
    name?: string;
    phone?: string;
    address?: string;
    logo?: string;
  }
) => {
  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData,
    });

    const updatedGym = await tx.gym.update({
      where: { id: gymId },
      data: gymData,
    });

    return {
      updatedUser,
      updatedGym,
    };
  });
};