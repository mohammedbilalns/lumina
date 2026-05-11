import { env } from '@/config/env'
import { type SuccessResponse, type ErrorResponse, ApiError } from '@/types/response'
import { fetchWithAuth } from '@/features/authentication/server/api-client.server'

export interface Category {
  id: string
  name: string
  slug: string
}

export interface PreferencesStatus {
  isConfigured: boolean
}

export const preferencesService = {
  async getCategories(): Promise<SuccessResponse<{ categories: Category[] }>> {
    const response = await fetch(`${env.API_URL}/categories`)
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to fetch categories",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<{ categories: Category[] }>
  },

  async savePreferences(categoryIds: string[], accessToken?: string | null): Promise<SuccessResponse<void>> {
    const response = await fetchWithAuth(`${env.API_URL}/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryids: categoryIds }),
    }, accessToken)

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to save preferences",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<void>
  },

  async checkPreferencesStatus(accessToken?: string | null): Promise<SuccessResponse<PreferencesStatus>> {
    const response = await fetchWithAuth(`${env.API_URL}/preferences/status`, {}, accessToken)
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to check preferences status",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<PreferencesStatus>
  }
}
