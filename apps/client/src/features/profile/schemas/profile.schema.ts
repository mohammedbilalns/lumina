import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  accessToken: z.string().optional(),
}).refine(
  (data) => {
    const birthDate = new Date(data.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 15
  },
  {
    path: ["dateOfBirth"],
    message: "You must be at least 15 years old",
  }
)

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Password is too short'),
  newPassword: z.string().min(6, 'Password is too short'),
  accessToken: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
