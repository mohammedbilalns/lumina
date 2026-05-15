import z from 'zod'

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6)
})

export const resendOtpSchema = z.object({
  email: z.email()
})
