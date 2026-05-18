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
import {
  blockArticleSchema as blockArticleActionSchema,
  reactToArticleSchema as reactToArticleActionSchema,
} from '../schemas/article-reactions.schema'

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

export const updateArticle = createServerFn({ method: 'POST' })
  .inputValidator(updateArticleSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      const { accessToken, ...payload } = data
      return await articlesService.updateArticle(payload, accessToken)
    }),
  )

export const deleteArticle = createServerFn({ method: 'POST' })
  .inputValidator(deleteArticleSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      return await articlesService.deleteArticle(data.articleId, data.accessToken)
    }),
  )

export const reactToArticle = createServerFn({ method: 'POST' })
  .inputValidator(reactToArticleActionSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      const { accessToken, ...payload } = data
      return await articlesService.reactToArticle(payload, accessToken)
    }),
  )

export const blockArticle = createServerFn({ method: 'POST' })
  .inputValidator(blockArticleActionSchema)
  .handler(
    withServerErrorHandler(async ({ data }) => {
      const { accessToken, ...payload } = data
      return await articlesService.blockArticle(payload, accessToken)
    }),
  )
