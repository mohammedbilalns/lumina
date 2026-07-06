import type { UserProfile } from '@lumina/shared-types'

export type AuthMode = 'anonymous' | 'guest' | 'authenticated'

interface AuthSession {
  user: UserProfile | null
  accessToken: string | null
  authMode: AuthMode
}

const GUEST_COOKIE_NAME = 'lumina_guest_mode'

let sessionHydrated = false
let currentSession: AuthSession = {
  user: null,
  accessToken: null,
  authMode: 'anonymous',
}

function setGuestCookie(enabled: boolean) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${GUEST_COOKIE_NAME}=${enabled ? '1' : ''}; path=/; max-age=${enabled ? 60 * 60 * 24 * 7 : 0}; samesite=lax`
}

export const authClient = {
  setSession(session: AuthSession) {
    currentSession = session
    sessionHydrated = true

    if (session.authMode === 'guest') {
      setGuestCookie(true)
    } else {
      setGuestCookie(false)
    }
  },
  clearSession() {
    currentSession = {
      user: null,
      accessToken: null,
      authMode: 'anonymous',
    }
    sessionHydrated = true
    setGuestCookie(false)
  },
  getSession() {
    return currentSession
  },
  hasHydratedSession() {
    return sessionHydrated
  },
  setAccessToken(token: string | null) {
    currentSession = {
      ...currentSession,
      accessToken: token,
    }
  },
  getAccessToken() {
    return currentSession.accessToken
  },
}

/**
 * Helper to call server functions with the current access token in headers.
 */
export async function callAuthorized<TInput, TOutput>(
  fn: { (args: { data: TInput, headers?: HeadersInit }): Promise<TOutput> },
  data: TInput
): Promise<TOutput> {
  const token = authClient.getAccessToken()
  const headers: HeadersInit = {}
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return await fn({ data, headers })
}
