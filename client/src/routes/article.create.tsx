import { createFileRoute, redirect } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import { ArticleEditor } from '#/features/articles/components/article-editor'

export const Route = createFileRoute('/article/create')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  component: CreateArticleComponent,
})

export  function CreateArticleComponent() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans selection:bg-[#f8cb5b]/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-medium mb-2 text-[#0b2226]">
            Create New Article
          </h1>
          <p className="text-slate-500">
            Share your ideas with the Lumina community.
          </p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-xl p-6 sm:p-10 shadow-sm">
          <ArticleEditor mode="create" />
        </div>
      </main>
    </div>
  )
}
