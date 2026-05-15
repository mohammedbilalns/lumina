import type { User } from '@/types/user'

interface AuthSession {
  user: User | null
  accessToken: string | null
}

let hydratedFromBackend = false
let currentSession: AuthSession = {
  user: null,
  accessToken: null,
}

export const authClient = {
  setSession(session: AuthSession) {
    currentSession = session
    hydratedFromBackend = true
  },
  clearSession() {
    currentSession = {
      user: null,
      accessToken: null,
    }
    hydratedFromBackend = true
  },
  getSession() {
    return currentSession
  },
  hasHydratedSession() {
    return hydratedFromBackend
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
