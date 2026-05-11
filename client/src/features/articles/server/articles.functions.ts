import { createServerFn } from '@tanstack/react-start'
import { articlesService } from '../services/articles.service'
import { withServerErrorHandler } from '#/utils/with-server-error-handler'
import { getArticlesSchema } from '../schemas/articles.schema'

export const getPreferredArticles = createServerFn({ method: 'GET' })
  .inputValidator(getArticlesSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await articlesService.getPreferredArticles(data?.accessToken, data?.page, data?.limit)
  }))
