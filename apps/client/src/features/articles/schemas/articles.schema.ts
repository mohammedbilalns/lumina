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
  articleId: z.uuid(),
  accessToken: z.string().optional(),
})

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Article title must be at least 5 characters')
    .max(255, 'Article title must be at most 255 characters'),
  content: z
    .string()
    .trim()
    .min(20, 'Article content must be at least 20 characters')
    .max(50000, 'Article content must be at most 50000 characters'),
  featuredImage: z.url().or(z.literal('')).optional(),
  categoryId: z.uuid(),
  accessToken: z.string().optional(),
})

export const updateArticleSchema = createArticleSchema.extend({
  articleId: z.uuid(),
})

export const deleteArticleSchema = z.object({
  articleId: z.uuid(),
  accessToken: z.string().optional(),
})
