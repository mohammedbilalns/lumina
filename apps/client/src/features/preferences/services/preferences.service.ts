import { API_ROUTES } from '@/constants/api-routes'
import { ApiError } from '@/types/response'
import type { ErrorResponse, SuccessResponse } from '@/types/response'
import { fetchWithAuth } from '@/features/authentication/server/api-client.server'
import type {
  Category,
  PreferencesStatus,
} from '@lumina/shared-types'

export type { Category, PreferencesStatus } from '@lumina/shared-types'

export const preferencesService = {
  async getCategories(): Promise<SuccessResponse<{ categories: Category[] }>> {
    const response = await fetch(API_ROUTES.categories)
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
    const response = await fetchWithAuth(API_ROUTES.preferences.root, {
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
    const response = await fetchWithAuth(API_ROUTES.preferences.status, {}, accessToken)
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
  },

  async getUserPreferences(accessToken?: string | null): Promise<SuccessResponse<{ preferences: { category: { id: string } }[] }>> {
    const response = await fetchWithAuth(API_ROUTES.preferences.root, {}, accessToken)
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to fetch user preferences",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<{ preferences: { category: { id: string } }[] }>
  }
}
