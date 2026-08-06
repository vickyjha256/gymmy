import { z } from "zod";

export const createMembershipSchema = z.object({
  memberId: z.string().uuid(),

  membershipPlanId: z.string().uuid(),

  paymentMethod: z.enum(["CASH", "UPI", "CARD"]),
});

export type CreateMembershipInput = z.infer<
  typeof createMembershipSchema
>;