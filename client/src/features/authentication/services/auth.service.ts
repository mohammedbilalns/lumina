import { env } from '@/config/env'
import { type SuccessResponse, type ErrorResponse, ApiError } from '@/types/response'
import type { User } from '@/types/user'

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

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
    const response = await fetch(`${env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<AuthResponse>(response)
  },

  async register(data: any): Promise<SuccessResponse<void>> {
    const response = await fetch(`${env.API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async verifySignupOtp(data: any): Promise<SuccessResponse<AuthResponse>> {
    const response = await fetch(`${env.API_URL}/auth/signup/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<AuthResponse>(response)
  },

  async refreshToken(refreshToken: string): Promise<SuccessResponse<AuthResponse>> {
    const response = await fetch(`${env.API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    return this.handleResponse<AuthResponse>(response)
  },

  async logout(accessToken: string): Promise<SuccessResponse<void>> {
    const response = await fetch(`${env.API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
    return this.handleResponse<void>(response)
  },

  async resendSignupOtp(data: { email: string }): Promise<SuccessResponse<void>> {
    const response = await fetch(`${env.API_URL}/auth/signup/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async forgotPassword(data: { email: string }): Promise<SuccessResponse<void>> {
    const response = await fetch(`${env.API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async resendForgotPasswordOtp(data: { email: string }): Promise<SuccessResponse<void>> {
    const response = await fetch(`${env.API_URL}/auth/forgot-password/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  },

  async resetPassword(data: any): Promise<SuccessResponse<void>> {
    const response = await fetch(`${env.API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse<void>(response)
  }
}
