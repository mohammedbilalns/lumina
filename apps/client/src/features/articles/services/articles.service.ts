import { env } from '@/config/env'
import type {
  Article,
  ListArticlesData,
} from '@lumina/shared-types'
export type { Article, ListArticlesData } from '@lumina/shared-types'
import { fetchWithAuth } from '@/features/authentication/server/api-client.server'
import { ApiError, type ErrorResponse, type SuccessResponse } from '@/types/response'

export interface CreateArticleInput {
  title: string
  content: string
  featuredImage?: string
  categoryId: string
}

export interface UpdateArticleInput {
  articleId: string
  title?: string
  content?: string
  featuredImage?: string
  categoryId?: string
}

export interface ReactToArticleInput {
  articleId: string
  reactionType: 'LIKE' | 'DISLIKE'
}

export interface BlockArticleInput {
  articleId: string
}

interface ListArticlesParams {
  accessToken?: string | null
  page?: number
  limit?: number
}

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<SuccessResponse<T>> {
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    const error = result as ErrorResponse | null
    throw new ApiError(
      error?.message || fallbackMessage,
      response.status,
      error?.error,
    )
  }

  return result as SuccessResponse<T>
}

export const articlesService = {
  async getPreferredArticles({
    accessToken,
    page = 1,
    limit = 10,
  }: ListArticlesParams): Promise<SuccessResponse<ListArticlesData>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles/preferences?page=${page}&limit=${limit}`,
      {},
      accessToken,
    )

    return parseResponse<ListArticlesData>(response, 'Failed to fetch articles')
  },

  async getOwnArticles({
    accessToken,
    page = 1,
    limit = 10,
  }: ListArticlesParams): Promise<SuccessResponse<ListArticlesData>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles/me?page=${page}&limit=${limit}`,
      {},
      accessToken,
    )

    return parseResponse<ListArticlesData>(response, 'Failed to fetch your articles')
  },

  async getArticle(
    articleId: string,
    accessToken?: string | null,
  ): Promise<SuccessResponse<{ article: Article }>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles/${articleId}`,
      {},
      accessToken,
    )

    return parseResponse<{ article: Article }>(response, 'Failed to fetch article')
  },

  async createArticle(
    data: CreateArticleInput,
    accessToken?: string | null,
  ): Promise<SuccessResponse<{ article: Article }>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      accessToken,
    )

    return parseResponse<{ article: Article }>(response, 'Failed to create article')
  },

  async updateArticle(
    { articleId, ...data }: UpdateArticleInput,
    accessToken?: string | null,
  ): Promise<SuccessResponse<{ article: Article }>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles/${articleId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      accessToken,
    )

    return parseResponse<{ article: Article }>(response, 'Failed to update article')
  },

  async deleteArticle(
    articleId: string,
    accessToken?: string | null,
  ): Promise<SuccessResponse<void>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/articles/${articleId}`,
      {
        method: 'DELETE',
      },
      accessToken,
    )

    return parseResponse<void>(response, 'Failed to delete article')
  },

  async reactToArticle(
    data: ReactToArticleInput,
    accessToken?: string | null,
  ): Promise<SuccessResponse<void>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/reactions/articles/react`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      accessToken,
    )

    return parseResponse<void>(response, 'Failed to save reaction')
  },

  async blockArticle(
    data: BlockArticleInput,
    accessToken?: string | null,
  ): Promise<SuccessResponse<void>> {
    const response = await fetchWithAuth(
      `${env.API_URL}/reactions/articles/block`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      accessToken,
    )

    return parseResponse<void>(response, 'Failed to block article')
  },
}
