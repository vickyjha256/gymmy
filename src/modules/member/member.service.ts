import { AppError } from "../../common/utils/AppError";
import prisma from "../../config/prisma";

import * as memberRepository from "./member.repository";

import { CreateMemberInput, UpdateMemberInput } from "./member.validation";

export const createMember = async (
  gymId: string,
  data: CreateMemberInput
) => {
  const existingMember = await memberRepository.findByPhone(
    gymId,
    data.phone
  );

  if (existingMember) {
    throw new AppError("Member already exists.", 409);
  }

  return memberRepository.create({
    ...data,
    gym: {
      connect: {
        id: gymId,
      },
    },
  });
};



export const getMembers = async (
  gymId: string,
  page: number,
  limit: number,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where = {
    gymId,
    ...(search && {
      OR: [
        {
          firstName: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          phone: {
            contains: search,
          },
        },
      ],
    }),
  };

  const [members, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.member.count({ where }),
  ]);

  return {
    members,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};



export const getMemberById = async (
  gymId: string,
  memberId: string
) => {
  const member = await memberRepository.findById(memberId);

  if (!member || member.gymId !== gymId) {
    throw new AppError("Member not found.", 404);
  }

  return member;
};


export const updateMember = async (
  gymId: string,
  memberId: string,
  data: UpdateMemberInput
) => {
  const member = await memberRepository.findById(memberId);

  if (!member || member.gymId !== gymId) {
    throw new AppError("Member not found.", 404);
  }

  if (data.phone && data.phone !== member.phone) {
    const existing = await memberRepository.findByPhone(
      gymId,
      data.phone
    );

    if (existing) {
      throw new AppError("Phone number already exists.", 409);
    }
  }

  return memberRepository.update(memberId, data);
};



export const deleteMember = async (
  gymId: string,
  memberId: string
) => {
  const member = await memberRepository.findById(memberId);

  if (!member || member.gymId !== gymId) {
    throw new AppError("Member not found.", 404);
  }

  await memberRepository.remove(memberId);
};