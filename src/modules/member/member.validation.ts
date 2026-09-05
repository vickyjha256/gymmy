import { z } from "zod";

export const createMemberSchema = z.object({
  firstName: z.string().trim().min(2).max(50),

  lastName: z.string().trim().max(50).optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  email: z.email().trim().toLowerCase().optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  dateOfBirth: z.coerce.date().max(new Date(), "Date of birth cannot be in the future").optional(),

  address: z.string().trim().optional(),

  height: z.number().positive().optional(),

  weight: z.number().positive().optional(),

  emergencyContactName: z.string().trim().optional(),

  emergencyContactPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),

  notes: z.string().trim().optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;


export const updateMemberSchema = createMemberSchema.partial();

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;