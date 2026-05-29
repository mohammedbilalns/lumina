import z from "zod"

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(30),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(30),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
).refine(
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

export const registerApiSchema = registerSchema.transform(({ confirmPassword, ...rest }) => rest)

export type RegisterData = z.infer<typeof registerSchema>
export type RegisterApiData = z.infer<typeof registerApiSchema>
