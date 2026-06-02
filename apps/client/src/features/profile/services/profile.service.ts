import { API_ROUTES } from '@/constants/api-routes'
import { ApiError } from '@/types/response'
import type { ErrorResponse, SuccessResponse } from '@/types/response'
import { fetchWithAuth } from '@/features/authentication/server/api-client.server'
import type { UserProfile } from '@lumina/shared-types'
import type { UpdateProfileInput, ChangePasswordInput } from '../schemas/profile.schema'

export const profileService = {
  async getProfile(accessToken?: string | null): Promise<SuccessResponse<{ user: UserProfile }>> {
    const response = await fetchWithAuth(API_ROUTES.users.profile, {}, accessToken)
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to fetch profile",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<{ user: UserProfile }>
  },

  async updateProfile(data: UpdateProfileInput, accessToken?: string | null): Promise<SuccessResponse<{ user: UserProfile }>> {
    const response = await fetchWithAuth(API_ROUTES.users.profile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }, accessToken)

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to update profile",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<{ user: UserProfile }>
  },

  async changePassword(data: ChangePasswordInput, accessToken?: string | null): Promise<SuccessResponse<void>> {
    const response = await fetchWithAuth(API_ROUTES.users.changePassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }, accessToken)

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      const error = result as ErrorResponse | null
      throw new ApiError(
        error?.message || "Failed to change password",
        response.status,
        error?.error
      )
    }

    return result as SuccessResponse<void>
  }
}
