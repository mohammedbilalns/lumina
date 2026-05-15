import { createServerFn } from '@tanstack/react-start'
import { preferencesService } from '../services/preferences.service'
import { withServerErrorHandler } from '#/utils/with-server-error-handler'
import { savePreferencesSchema, checkPreferencesStatusSchema } from '../schemas/preferences.schema'


export const getCategories = createServerFn({ method: 'GET' })
  .handler(withServerErrorHandler(async () => {
    return await preferencesService.getCategories()
  }))

export const saveUserPreferences = createServerFn({ method: 'POST' })
  .inputValidator(savePreferencesSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await preferencesService.savePreferences(data.categoryIds, data.accessToken)
  }))

export const checkPreferencesStatus = createServerFn({ method: 'GET' })
  .inputValidator(checkPreferencesStatusSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await preferencesService.checkPreferencesStatus(data?.accessToken)
  }))
