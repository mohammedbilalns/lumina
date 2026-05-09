import { createFileRoute } from '@tanstack/react-router'
import { ArticleEditPage } from '#/views/article-edit'

export const Route = createFileRoute('/article/$id/edit')({
  component: ArticleEditPage,
})
