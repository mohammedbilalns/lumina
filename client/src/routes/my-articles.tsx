import { Link, createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { Edit2, BookOpen, PenTool, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Navbar } from '#/components/navbar'
import { PaginationControls } from '#/features/articles/components/pagination-controls'
import { articleRouteSearchSchema } from '#/features/articles/schemas/articles.schema'
import { deleteArticle, getOwnArticles } from '#/features/articles/server/articles.functions'
import { callAuthorized } from '#/utils/auth-client'

export const Route = createFileRoute('/my-articles')({
  validateSearch: articleRouteSearchSchema,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/auth' })
    }

    const response = await getOwnArticles({
      data: {
        accessToken: context.accessToken,
        page: deps.page,
        limit: deps.limit,
      },
    })

    return response.data
  },
  component: MyArticlesPage,
})

export function MyArticlesPage() {
  const navigate = useNavigate({ from: '/my-articles' })
  const router = useRouter()
  const { articles, pagination } = Route.useLoaderData()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (articleId: string) => {
    if (!window.confirm('Delete this article?')) {
      return
    }

    setDeletingId(articleId)

    try {
      await callAuthorized(deleteArticle, { articleId })
      toast.success('Article deleted')
      const nextPage = articles.length === 1 && pagination.page > 1
        ? pagination.page - 1
        : pagination.page

      if (nextPage !== pagination.page) {
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
            to="/article/create"
            className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#f8cb5b] px-5 py-2.5 font-medium text-[#0b2226] transition-colors hover:bg-[#f2c94c]"
          >
            <PenTool className="h-4 w-4" />
            Write a Story
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EAEAEA] bg-white px-8 py-16 text-center">
            <h2 className="mb-3 text-2xl font-serif font-medium text-[#0b2226]">
              No articles created yet
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-sm leading-6 text-slate-500">
              Start writing to publish your first article.
            </p>
            <Link
              to="/article/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2226] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#13383d]"
            >
              <PenTool className="h-4 w-4" />
              Create Article
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col gap-6 rounded-xl border border-[#EAEAEA] bg-white p-6 transition-all hover:shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="line-clamp-1 text-xl font-serif font-medium text-[#0b2226]">
                        <Link
                          to="/article/$id"
                          params={{ id: article.id }}
                          className="transition-colors hover:text-[#13383d]"
                        >
                          {article.title}
                        </Link>
                      </h2>
                      <span className="rounded-md border border-[#EAEAEA] bg-slate-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {article.category.name}
                      </span>
                    </div>

                    <p className="mb-4 text-sm text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                      {article.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 border-t border-[#EAEAEA] pt-4 md:border-t-0 md:pt-0">
                    <Link
                      to="/article/$id"
                      params={{ id: article.id }}
                      className="flex items-center gap-2 rounded-md border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <BookOpen className="h-4 w-4" />
                      Read
                    </Link>
                    <Link
                      to="/article/$id/edit"
                      params={{ id: article.id }}
                      className="flex items-center gap-2 rounded-md border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === article.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </main>
    </div>
  )
}
