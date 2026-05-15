import { Toaster } from 'sonner'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { User } from '../types/user'
import { getMe } from '../features/authentication/server/auth.functions'
import { authClient } from '../utils/auth-client'

interface MyRouterContext {
  queryClient: QueryClient
  user: User | null
  accessToken: string | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // On client-side navigation, reuse the in-memory session cache.
    // Only fetch from the backend on a full page load / SSR request.
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
})

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
