import { createFileRoute } from '@tanstack/react-router'
import { ArticleCreatePage } from '#/views/article-create'

export const Route = createFileRoute('/article/create')({
  component: ArticleCreatePage,
})
