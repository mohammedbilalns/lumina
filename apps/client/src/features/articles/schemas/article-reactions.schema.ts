import { z } from 'zod'

export const reactToArticleSchema = z.object({
  articleId: z.uuid(),
  reactionType: z.enum(['LIKE', 'DISLIKE']),
  accessToken: z.string().optional(),
})

export const blockArticleSchema = z.object({
  articleId: z.uuid(),
  accessToken: z.string().optional(),
})
