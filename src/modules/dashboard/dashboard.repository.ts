import prisma from "../../config/prisma";

export const getDashboardStats = async (gymId: string) => {
  const now = new Date();

  const expiryLimit = new Date(now);
  expiryLimit.setDate(expiryLimit.getDate() + 7);

  const [
    totalMembers,
    activeMembers,
    inactiveMembers,
    activeMemberships,
    expiredMemberships,
    upcomingMemberships,
    expiringMemberships,
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

    prisma.memberMembership.count({
      where: {
        member: {
          gymId,
        },
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: expiryLimit,
        },
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
    expiringMemberships,
  };
};

export const getRevenueStats = async (
  gymId: string,
  startDate: Date,
  endDate: Date
) => {
  const memberships = await prisma.memberMembership.findMany({
    where: {
      member: {
        gymId,
      },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      amountPaid: true,
      paymentMethod: true,
    },
  });

  let totalRevenue = 0;

  const revenueByPaymentMethod = {
    CASH: 0,
    UPI: 0,
    CARD: 0,
  };

  for (const membership of memberships) {
    const amount = Number(membership.amountPaid);

    totalRevenue += amount;
    revenueByPaymentMethod[membership.paymentMethod] += amount;
  }

  return {
    totalRevenue,
    revenueByPaymentMethod,
  };
};