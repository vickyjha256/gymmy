import { z } from "zod";

export const createMembershipPlanSchema = z.object({
  name: z.string().trim().min(2).max(50),

  description: z.string().trim().max(500).optional(),

  price: z.number().positive(),

  durationDays: z
    .number()
    .int()
    .positive()
    .max(3650),

  isActive: z.boolean().optional(),
});

export type CreateMembershipPlanInput =
  z.infer<typeof createMembershipPlanSchema>;

export const updateMembershipPlanSchema =
  createMembershipPlanSchema.partial();

export type UpdateMembershipPlanInput =
  z.infer<typeof updateMembershipPlanSchema>;