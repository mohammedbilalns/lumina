import z from 'zod'

export const loginSchema = z.object({
  credential: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginData = z.infer<typeof loginSchema>
