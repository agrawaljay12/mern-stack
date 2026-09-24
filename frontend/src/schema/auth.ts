import { z } from "zod";

/* =========================================
   LOGIN
========================================= */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData =
  z.infer<typeof loginSchema>;

/* =========================================
   ADMIN PROFILE
========================================= */

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  age: z
    .number({
      error: "Age is required",
    })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Please enter a valid age"),
});

export type ProfileFormData =
  z.infer<typeof profileSchema>;