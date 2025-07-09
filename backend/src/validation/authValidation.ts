import { z } from "zod";

// Here creating email schema separate so that we can use it at multiple places.
export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address!")
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const login = z.object({
  email: emailSchema,
  password: passwordSchema,
});
