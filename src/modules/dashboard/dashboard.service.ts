import * as dashboardRepository from "./dashboard.repository";

export const getDashboardStats = async (gymId: string) => {
  return dashboardRepository.getDashboardStats(gymId);
};


export const getRevenueStats = async (
  gymId: string,
  startDate: Date,
  endDate: Date
) => {
  return dashboardRepository.getRevenueStats(
    gymId,
    startDate,
    endDate
  );
};