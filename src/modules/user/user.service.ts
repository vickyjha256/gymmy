import { AppError } from "../../common/utils/AppError";
import * as userRepository from "./user.repository";
import { ChangePasswordInput, UpdateProfileInput } from "./user.validation";
import bcrypt from "bcrypt";


export const getProfile = async (userId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    gym: {
      id: user.gym.id,
      name: user.gym.name,
      phone: user.gym.phone,
      address: user.gym.address,
      logo: user.gym.logo,
    },
  };
};

export const updateProfile = async (
  userId: string,
  gymId: string,
  data: UpdateProfileInput
) => {
  const user = await userRepository.findById(userId);

  if (!user || user.gymId !== gymId) {
    throw new AppError("User not found.", 404);
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await userRepository.findByEmail(
      data.email
    );

    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Email already exists.", 409);
    }
  }

  const updatedUser = await userRepository.updateUser(
    userId,
    {
      name: data.name,
      email: data.email,
    }
  );

  const updatedGym = await userRepository.updateGym(
    gymId,
    {
      name: data.gymName,
      phone: data.phone,
      address: data.address,
      logo: data.logo,
    }
  );

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    gym: updatedGym,
  };
};


export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect.", 401);
  }

  const hashedPassword = await bcrypt.hash(
    data.newPassword,
    10
  );

  await userRepository.updatePassword(
    userId,
    hashedPassword
  );
};