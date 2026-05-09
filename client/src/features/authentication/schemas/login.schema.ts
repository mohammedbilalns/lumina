import z from "zod";

export const loginSchema = z.object({
  credential: z.string().min(1),
  password: z.string().min(1),
})
