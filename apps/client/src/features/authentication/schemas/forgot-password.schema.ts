import z from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

export const resetPasswordApiSchema = z.object({
  email: z.email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot exceed 32 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number, and special character'),
})

export const resetPasswordFormSchema = resetPasswordApiSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
