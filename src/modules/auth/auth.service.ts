import { Prisma } from "@prisma/client/extension";
import { generateToken } from "../../common/utils/jwt";
import { comparePassword, hashPassword } from "../../common/utils/password";
import prisma from "../../config/prisma";
import { LoginInput, RegisterInput } from "./auth.validation";
import { AppError } from "../../common/utils/AppError";


export const register = async (data: RegisterInput) => {
  const { gymName, phone, address, ownerName, email, password } = data;

  // Check if owner email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
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



export const login = async (data: LoginInput) => {
  const { email, password } = data;

  // Check if email exists or not
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      gym: true,
    }
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }
  

  const token = generateToken({
    userId: user.id,
    gymId: user.gym.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    gym: {
      id: user.gym.id,
      name: user.gym.name,
    },
  };
};




