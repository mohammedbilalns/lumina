import { Await, createFileRoute, defer, redirect, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Settings, Sparkles } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Navbar } from '#/components/navbar'
import { Skeleton } from '#/components/skeleton'
import { PaginationControls } from '#/features/articles/components/pagination-controls'
import { articleRouteSearchSchema } from '#/features/articles/schemas/articles.schema'
import { CategorySelection } from '@/features/preferences/components/category-selection'
import { checkPreferencesStatus } from '@/features/preferences/server/preferences.functions'
import { ArticleCard, ArticleCardSkeleton } from '#/features/articles/components/article-card'
import { ROUTES } from '@/constants/routes'

import { preferredArticlesQueryOptions, publicArticlesQueryOptions } from '#/features/articles/hooks/use-articles-query'

export const Route = createFileRoute('/dashboard')({
  validateSearch: articleRouteSearchSchema,
  pendingMs: 0,
  pendingComponent: DashboardPending,
  beforeLoad: ({ context }) => {
    if (context.authMode === 'anonymous') {
      throw redirect({ to: ROUTES.auth })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const isAuthenticated = context.authMode === 'authenticated'

    await context.queryClient.ensureQueryData(
      isAuthenticated
        ? preferredArticlesQueryOptions({
            accessToken: context.accessToken || undefined,
            page: deps.page,
            limit: deps.limit,
            search: deps.search,
            authMode: context.authMode,
          })
        : publicArticlesQueryOptions({
            page: deps.page,
            limit: deps.limit,
            search: deps.search,
            authMode: context.authMode,
          })
    )

    const preferencesPromise = isAuthenticated
      ? checkPreferencesStatus({
          data: { accessToken: context.accessToken || undefined },
        }).then(res => Boolean(res.data.isConfigured))
        .catch(() => true)
      : Promise.resolve(true)

    return {
      isGuest: !isAuthenticated,
      preferencesPromise: defer(preferencesPromise),
    }
  },
  component: DashboardPage,
})

export function DashboardPage() {
  const navigate = useNavigate({ from: ROUTES.dashboard })
  const searchParams = Route.useSearch()
  const { user, accessToken } = Route.useRouteContext()
  const { preferencesPromise, isGuest } = Route.useLoaderData()
  const isSignedIn = Boolean(user && accessToken)
  const { data: articlesData } = useSuspenseQuery(
    isSignedIn
      ? preferredArticlesQueryOptions({
          accessToken: accessToken || undefined,
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.search,
          authMode: 'authenticated',
        })
      : publicArticlesQueryOptions({
          page: searchParams.page,
          limit: searchParams.limit,
          search: searchParams.search,
          authMode: 'guest',
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
          {(
            <Suspense>
              <Await promise={preferencesPromise}>
                {(isPreferencesConfigured) => (
                  <DashboardPreferenceSection isPreferencesConfigured={isPreferencesConfigured} />
                )}
              </Await>
            </Suspense>
          )}

          <div className="mb-10">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-serif font-medium text-[#0b2226]">
                {isGuest ? 'Explore Articles' : 'Recommended for You'}
              </h1>
              {!isGuest && (
                <Suspense>
                  <Await promise={preferencesPromise}>
                    {() => <DashboardSettingsButton />}
                  </Await>
                </Suspense>
              )}
            </div>
            <p className="text-slate-500">
              {isGuest
                ? 'Browse public articles in guest mode. Sign in to personalize your feed and save preferences.'
                : 'Personalized articles that match your selected interests. Your own articles are excluded from this feed.'}
            </p>
          </div>

          {isGuest ? (
            <DashboardArticlesList 
              articles={articlesData.articles} 
              pagination={articlesData.pagination} 
              isPreferencesConfigured={true}
              handlePageChange={handlePageChange}
              showReactionActions={false}
            />
          ) : (
            <Await promise={preferencesPromise}>
              {(isPreferencesConfigured) => (
                <DashboardArticlesList 
                  articles={articlesData.articles} 
                  pagination={articlesData.pagination} 
                  isPreferencesConfigured={isPreferencesConfigured}
                  handlePageChange={handlePageChange}
                  showReactionActions={true}
                />
              )}
            </Await>
          )}
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

  if (isPreferencesConfigured) return null

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

function DashboardSettingsButton() {
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
  handlePageChange,
  showReactionActions,
}: { 
  articles: any[], 
  pagination: any, 
  isPreferencesConfigured: boolean,
  handlePageChange: (page: number) => void,
  showReactionActions: boolean,
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
          <ArticleCard key={article.id} article={article} showReactionActions={showReactionActions} />
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

function DashboardPending() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans text-[#111111] selection:bg-[#f8cb5b]/30">
      <Navbar />

      <div className="container mx-auto flex justify-center px-6 py-12">
        <main className="w-full max-w-4xl">
          <div className="mb-10">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-full max-w-md" />
          </div>

          <DashboardSkeletonContent />
        </main>
      </div>
    </div>
  )
}
