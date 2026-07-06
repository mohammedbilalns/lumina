import { Link, createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { PenTool } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Navbar } from '#/components/navbar'
import { ConfirmationDialog } from '#/features/articles/components/confirmation-dialog'
import { PaginationControls } from '#/features/articles/components/pagination-controls'
import { articleRouteSearchSchema } from '#/features/articles/schemas/articles.schema'
import { deleteArticle } from '#/features/articles/server/articles.functions'
import { removeArticleFromCaches } from '#/features/articles/utils/article-reaction-cache'
import { callAuthorized } from '#/utils/auth-client'
import { ArticleCard, ArticleCardSkeleton } from '#/features/articles/components/article-card'
import type { Article } from '@lumina/shared-types'
import { ROUTES } from '@/constants/routes'

import { ownArticlesQueryOptions } from '#/features/articles/hooks/use-articles-query'

export const Route = createFileRoute('/my-articles')({
  validateSearch: articleRouteSearchSchema,
  beforeLoad: ({ context }) => {
    if (context.authMode !== 'authenticated') {
      throw redirect({ to: ROUTES.auth })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      ownArticlesQueryOptions({
        accessToken: context.accessToken || undefined,
        page: deps.page,
        limit: deps.limit,
        authMode: context.authMode,
      })
    )

    return {}
  },
  component: MyArticlesPage,
})

export function MyArticlesPage() {
  const navigate = useNavigate({ from: ROUTES.myArticles })
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = Route.useSearch()
  const { accessToken, authMode } = Route.useRouteContext()
  const { data: articlesData } = useSuspenseQuery(
    ownArticlesQueryOptions({
      accessToken: accessToken || undefined,
      page: searchParams.page,
      limit: searchParams.limit,
      authMode,
    }),
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)

  const handleDelete = async (articleId: string, currentArticlesCount: number, currentPage: number) => {
    setDeletingId(articleId)

    try {
      await callAuthorized(deleteArticle, { articleId })
      removeArticleFromCaches(queryClient, articleId, ['own'])
      await queryClient.invalidateQueries({ queryKey: ['articles', 'own'] })
      toast.success('Article deleted')
      const nextPage = currentArticlesCount === 1 && currentPage > 1
        ? currentPage - 1
        : currentPage

      if (nextPage !== currentPage) {
        navigate({
          search: (prev) => ({
            ...prev,
            page: nextPage,
          }),
          replace: true,
        })
      }

      await router.invalidate()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete article'
      toast.error(message)
    } finally {
      setDeletingId(null)
      setArticleToDelete(null)
    }
  }

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-20 font-sans text-[#111111] selection:bg-[#f8cb5b]/30">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-serif font-medium text-[#0b2226]">
              My Articles
            </h1>
            <p className="text-slate-500">
              Your published articles, shown with server-backed pagination.
            </p>
          </div>
          <Link
            to={ROUTES.article.create}
            className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#f8cb5b] px-5 py-2.5 font-medium text-[#0b2226] transition-colors hover:bg-[#f2c94c]"
          >
            <PenTool className="h-4 w-4" />
            Write a Story
          </Link>
        </div>

        {articlesData.articles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#EAEAEA] bg-white px-8 py-16 text-center">
                  <h2 className="mb-3 text-2xl font-serif font-medium text-[#0b2226]">
                    No articles created yet
                  </h2>
                  <p className="mx-auto mb-8 max-w-lg text-sm leading-6 text-slate-500">
                    Start writing to publish your first article.
                  </p>
                  <Link
                    to={ROUTES.article.create}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0b2226] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#13383d]"
                  >
                    <PenTool className="h-4 w-4" />
                    Create Article
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {articlesData.articles.map((article: any) => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        isAuthor 
                        onDelete={(selectedArticle) => setArticleToDelete(selectedArticle)}
                        isDeleting={deletingId === article.id}
                      />
                    ))}
                  </div>

                  <PaginationControls pagination={articlesData.pagination} onPageChange={handlePageChange} />
                </>
              )}
      </main>

      <ConfirmationDialog
        open={articleToDelete !== null}
        title="Delete Article"
        description={
          articleToDelete
            ? `Delete "${articleToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Article"
        confirmVariant="danger"
        isPending={deletingId === articleToDelete?.id}
        onCancel={() => {
          if (!deletingId) {
            setArticleToDelete(null)
          }
        }}
        onConfirm={() => {
          if (articleToDelete) {
            void handleDelete(
              articleToDelete.id,
              articlesData.articles.length,
              articlesData.pagination.page,
            )
          }
        }}
      />
    </div>
  )
}

function MyArticlesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}
