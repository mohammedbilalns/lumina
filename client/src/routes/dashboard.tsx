import { createFileRoute, redirect, Link, useRouteContext } from '@tanstack/react-router'
import { checkPreferencesStatus } from '@/features/preferences/server/preferences.functions'
import { Navbar } from '#/components/navbar'
import { Settings, Sparkles, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CategorySelection } from '@/features/preferences/components/category-selection'



export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
    
    let isPreferencesConfigured = false
    try {
      if (context.accessToken) {
        const { data } = await checkPreferencesStatus({ data: { accessToken: context.accessToken } })
        isPreferencesConfigured = data?.isConfigured || false
      }
    } catch (error) {
      console.error('Failed to check preferences status:', error)
    }

    return {
      isPreferencesConfigured
    }
  },
  component: DashboardPage,
})


// Dummy data
const ARTICLES = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence in Design',
    excerpt:
      'How AI tools are augmenting the creative process rather than replacing designers. A deep dive into generative UI.',
    author: 'Sarah Jenkins',
    date: 'Oct 24',
    readTime: '6 min read',
    category: 'Design',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Mastering React Server Components',
    excerpt:
      'Everything you need to know about the new rendering paradigm in modern React applications.',
    author: 'Dan Abramov',
    date: 'Oct 22',
    readTime: '12 min read',
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'The Psychology of Minimalist Interfaces',
    excerpt:
      'Why stripping away the obvious and adding the meaningful leads to products that people genuinely love using every day.',
    author: 'Elena Rodriguez',
    date: 'Oct 20',
    readTime: '8 min read',
    category: 'Psychology',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    title: 'Building Micro-Habits for Productivity',
    excerpt:
      'Small changes that compound over time to drastically improve your daily output.',
    author: 'Marcus Chen',
    date: 'Oct 18',
    readTime: '5 min read',
    category: 'Self Improvement',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
  },
]

const INTERESTS = [
  'All',
  'Technology',
  'Design',
  'Psychology',
  'Self Improvement',
  'Web3',
]

export function DashboardPage() {
  const { isPreferencesConfigured } = useRouteContext({ from: '/dashboard' })
  const [showPreferenceModal, setShowPreferenceModal] = useState(!isPreferencesConfigured)

  useEffect(() => {
    if (isPreferencesConfigured) {
      setShowPreferenceModal(false)
    }
  }, [isPreferencesConfigured])

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#f8cb5b]/30 relative">
      <Navbar />

      <div className="container mx-auto px-6 py-12 flex justify-center">
        <main className="w-full max-w-4xl">
          {!isPreferencesConfigured && !showPreferenceModal && (
            <div className="mb-12 p-6 rounded-2xl border border-[#0b2226]/20 bg-[#0b2226]/5 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-[#0b2226] flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-medium text-[#0b2226]">Personalize your experience</h3>
                  <p className="text-slate-500 text-sm">Select your favorite topics to see more relevant articles.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPreferenceModal(true)}
                className="bg-[#0b2226] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#13383d] transition-all shadow-sm active:scale-95"
              >
                Configure Now
              </button>
            </div>
          )}

          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-serif font-medium text-[#0b2226]">
                Recommended for You
              </h1>
              <button 
                onClick={() => setShowPreferenceModal(true)}
                className="p-2 text-slate-400 hover:text-[#0b2226] transition-colors rounded-lg hover:bg-slate-50"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500">
              Based on your reading history and selected interests.
            </p>
          </div>

          {/* Topics Filter */}
          <div className="flex gap-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
            {INTERESTS.map((interest, i) => (
              <button
                key={interest}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-[#0b2226] text-white'
                    : 'bg-white text-slate-600 border border-[#EAEAEA] hover:bg-slate-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>

          {/* Articles List */}
          <div className="space-y-8">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group relative bg-white border border-[#EAEAEA] rounded-xl p-6 hover:shadow-sm transition-all flex flex-col-reverse sm:flex-row gap-8"
              >
                <Link
                  to="/article/$id"
                  params={{ id: article.id.toString() }}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View Article</span>
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-[#13383d] uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-medium mb-3 text-[#0b2226] group-hover:text-[#13383d] transition-colors line-clamp-2 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-medium text-slate-700">
                        {article.author}
                      </span>
                      <span>•</span>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-56 h-48 sm:h-auto shrink-0 rounded-lg overflow-hidden border border-[#EAEAEA]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      {/* Preferences Modal Overlay */}
      {showPreferenceModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10 bg-[#0b2226]/40 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] p-8 sm:p-16 max-h-[95vh] overflow-y-auto relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">
            {isPreferencesConfigured && (
              <button 
                onClick={() => setShowPreferenceModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-[#0b2226] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <CategorySelection onSuccess={() => setShowPreferenceModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
