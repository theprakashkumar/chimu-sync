import z from "zod";

const verifyMFASchema = z.object({
  code: z.string().trim().min(1).max(6),
  secretKey: z.string().trim().min(1)
});

const verifyMFAForLoginSchema = z.object({
  code: z.string().trim().min(1).max(6),
  userAgent: z.string().optional(),
});

export { verifyMFASchema, verifyMFAForLoginSchema } 
