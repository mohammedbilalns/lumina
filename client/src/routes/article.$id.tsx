import { createFileRoute } from '@tanstack/react-router'
import { ArticlePage } from '#/views/article'

export const Route = createFileRoute('/article/$id')({
  component: ArticlePage,
})
