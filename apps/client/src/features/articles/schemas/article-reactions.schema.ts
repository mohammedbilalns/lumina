import { z } from 'zod'

export const reactToArticleSchema = z.object({
  articleId: z.string().uuid(),
  reactionType: z.enum(['LIKE', 'DISLIKE']),
  accessToken: z.string().optional(),
})

export const blockArticleSchema = z.object({
  articleId: z.string().uuid(),
  accessToken: z.string().optional(),
})
