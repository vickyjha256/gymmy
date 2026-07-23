import { z } from "zod";

export const registerSchema = z.object({
  gymName: z
    .string()
    .trim()
    .min(3, "Gym name must be at least 3 characters")
    .max(100),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  address: z
    .string()
    .trim()
    .max(255)
    .optional(),

  ownerName: z
    .string()
    .trim()
    .min(3, "Owner name must be at least 3 characters")
    .max(100),

  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32),
});


export const loginSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters"),
});


export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;