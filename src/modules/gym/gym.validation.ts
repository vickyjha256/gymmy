import { z } from "zod";

export const updateGymSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  address: z.string().max(255).optional(),
  logo: z.string().url().optional(),
});

export type UpdateGymInput = z.infer<typeof updateGymSchema>;