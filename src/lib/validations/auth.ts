import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(120, "Name must not exceed 120 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address.")
      .max(255, "Email must not exceed 255 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your password."),
    interests: z.array(z.string()).max(20).optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must not exceed 120 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .max(255, "Email must not exceed 255 characters."),
  interests: z.array(z.string()).max(20),
});

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required."),
    password: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
