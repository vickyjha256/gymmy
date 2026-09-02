import { z } from "zod";

export const createMembershipSchema = z.object({
  memberId: z.uuid(),

  membershipPlanId: z.uuid(),

  paymentMethod: z.enum(["CASH", "UPI", "CARD"]),
});

export type CreateMembershipInput = z.infer<
  typeof createMembershipSchema
>;


export const renewMembershipSchema = z.object({
  membershipPlanId: z.uuid(),
  paymentMethod: z.enum(["CASH", "UPI", "CARD"]),
});

export type RenewMembershipInput = z.infer<
  typeof renewMembershipSchema
>;