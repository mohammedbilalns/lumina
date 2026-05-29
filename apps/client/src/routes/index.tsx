import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Compass } from 'lucide-react'
import { Navbar } from '#/components/navbar'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/')({ component: Landing })

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#f8cb5b]/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-16 pb-32 max-w-6xl">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-8 text-slate-500">
          <Compass className="w-5 h-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">
            Featured Guides
          </span>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-[#13383d] rounded-4xl p-10 md:p-16 relative overflow-hidden shadow-sm flex items-center min-h-90">
          {/* Subtle Background Pattern / Graphics */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 md:opacity-100 pointer-events-none flex justify-end">
            {/* Mocking the compass graphic from Nova with CSS shapes */}
            <div className="relative w-96 h-full flex items-center justify-center">
              <div className="absolute w-64 h-64 border-4 border-emerald-400/30 rounded-full"></div>
              <div className="absolute w-48 h-48 border-12 border-[#0b2226] rounded-full"></div>
              <div className="absolute w-2 h-32 bg-emerald-400 rotate-45 transform origin-center"></div>
              <div className="absolute w-2 h-32 bg-white rotate-[-135deg] transform origin-center"></div>
              <div className="w-8 h-8 rounded-full bg-[#f8cb5b] z-10 shadow-lg"></div>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight mb-4 leading-tight">
              Looking for top-tier reading resources?
            </h1>
            <p className="text-lg text-emerald-50/70 mb-10">
              Insightful guides written from an expert's perspective.
            </p>
            <Link
              to={ROUTES.dashboard}
              className="inline-flex items-center gap-2 bg-white text-[#13383d] font-medium px-6 py-3 rounded-md hover:bg-slate-100 transition-colors"
            >
              Explore <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="mb-8 text-2xl font-serif font-medium text-[#0b2226]">
            How the reading flow works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#13383d]">
                01
              </span>
              <h3 className="mt-3 mb-2 text-lg font-serif font-medium text-[#0b2226]">
                Configure preferences
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                Pick categories once and the dashboard will surface matching articles for you.
              </p>
            </article>
            <article className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#13383d]">
                02
              </span>
              <h3 className="mt-3 mb-2 text-lg font-serif font-medium text-[#0b2226]">
                Read personalized content
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                The dashboard excludes articles created by the current user and paginates the recommended feed.
              </p>
            </article>
            <article className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#13383d]">
                03
              </span>
              <h3 className="mt-3 mb-2 text-lg font-serif font-medium text-[#0b2226]">
                Manage your own writing
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                Create, edit, delete, and paginate your own articles from one place.
              </p>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b2226] text-white py-20 border-t border-[#0b2226]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Lumina
            </p>
            <h2 className="mt-4 text-3xl font-serif font-medium">
              Thoughtful reading, curated around what matters to you.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Explore personalized articles, follow your interests, and manage your writing in one focused space.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
