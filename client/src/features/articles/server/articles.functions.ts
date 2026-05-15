import { createServerFn } from '@tanstack/react-start'
import { withServerErrorHandler } from '#/utils/with-server-error-handler'
import { articlesService } from '../services/articles.service'
import {
  articleIdSchema,
  createArticleSchema,
  deleteArticleSchema,
  getArticlesSchema,
  updateArticleSchema,
} from '../schemas/articles.schema'

export const getPreferredArticles = createServerFn({ method: 'GET' })
  .inputValidator(getArticlesSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      return await articlesService.getPreferredArticles(data)
    }),
  )

export const getOwnArticles = createServerFn({ method: 'GET' })
  .inputValidator(getArticlesSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      return await articlesService.getOwnArticles(data)
    }),
  )

export const getArticle = createServerFn({ method: 'GET' })
  .inputValidator(articleIdSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      return await articlesService.getArticle(data.articleId, data.accessToken)
    }),
  )

export const createArticle = createServerFn({ method: 'POST' })
  .inputValidator(createArticleSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      const { accessToken, ...payload } = data
      return await articlesService.createArticle(payload, accessToken)
    }),
  )

export const updateArticle = createServerFn({ method: 'PATCH' })
  .inputValidator(updateArticleSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      const { accessToken, ...payload } = data
      return await articlesService.updateArticle(payload, accessToken)
    }),
  )

export const deleteArticle = createServerFn({ method: 'DELETE' })
  .inputValidator(deleteArticleSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      return await articlesService.deleteArticle(data.articleId, data.accessToken)
    }),
  )
