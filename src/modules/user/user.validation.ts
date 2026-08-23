import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  email: z.string().email().optional(),

  gymName: z.string().min(2).max(100).optional(),

  phone: z.string().min(10).max(15).optional(),

  address: z.string().max(255).optional(),

  logo: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;



export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;