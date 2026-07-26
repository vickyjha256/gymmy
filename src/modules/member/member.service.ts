import { AppError } from "../../common/utils/AppError";
import prisma from "../../config/prisma";

import { CreateMemberInput } from "./member.validation";

export const createMember = async (
  gymId: string,
  data: CreateMemberInput
) => {
  const existingMember = await prisma.member.findFirst({
    where: {
      gymId,
      phone: data.phone,
    },
  });

  if (existingMember) {
    throw new AppError("Member already exists.", 409);
  }

  return prisma.member.create({
    data: {
      ...data,
      gymId,
    },
  });
};