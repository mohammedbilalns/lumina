import type { QueryClient } from '@tanstack/react-query'
import type { Article, ListArticlesData } from '@lumina/shared-types'

type ReactionType = Article['reactionType']

function applyReactionToArticle(article: Article, reactionType: ReactionType): Article {
  const previousReactionType = article.reactionType

  let likesCount = article.likesCount

  if (previousReactionType === 'LIKE' && reactionType === null) {
    likesCount = Math.max(0, likesCount - 1)
  } else if (previousReactionType === 'DISLIKE' && reactionType === 'LIKE') {
    likesCount += 2
  } else if (previousReactionType === null && reactionType === 'LIKE') {
    likesCount += 1
  } else if (previousReactionType === 'LIKE' && reactionType === 'DISLIKE') {
    likesCount = Math.max(0, likesCount - 2)
  }

  return {
    ...article,
    likesCount,
    reactionType,
    isLiked: reactionType === 'LIKE',
  }
}

export function updateArticleReactionCaches(
  queryClient: QueryClient,
  articleId: string,
  reactionType: ReactionType,
) {
  const updateListData = (data: ListArticlesData | undefined) =>
    data
      ? {
          ...data,
          articles: data.articles.map((article) =>
            article.id === articleId
              ? applyReactionToArticle(article, reactionType)
              : article,
          ),
        }
      : data

  queryClient.setQueriesData<ListArticlesData>(
    { queryKey: ['articles', 'preferred'] },
    updateListData,
  )

  queryClient.setQueriesData<ListArticlesData>(
    { queryKey: ['articles', 'own'] },
    updateListData,
  )

  queryClient.setQueriesData<{ article: Article }>(
    { queryKey: ['articles', 'detail', articleId] },
    (data) =>
      data
        ? {
            ...data,
            article: applyReactionToArticle(data.article, reactionType),
          }
        : data,
  )
}

export function removeArticleFromCaches(
  queryClient: QueryClient,
  articleId: string,
  listKeys: Array<'preferred' | 'own'> = ['preferred', 'own'],
) {
  const removeFromList = (data: ListArticlesData | undefined) =>
    data
      ? {
          ...data,
          pagination: {
            ...data.pagination,
            total: Math.max(0, data.pagination.total - 1),
            totalPages: Math.max(
              1,
              Math.ceil(
                Math.max(0, data.pagination.total - 1) / data.pagination.limit,
              ),
            ),
          },
          articles: data.articles.filter((article) => article.id !== articleId),
        }
      : data

  for (const listKey of listKeys) {
    queryClient.setQueriesData<ListArticlesData>(
      { queryKey: ['articles', listKey] },
      removeFromList,
    )
  }

  queryClient.removeQueries({ queryKey: ['articles', 'detail', articleId] })
}

export function upsertOwnArticleCaches(
  queryClient: QueryClient,
  article: Article,
  mode: 'create' | 'update',
) {
  queryClient.setQueriesData<ListArticlesData>(
    { queryKey: ['articles', 'own'] },
    (data) => {
      if (!data) {
        return data
      }

      const existingIndex = data.articles.findIndex((item) => item.id === article.id)
      const alreadyExists = existingIndex !== -1
      const nextTotal = mode === 'create' && !alreadyExists ? data.pagination.total + 1 : data.pagination.total

      let nextArticles = data.articles

      if (alreadyExists) {
        nextArticles = data.articles.map((item) => (item.id === article.id ? article : item))
      } else if (mode === 'create' && data.pagination.page === 1) {
        nextArticles = [article, ...data.articles].slice(0, data.pagination.limit)
      }

      return {
        ...data,
        articles: nextArticles,
        pagination: {
          ...data.pagination,
          total: nextTotal,
          totalPages: Math.max(1, Math.ceil(nextTotal / data.pagination.limit)),
        },
      }
    },
  )

  queryClient.setQueriesData<{ article: Article }>(
    { queryKey: ['articles', 'detail', article.id] },
    () => ({ article }),
  )
}
