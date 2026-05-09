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
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans selection:bg-[#f8cb5b]/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-serif font-medium mb-2 text-[#0b2226]">My Articles</h1>
            <p className="text-slate-500">Manage your published stories and drafts.</p>
          </div>
          <Link to="/article/create" className="px-5 py-2.5 bg-[#f8cb5b] hover:bg-[#f2c94c] text-[#0b2226] rounded-md font-medium transition-colors flex items-center justify-center gap-2 shrink-0">
            <PenTool className="w-4 h-4" />
            Write a Story
          </Link>
        </div>

        <div className="space-y-4">
          {MY_ARTICLES.map(article => (
            <div key={article.id} className="relative bg-white border border-[#EAEAEA] rounded-xl p-6 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-serif font-medium text-[#0b2226] line-clamp-1">
                    <Link to="/article/$id" params={{ id: article.id.toString() }} className="hover:text-[#13383d] transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${
                    article.status === 'Published' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {article.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-5">{article.date}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-600" title="Likes">
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
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-[#EAEAEA] pt-4 md:pt-0 relative z-10">
                <Link to="/article/$id/edit" params={{ id: article.id.toString() }} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAEAEA] hover:bg-slate-50 text-slate-600 rounded-md transition-colors font-medium text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-md transition-colors font-medium text-sm">
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
