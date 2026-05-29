import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Navbar } from '#/components/navbar'
import { ArticleEditor } from '#/features/articles/components/article-editor'
import { createArticle } from '#/features/articles/server/articles.functions'
import { upsertOwnArticleCaches } from '#/features/articles/utils/article-reaction-cache'
import { getCategories } from '#/features/preferences/server/preferences.functions'
import { callAuthorized } from '#/utils/auth-client'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/article/create')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: ROUTES.auth })
    }
  },
  loader: async () => {
    const response = await getCategories()
    return response.data
  },
  component: CreateArticleComponent,
})

export function CreateArticleComponent() {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { categories } = Route.useLoaderData()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: {
    title: string
    content: string
    featuredImage: string
    categoryId: string
  }) => {
    setIsSubmitting(true)

    try {
      const response = await callAuthorized(createArticle, data)
      upsertOwnArticleCaches(queryClient, response.data.article, 'create')
      await queryClient.invalidateQueries({ queryKey: ['articles', 'own'] })
      toast.success('Article created successfully')
      await router.invalidate()
      navigate({ to: ROUTES.article.detail, params: { id: response.data.article.id } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create article'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-20 font-sans text-[#111111] selection:bg-[#f8cb5b]/30">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-serif font-medium text-[#0b2226]">
            Create New Article
          </h1>
          <p className="text-slate-500">
            Publish through the TanStack Start BFF instead of browser-direct API calls.
          </p>
        </div>

        <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-sm sm:p-10">
          <ArticleEditor
            mode="create"
            categories={categories}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
