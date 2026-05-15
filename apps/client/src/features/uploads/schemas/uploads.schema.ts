import z from 'zod'

export const createPresignedUploadUrlSchema = z.object({
  contentType: z.string().trim().min(1),
  fileName: z.string().trim().max(255).optional(),
  accessToken: z.string().optional(),
})
