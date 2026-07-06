import { queryOptions, useQuery } from '@tanstack/react-query'
import { getArticle, getOwnArticles, getPreferredArticles, getPublicArticles } from '../server/articles.functions'

type AuthMode = 'guest' | 'authenticated'

export function preferredArticlesQueryOptions(params: { page: number, limit: 10 | 20 | 30, search?: string, accessToken: string | undefined, authMode: AuthMode }) {
  return queryOptions({
    queryKey: ['articles', 'preferred', params.authMode, params],
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

export function publicArticlesQueryOptions(params: { page: number, limit: 10 | 20 | 30, search?: string, authMode: AuthMode }) {
  return queryOptions({
    queryKey: ['articles', 'public', params.authMode, params],
    queryFn: async () => {
      const response = await getPublicArticles({
        data: {
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

export function ownArticlesQueryOptions(params: { page: number, limit: 10 | 20 | 30, accessToken: string | undefined, authMode: AuthMode }) {
  return queryOptions({
    queryKey: ['articles', 'own', params.authMode, params],
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

export function articleDetailQueryOptions(params: { articleId: string, accessToken: string | undefined, authMode: AuthMode }) {
  return queryOptions({
    queryKey: ['articles', 'detail', params.articleId, params.authMode],
    queryFn: async () => {
      const response = await getArticle({
        data: {
          articleId: params.articleId,
          accessToken: params.accessToken,
        },
      })
      return response.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function usePreferredArticles(params: { page: number, limit: 10 | 20 | 30, search?: string, accessToken: string | undefined, authMode: AuthMode }) {
  return useQuery(preferredArticlesQueryOptions(params))
}

export function useOwnArticles(params: { page: number, limit: 10 | 20 | 30, accessToken: string | undefined, authMode: AuthMode }) {
  return useQuery(ownArticlesQueryOptions(params))
}
