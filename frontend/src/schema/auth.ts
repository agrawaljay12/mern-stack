import { z } from "zod";

/* =========================================================
   LOGIN
========================================================= */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});

export type LoginFormData =
  z.infer<typeof loginSchema>;

/* =========================================================
   PROFILE
========================================================= */

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Name must be at least 2 characters"
    )
    .max(
      100,
      "Name is too long"
    ),

  email: z
    .string()
    .trim()
    .email(
      "Please enter a valid email address"
    ),

  age: z
    .number({
      message: "Age is required",
    })
    .int(
      "Age must be a whole number"
    )
    .min(
      1,
      "Age must be at least 1"
    )
    .max(
      120,
      "Age must be less than or equal to 120"
    ),
});

export type ProfileFormData =
  z.infer<typeof profileSchema>;

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export const changePasswordSchema =
  z
    .object({
      currentPassword: z
        .string()
        .min(
          1,
          "Current password is required"
        ),

      newPassword: z
        .string()
        .min(
          6,
          "New password must be at least 6 characters"
        ),

      confirmPassword: z
        .string()
        .min(
          1,
          "Please confirm your new password"
        ),
    })
    .refine(
      (values) =>
        values.newPassword ===
        values.confirmPassword,
      {
        message:
          "Passwords do not match",
        path: [
          "confirmPassword",
        ],
      }
    )
    .refine(
      (values) =>
        values.currentPassword !==
        values.newPassword,
      {
        message:
          "New password must be different from your current password",
        path: [
          "newPassword",
        ],
      }
    );

export type ChangePasswordFormData =
  z.infer<
    typeof changePasswordSchema
  >;