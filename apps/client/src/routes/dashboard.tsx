import { Await, createFileRoute, defer, redirect, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Settings, Sparkles } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Navbar } from '#/components/navbar'
import { PaginationControls } from '#/features/articles/components/pagination-controls'
import { articleRouteSearchSchema } from '#/features/articles/schemas/articles.schema'
import { CategorySelection } from '@/features/preferences/components/category-selection'
import { checkPreferencesStatus } from '@/features/preferences/server/preferences.functions'
import { ArticleCard } from '#/features/articles/components/article-card'

import { preferredArticlesQueryOptions } from '#/features/articles/hooks/use-articles-query'

export const Route = createFileRoute('/dashboard')({
  validateSearch: articleRouteSearchSchema,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      preferredArticlesQueryOptions({
        accessToken: context.accessToken || undefined,
        page: deps.page,
        limit: deps.limit,
        search: deps.search,
      })
    )

    const preferencesPromise = checkPreferencesStatus({
      data: { accessToken: context.accessToken || undefined },
    }).then(res => res.data?.isConfigured || false)
      .catch(() => true)

    return {
      preferencesPromise: defer(preferencesPromise),
    }
  },
  component: DashboardPage,
})

export function DashboardPage() {
  const navigate = useNavigate({ from: '/dashboard' })
  const searchParams = Route.useSearch()
  const { accessToken } = Route.useRouteContext()
  const { preferencesPromise } = Route.useLoaderData()
  const { data: articlesData } = useSuspenseQuery(
    preferredArticlesQueryOptions({
      accessToken: accessToken || undefined,
      page: searchParams.page,
      limit: searchParams.limit,
      search: searchParams.search,
    }),
  )

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans selection:bg-[#f8cb5b]/30 relative pb-20">
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
              <Suspense>
                <Await promise={preferencesPromise}>
                  {(isPreferencesConfigured) => (
                    <DashboardSettingsButton isPreferencesConfigured={isPreferencesConfigured} />
                  )}
                </Await>
              </Suspense>
            </div>
            <p className="text-slate-500">
              Personalized articles that match your selected interests. Your own articles are excluded from this feed.
            </p>
          </div>

          <Await promise={preferencesPromise}>
            {(isPreferencesConfigured) => (
              <DashboardArticlesList 
                articles={articlesData.articles} 
                pagination={articlesData.pagination} 
                isPreferencesConfigured={isPreferencesConfigured}
                handlePageChange={handlePageChange}
              />
            )}
          </Await>
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
      <div className="space-y-4">
        {articles.map((article: any) => (
          <ArticleCard key={article.id} article={article} showReactionActions={false} />
        ))}
      </div>

      <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
    </>
  )
}

function DashboardSkeletonContent() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}
