import { queryOptions, useQuery } from '@tanstack/react-query'
import { getPreferredArticles, getOwnArticles } from '../server/articles.functions'
import type { Article } from '@lumina/shared-types'
import { getArticle } from '../server/articles.functions'

export function preferredArticlesQueryOptions(params: { page: number, limit: 10 | 20 | 30, search?: string, accessToken: string | undefined }) {
  return queryOptions({
    queryKey: ['articles', 'preferred', params],
    queryFn: async () => {
      const response = await getPreferredArticles({
        data: {
          accessToken: params.accessToken,
          page: params.page,
          limit: params.limit,
          search: params.search,
        },
      })
      return response.data
    },
    staleTime: 1000 * 60 * 5, 
  })
}

export function ownArticlesQueryOptions(params: { page: number, limit: 10 | 20 | 30, accessToken: string | undefined }) {
  return queryOptions({
    queryKey: ['articles', 'own', params],
    queryFn: async () => {
      const response = await getOwnArticles({
        data: {
          accessToken: params.accessToken,
          page: params.page,
          limit: params.limit,
        },
      })
      return response.data
    },
    staleTime: 1000 * 60 * 5, 
  })
}

export function articleDetailQueryOptions(params: { articleId: string, accessToken: string | undefined }) {
  return queryOptions({
    queryKey: ['articles', 'detail', params.articleId],
    queryFn: async () => {
      const response = await getArticle({
        data: {
          articleId: params.articleId,
          accessToken: params.accessToken,
        },
      })
      return response.data as { article: Article }
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function usePreferredArticles(params: { page: number, limit: 10 | 20 | 30, search?: string, accessToken: string | undefined }) {
  return useQuery(preferredArticlesQueryOptions(params))
}

export function useOwnArticles(params: { page: number, limit: 10 | 20 | 30, accessToken: string | undefined }) {
  return useQuery(ownArticlesQueryOptions(params))
}
