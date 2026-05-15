import { Await, Link, createFileRoute, defer, redirect, useNavigate, useRouteContext } from '@tanstack/react-router'
import { Search, Settings, Sparkles, X } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Navbar } from '#/components/navbar'
import { Skeleton } from '#/components/skeleton'
import { PaginationControls } from '#/features/articles/components/pagination-controls'
import { articleRouteSearchSchema } from '#/features/articles/schemas/articles.schema'
import { getPreferredArticles } from '#/features/articles/server/articles.functions'
import { CategorySelection } from '@/features/preferences/components/category-selection'
import { checkPreferencesStatus } from '@/features/preferences/server/preferences.functions'

export const Route = createFileRoute('/dashboard')({
  validateSearch: articleRouteSearchSchema,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    if (!context.accessToken) {
      return {
        articlesPromise: defer(Promise.resolve({
          articles: [],
          pagination: { page: deps.page, limit: deps.limit, total: 0, totalPages: 0 },
        })),
        preferencesPromise: defer(Promise.resolve(false)),
      }
    }

    const articlesPromise = getPreferredArticles({
      data: {
        accessToken: context.accessToken,
        page: deps.page,
        limit: deps.limit,
        search: deps.search,
      },
    }).then(res => res.data)

    const preferencesPromise = checkPreferencesStatus({
      data: { accessToken: context.accessToken },
    }).then(res => res.data?.isConfigured || false)
      .catch(() => true)

    return {
      articlesPromise: defer(articlesPromise),
      preferencesPromise: defer(preferencesPromise),
    }
  },
  component: DashboardPage,
})

export function DashboardPage() {
  const navigate = useNavigate({ from: '/dashboard' })
  const searchParams = Route.useSearch()
  const { articlesPromise, preferencesPromise } = Route.useLoaderData()
  const [searchInput, setSearchInput] = useState(searchParams.search || '')

  useEffect(() => {
    setSearchInput(searchParams.search || '')
  }, [searchParams.search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchInput || undefined,
        page: 1,
      }),
    })
  }

  const clearSearch = () => {
    setSearchInput('')
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        page: 1,
      }),
    })
  }

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#f8cb5b]/30 relative">
      <Navbar />

      <div className="container mx-auto px-6 py-12 flex justify-center">
        <main className="w-full max-w-4xl">
          <Suspense>
            <Await promise={preferencesPromise}>
              {(isPreferencesConfigured) => (
                <DashboardPreferenceSection isPreferencesConfigured={isPreferencesConfigured} />
              )}
            </Await>
          </Suspense>

          <div className="mb-10">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-serif font-medium text-[#0b2226]">
                Recommended for You
              </h1>
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full rounded-full border border-[#EAEAEA] bg-white py-2 pl-10 pr-10 text-sm focus:border-[#0b2226] focus:outline-none focus:ring-1 focus:ring-[#0b2226] transition-all"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </form>
                <Suspense>
                  <Await promise={preferencesPromise}>
                    {(isPreferencesConfigured) => (
                      <DashboardSettingsButton isPreferencesConfigured={isPreferencesConfigured} />
                    )}
                  </Await>
                </Suspense>
              </div>
            </div>
            <p className="text-slate-500">
              Personalized articles that match your selected interests. Your own articles are excluded from this feed.
            </p>
          </div>

          <Suspense fallback={<DashboardSkeletonContent />}>
            <Await promise={articlesPromise}>
              {({ articles, pagination }) => (
                <Await promise={preferencesPromise}>
                  {(isPreferencesConfigured) => (
                    <DashboardArticlesList 
                      articles={articles} 
                      pagination={pagination} 
                      isPreferencesConfigured={isPreferencesConfigured}
                      handlePageChange={handlePageChange}
                    />
                  )}
                </Await>
              )}
            </Await>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function DashboardPreferenceSection({ isPreferencesConfigured }: { isPreferencesConfigured: boolean }) {
  const [showPreferenceModal, setShowPreferenceModal] = useState(!isPreferencesConfigured)

  useEffect(() => {
    if (isPreferencesConfigured) {
      setShowPreferenceModal(false)
    }
  }, [isPreferencesConfigured])

  if (isPreferencesConfigured || showPreferenceModal) return null

  return (
    <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#0b2226]/20 bg-[#0b2226]/5 p-6 text-center sm:flex-row sm:text-left">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b2226] shadow-sm">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-medium text-[#0b2226]">Personalize your experience</h3>
          <p className="text-sm text-slate-500">Select your favorite topics to see relevant articles.</p>
        </div>
      </div>
      <button
        onClick={() => setShowPreferenceModal(true)}
        className="rounded-xl bg-[#0b2226] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#13383d]"
      >
        Configure Now
      </button>

      {showPreferenceModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#0b2226]/40 p-4 backdrop-blur-md sm:p-10">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-white p-6 shadow-2xl sm:p-10">
            <CategorySelection onSuccess={() => setShowPreferenceModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardSettingsButton({ isPreferencesConfigured }: { isPreferencesConfigured: boolean }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#0b2226]"
        title="Preferences"
      >
        <Settings className="h-5 w-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#0b2226]/40 p-4 backdrop-blur-md sm:p-10">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-white p-6 shadow-2xl sm:p-10">
            <CategorySelection onSuccess={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  )
}

function DashboardArticlesList({ 
  articles, 
  pagination, 
  isPreferencesConfigured,
  handlePageChange
}: { 
  articles: any[], 
  pagination: any, 
  isPreferencesConfigured: boolean,
  handlePageChange: (page: number) => void
}) {
  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#EAEAEA] bg-[#FBFBFA] px-8 py-16 text-center">
        <h2 className="mb-3 text-2xl font-serif font-medium text-[#0b2226]">
          No personalized articles yet
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-sm leading-6 text-slate-500">
          {isPreferencesConfigured
            ? 'There are no matching articles for your current preferences yet.'
            : 'Choose your preferred categories to start building a personalized reading feed.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group relative flex flex-col-reverse gap-8 rounded-xl border border-[#EAEAEA] bg-white p-6 transition-all hover:shadow-sm sm:flex-row"
          >
            <Link
              to="/article/$id"
              params={{ id: article.id }}
              className="absolute inset-0 z-10"
            >
              <span className="sr-only">View article</span>
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#13383d]">
                  {article.category.name}
                </span>
              </div>
              <h2 className="mb-3 line-clamp-2 text-2xl leading-tight font-serif font-medium text-[#0b2226] transition-colors group-hover:text-[#13383d]">
                {article.title}
              </h2>
              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500">
                {article.description}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">
                    {article.author.firstName} {article.author.lastName}
                  </span>
                  <span>•</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{article.likesCount} likes</span>
                </div>
              </div>
            </div>

            <div className="h-48 w-full shrink-0 overflow-hidden rounded-lg border border-[#EAEAEA] bg-[#F7F6F3] sm:h-auto sm:w-56">
              {article.featuredImage ? (
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full min-h-48 items-center justify-center px-6 text-center text-sm text-slate-400">
                  No cover image
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
    </>
  )
}

function DashboardSkeletonContent() {
  return (
    <div className="space-y-8 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col-reverse gap-8 rounded-xl border border-[#EAEAEA] p-6 sm:flex-row">
          <div className="flex flex-1 flex-col">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="mb-3 h-8 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-6 h-4 w-3/4" />
            <div className="mt-auto flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-48 w-full shrink-0 rounded-lg sm:h-40 sm:w-56" />
        </div>
      ))}
    </div>
  )
}
