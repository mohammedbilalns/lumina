import { Toaster } from 'sonner'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { UserProfile } from '@lumina/shared-types'
import { getMe } from '../features/authentication/server/auth.functions'
import { authClient } from '../utils/auth-client'
import { ROUTES } from '@/constants/routes'

interface MyRouterContext {
  queryClient: QueryClient
  user: UserProfile | null
  accessToken: string | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof window !== 'undefined' && authClient.hasHydratedSession()) {
      return authClient.getSession()
    }

    const { data } = await getMe()
    const accessToken = data?.accessToken || null
    const session = {
      user: data?.user || null,
      accessToken,
    }

    if (typeof window !== 'undefined') {
      authClient.setSession(session)
    }

    return {
      ...session,
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Lumina - Share Your Story' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
      <h1 className="mb-4 text-6xl font-serif font-bold text-[#0b2226]">404</h1>
      <h2 className="mb-8 text-2xl font-serif text-slate-600">Page not found</h2>
      <Link
        to={ROUTES.home}
        className="rounded-xl bg-[#0b2226] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#13383d]"
      >
        Go back home
      </Link>
    </div>
  )
}

function RootDocument() {
  const { user, accessToken } = Route.useRouteContext()

  useEffect(() => {
    authClient.setSession({
      user,
      accessToken,
    })
  }, [accessToken, user])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning={true}>
        <Outlet />
        <Toaster richColors position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
