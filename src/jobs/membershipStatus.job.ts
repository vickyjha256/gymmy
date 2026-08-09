import * as membershipService from "../modules/membership/membership.service";

export const startMembershipStatusJob = () => {
  const run = async () => {
    try {
      await membershipService.updateMembershipStatuses();
    } catch (error) {
      console.error(
        "Failed to update membership statuses:",
        error
      );
    }
  };

  // Run once when the server starts
  run();

  // Run every 1 minute
  setInterval(run, 60 * 1000);
};