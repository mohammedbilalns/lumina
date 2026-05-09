import z from "zod"

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(10).max(10),
  dob: z.date(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
)
