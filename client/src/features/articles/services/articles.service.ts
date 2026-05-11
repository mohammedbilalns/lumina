import { env } from '@/config/env'
import { type SuccessResponse, type ErrorResponse, ApiError } from '@/types/response'
import { fetchWithAuth } from '@/features/authentication/server/api-client.server'

export interface Article {
  id: string
  title: string
  description: string
  content: string
  imageUrl: string
  category: string
  authorId: string
  createdAt: string
}

export const articlesService = {
  async getPreferredArticles(accessToken?: string | null, page = 1, limit = 10): Promise<SuccessResponse<{ articles: Article[] }>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles/preferences?page=${page}&limit=${limit}`,
      {},
      accessToken
    )

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to fetch articles",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<{ articles: Article[] }>
  }
}
