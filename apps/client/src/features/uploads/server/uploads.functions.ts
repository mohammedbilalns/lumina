import { createServerFn } from '@tanstack/react-start'
import { withServerErrorHandler } from '#/utils/with-server-error-handler'
import { env } from '@/config/env'
import { fetchWithAuth } from '@/features/authentication/server/api-client.server'
import { ApiError } from '@/types/response'
import type { ErrorResponse, SuccessResponse } from '@/types/response'
import { createPresignedUploadUrlSchema } from '../schemas/uploads.schema'

interface PresignedUploadData {
  uploadUrl: string
  key: string
  fileUrl: string
  expiresIn: number
  method: 'PUT'
  contentType: string
}

export const createPresignedUploadUrl = createServerFn({ method: 'POST' })
  .inputValidator(createPresignedUploadUrlSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      const { accessToken, ...payload } = data
      const response = await fetchWithAuth(
        `${env.API_URL}/uploads/presigned-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
        accessToken,
      )

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        const error = result as ErrorResponse | null
        throw new ApiError(
          error?.message || 'Failed to create upload URL',
          response.status,
          error?.error,
        )
      }

      return result as SuccessResponse<PresignedUploadData>
    }),
  )
