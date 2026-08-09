import * as dashboardRepository from "./dashboard.repository";

export const getDashboardStats = async (gymId: string) => {
  return dashboardRepository.getDashboardStats(gymId);
};