import { Navbar } from '#/components/Navbar'
import { ArticleEditor } from '#/components/ArticleEditor'

export function ArticleCreatePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Create New Article</h1>
          <p className="text-slate-400">Share your ideas with the Lumina community.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <ArticleEditor mode="create" />
        </div>
      </main>
    </div>
  )
}
