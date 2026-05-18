import z from 'zod'

export const paginationLimitSchema = z.union([z.literal(10), z.literal(20), z.literal(30)])

export const getArticlesSchema = z.object({
  accessToken: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: paginationLimitSchema.default(10),
  search: z.string().optional(),
})

export const articleRouteSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().transform((value) => {
    if (value === 20 || value === 30) {
      return value
    }

    return 10
  }).default(10),
  search: z.string().optional(),
})

export const articleIdSchema = z.object({
  articleId: z.string().uuid(),
  accessToken: z.string().optional(),
})

export const createArticleSchema = z.object({
  title: z.string().trim().min(5).max(255),
  content: z.string().trim().min(20),
  featuredImage: z.string().trim().url().or(z.literal('')).optional(),
  categoryId: z.string().uuid(),
  accessToken: z.string().optional(),
})

export const updateArticleSchema = createArticleSchema.extend({
  articleId: z.string().uuid(),
})

export const deleteArticleSchema = z.object({
  articleId: z.string().uuid(),
  accessToken: z.string().optional(),
})
