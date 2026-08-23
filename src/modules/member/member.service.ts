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
  if (page < 1) {
    throw new AppError("Page must be at least 1.", 400);
  }

  if (limit < 1 || limit > 100) {
    throw new AppError(
      "Limit must be between 1 and 100.",
      400
    );
  }

  return memberRepository.findMembers(
    gymId,
    page,
    limit,
    search
  );
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

  if (member.status === "INACTIVE") {
    throw new AppError("Member is already inactive.", 400);
  }

  await memberRepository.deactivate(memberId);
};


export const searchMembers = async (
  gymId: string,
  search: string
) => {
  if (!search.trim()) {
    throw new AppError(
      "Search query is required.",
      400
    );
  }

  return memberRepository.searchMembers(
    gymId,
    search.trim()
  );
};


