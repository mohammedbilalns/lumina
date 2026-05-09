import { Navbar } from '#/components/Navbar'
import { ArticleEditor } from '#/components/ArticleEditor'
import { useParams } from '@tanstack/react-router'

export function ArticleEditPage() {
  const { id } = useParams({ strict: false }) as { id?: string }

  const dummyInitialData = {
    title: "Understanding Server Actions in Next.js",
    description: "A deep dive into how Server Actions are changing the way we handle data mutations in modern React applications.",
    category: "Technology",
    tags: "React, Nextjs, Web Development",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    content: "<h2>Server Actions are Here</h2><p>With the release of Next.js 14, server actions have become stable...</p>"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Edit Article</h1>
          <p className="text-slate-400">Make changes to your published story.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <ArticleEditor mode="edit" initialData={dummyInitialData} />
        </div>
      </main>
    </div>
  )
}
