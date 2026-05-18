import { ApiError } from '@/types/response'

export const uploadsService = {
  async uploadFileToPresignedUrl(uploadUrl: string, file: File, contentType: string) {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file,
    })

    if (!response.ok) {
      throw new ApiError('Failed to upload image', response.status)
    }
  },
}
