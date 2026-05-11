import { getRequest, getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server"
import { env } from "#/config/env"
import { authService } from "../services/auth.service"

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  accessToken?: string | null
): Promise<Response> {
  let currentToken = accessToken
  
  if (!currentToken) {
    const request = getRequest()
    const authHeader = request?.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      currentToken = authHeader.substring(7)
    }
  }

  // Helper to apply the current token to headers
  const applyToken = (opts: RequestInit, token: string | undefined | null) => {
    const headers = new Headers(opts.headers)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return { ...opts, headers }
  }

  // 1. Try with current access token
  let response = await fetch(url, applyToken(options, currentToken))

  // 2. If unauthorized or no token provided, try to refresh using the refresh cookie
  if (response.status === 401 || !currentToken) {
    const refreshToken = getCookie('refreshToken')
    
    if (refreshToken) {
      try {
        const refreshResponse = await authService.refreshToken(refreshToken)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data

        setCookie('refreshToken', newRefreshToken, {
          ...AUTH_COOKIE_OPTIONS,
          maxAge: 60 * 60 * 24 * 7
        })

        // 3. Retry original request with new token
        response = await fetch(url, applyToken(options, newAccessToken))
      } catch (err) {
        deleteCookie('refreshToken')
      }
    }
  }

  return response
}
