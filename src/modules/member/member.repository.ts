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


export const searchMembers = (
  gymId: string,
  search: string
) => {
  return prisma.member.findMany({
    where: {
      gymId,
      OR: [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
          },
        },
      ],
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
    orderBy: {
      firstName: "asc",
    },
    take: 20,
  });
};

export const findByGym = async (
  gymId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where: {
        gymId,
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
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.member.count({
      where: {
        gymId,
      },
    }),
  ]);

  return {
    members,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


export const findMembers = async (
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
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.member.count({
      where,
    }),
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