import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Navbar } from '#/components/navbar'
import { ArticleEditor } from '#/features/articles/components/article-editor'
import { getArticle, updateArticle } from '#/features/articles/server/articles.functions'
import { getCategories } from '#/features/preferences/server/preferences.functions'
import { callAuthorized } from '#/utils/auth-client'

export const Route = createFileRoute('/article/$id/edit')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  loader: async ({ params, context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/auth' })
    }

    const [articleResponse, categoriesResponse] = await Promise.all([
      getArticle({
        data: {
          articleId: params.id,
          accessToken: context.accessToken,
        },
      }),
      getCategories(),
    ])

    if (articleResponse.data.article.author.id !== context.user?.id) {
      throw redirect({ to: '/my-articles' })
    }

    return {
      article: articleResponse.data.article,
      categories: categoriesResponse.data.categories,
    }
  },
  component: EditArticleComponent,
})

function EditArticleComponent() {
  const navigate = useNavigate()
  const router = useRouter()
  const { article, categories } = Route.useLoaderData()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: {
    title: string
    content: string
    featuredImage: string
    categoryId: string
  }) => {
    setIsSubmitting(true)

    try {
      await callAuthorized(updateArticle, {
        articleId: article.id,
        ...data,
      })
      toast.success('Article updated successfully')
      await router.invalidate()
      navigate({ to: '/article/$id', params: { id: article.id } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update article'
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
            Edit Article
          </h1>
          <p className="text-slate-500">
            Update your article using the same BFF-backed workflow as creation.
          </p>
        </div>

        <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-sm sm:p-10">
          <ArticleEditor
            mode="edit"
            categories={categories}
            isSubmitting={isSubmitting}
            initialData={{
              title: article.title,
              content: article.content,
              featuredImage: article.featuredImage ?? '',
              categoryId: article.category.id,
            }}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
