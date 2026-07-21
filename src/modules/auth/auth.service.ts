import { Prisma } from "@prisma/client/extension";
import { generateToken } from "../../common/utils/jwt";
import { hashPassword } from "../../common/utils/password";
import prisma from "../../config/prisma";
import { RegisterInput } from "./auth.validation";


export const register = async (data: RegisterInput) => {
  const { gymName, phone, address, ownerName, email, password } = data;

  // Check if owner email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const hashedPassword = await hashPassword(password);

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const gym = await tx.gym.create({
      data: {
        name: gymName,
        phone,
        address,
      },
    });

    const user = await tx.user.create({
      data: {
        gymId: gym.id,
        name: ownerName,
        email,
        password: hashedPassword,
      },
    });

    return { gym, user };
  });

  const token = generateToken({
    userId: result.user.id,
    gymId: result.gym.id,
    role: result.user.role,
  });

  return {
    token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
    gym: {
      id: result.gym.id,
      name: result.gym.name,
    },
  };
};