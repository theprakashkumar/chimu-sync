import { date, z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address!")
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

// ? Withe the help of `refine` comparing the password and confirm password before moving on to create the account. 
export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine(val => val.password === val.confirmPassword, {
  message: "Passwords does not match!",
  path: ["confirmPassword"]
});

export const login = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});
