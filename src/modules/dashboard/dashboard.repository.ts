import prisma from "../../config/prisma";

export const getDashboardStats = async (gymId: string) => {
  const [
    totalMembers,
    activeMembers,
    inactiveMembers,
    activeMemberships,
    expiredMemberships,
    upcomingMemberships,
  ] = await Promise.all([
    prisma.member.count({
      where: {
        gymId,
      },
    }),

    prisma.member.count({
      where: {
        gymId,
        status: "ACTIVE",
      },
    }),

    prisma.member.count({
      where: {
        gymId,
        status: "INACTIVE",
      },
    }),

    prisma.memberMembership.count({
      where: {
        member: {
          gymId,
        },
        status: "ACTIVE",
      },
    }),

    prisma.memberMembership.count({
      where: {
        member: {
          gymId,
        },
        status: "EXPIRED",
      },
    }),

    prisma.memberMembership.count({
      where: {
        member: {
          gymId,
        },
        status: "UPCOMING",
      },
    }),
  ]);

  return {
    totalMembers,
    activeMembers,
    inactiveMembers,
    activeMemberships,
    expiredMemberships,
    upcomingMemberships,
  };
};