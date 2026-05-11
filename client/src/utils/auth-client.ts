let currentAccessToken: string | null = null

export const authClient = {
  setAccessToken(token: string | null) {
    currentAccessToken = token
  },
  getAccessToken() {
    return currentAccessToken
  }
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
