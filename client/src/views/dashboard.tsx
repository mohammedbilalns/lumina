import { Navbar } from '#/components/Navbar'

// Dummy data 
const ARTICLES = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence in Design",
    excerpt: "How AI tools are augmenting the creative process rather than replacing designers. A deep dive into generative UI.",
    author: "Sarah Jenkins",
    date: "Oct 24",
    readTime: "6 min read",
    category: "Design",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Mastering React Server Components",
    excerpt: "Everything you need to know about the new rendering paradigm in modern React applications.",
    author: "Dan Abramov",
    date: "Oct 22",
    readTime: "12 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "The Psychology of Dark Mode",
    excerpt: "Why we love dark interfaces and how they affect our cognitive load and visual perception.",
    author: "Elena Rodriguez",
    date: "Oct 20",
    readTime: "8 min read",
    category: "Psychology",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Building Micro-Habits for Productivity",
    excerpt: "Small changes that compound over time to drastically improve your daily output.",
    author: "Marcus Chen",
    date: "Oct 18",
    readTime: "5 min read",
    category: "Self Improvement",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800"
  }
]

const INTERESTS = ["All", "Technology", "Design", "Psychology", "Self Improvement", "Web3"]

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-6 py-8 flex justify-center">
        {/* Main Feed */}
        <main className="w-full max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Recommended for You</h1>
            <p className="text-slate-400">Based on your reading history and selected interests.</p>
          </div>

          {/* Topics Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {INTERESTS.map((interest, i) => (
              <button 
                key={interest}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0 
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>

          {/* Articles List */}
          <div className="space-y-8">
            {ARTICLES.map(article => (
              <article key={article.id} className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-white/10 hover:bg-slate-900/60 transition-all flex flex-col-reverse sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/20">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-slate-300 font-medium">{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden rounded-xl">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
