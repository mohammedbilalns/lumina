import { Navbar } from '#/components/Navbar'
import { Link } from '@tanstack/react-router'
import { ThumbsUp, ThumbsDown, ShieldAlert, Edit2, Trash2, PenTool } from 'lucide-react'

const MY_ARTICLES = [
  {
    id: 101,
    title: "Understanding Server Actions in Next.js",
    date: "Oct 26, 2023",
    status: "Published",
    stats: { likes: 342, dislikes: 12, blocks: 0 }
  },
  {
    id: 102,
    title: "Why Glassmorphism is Here to Stay",
    date: "Oct 15, 2023",
    status: "Published",
    stats: { likes: 890, dislikes: 45, blocks: 2 }
  },
  {
    id: 103,
    title: "10 Tips for Better Typography",
    date: "Sep 28, 2023",
    status: "Draft",
    stats: { likes: 0, dislikes: 0, blocks: 0 }
  }
]

export function MyArticlesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Articles</h1>
            <p className="text-slate-400">Manage your published stories and drafts.</p>
          </div>
          <Link to="/article/create" className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 shrink-0">
            <PenTool className="w-4 h-4" />
            Write a Story
          </Link>
        </div>

        <div className="space-y-4">
          {MY_ARTICLES.map(article => (
            <div key={article.id} className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-slate-100 line-clamp-1">
                    <Link to="/article/$id" params={{ id: article.id.toString() }} className="hover:text-indigo-400 transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    article.status === 'Published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {article.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{article.date}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-indigo-300" title="Likes">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{article.stats.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400" title="Dislikes">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{article.stats.dislikes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400" title="Blocks">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-sm font-medium">{article.stats.blocks}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 relative z-10">
                <Link to="/article/$id/edit" params={{ id: article.id.toString() }} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg transition-colors font-medium text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors font-medium text-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
