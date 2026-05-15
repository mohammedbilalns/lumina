import z from 'zod'

export const savePreferencesSchema = z.object({
  categoryIds: z.array(z.string()),
  accessToken: z.string().optional()
})

export const checkPreferencesStatusSchema = z.object({
  accessToken: z.string().optional()
}).optional()
