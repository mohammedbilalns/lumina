import { createServerFn } from '@tanstack/react-start'
import { profileService } from '../services/profile.service'
import { withServerErrorHandler } from '#/utils/with-server-error-handler'
import { updateProfileSchema, changePasswordSchema } from '../schemas/profile.schema'
import { z } from 'zod'

export const getProfile = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ accessToken: z.string().optional().nullable() }))
  .handler(withServerErrorHandler(async ({ data }) => {
    return await profileService.getProfile(data.accessToken)
  }))

export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator(updateProfileSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    const { accessToken, ...payload } = data
    return await profileService.updateProfile(payload, accessToken)
  }))

export const changePassword = createServerFn({ method: 'POST' })
  .inputValidator(changePasswordSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    const { accessToken, ...payload } = data
    return await profileService.changePassword(payload, accessToken)
  }))
