import z from 'zod'

export const getArticlesSchema = z.object({
  accessToken: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional()
})
