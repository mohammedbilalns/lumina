import { API_ROUTES } from '@/constants/api-routes'
import type { AuthResponse } from '@lumina/shared-types'
import { ApiError } from '@/types/response'
import type { ErrorResponse, SuccessResponse } from '@/types/response'

export const authService = {
   async handleResponse<T>(response: Response): Promise<SuccessResponse<T>> {
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Authentication request failed",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<T>
  },

  async login(data: any): Promise<SuccessResponse<AuthResponse>> {
    const response = await fetch(API_ROUTES.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<AuthResponse>(response)
  },

  async register(data: any): Promise<SuccessResponse<void>> {
    const response = await fetch(API_ROUTES.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async verifySignupOtp(data: any): Promise<SuccessResponse<AuthResponse>> {
    const response = await fetch(API_ROUTES.auth.verifySignupOtp, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<AuthResponse>(response)
  },

  async refreshToken(refreshToken: string): Promise<SuccessResponse<AuthResponse>> {
    const response = await fetch(API_ROUTES.auth.refreshToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    return this.handleResponse<AuthResponse>(response)
  },

  async logout(accessToken: string): Promise<SuccessResponse<void>> {
    const response = await fetch(API_ROUTES.auth.logout, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
    return this.handleResponse<void>(response)
  },

  async resendSignupOtp(data: { email: string }): Promise<SuccessResponse<void>> {
    const response = await fetch(API_ROUTES.auth.resendSignupOtp, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async forgotPassword(data: { email: string }): Promise<SuccessResponse<void>> {
    const response = await fetch(API_ROUTES.auth.forgotPassword, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async resendForgotPasswordOtp(data: { email: string }): Promise<SuccessResponse<void>> {
    const response = await fetch(API_ROUTES.auth.resendForgotPasswordOtp, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async resetPassword(data: any): Promise<SuccessResponse<void>> {
    const response = await fetch(API_ROUTES.auth.resetPassword, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  }
}
