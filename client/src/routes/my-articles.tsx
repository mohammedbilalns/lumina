import { createFileRoute } from '@tanstack/react-router'
import { MyArticlesPage } from '#/views/my-articles'

export const Route = createFileRoute('/my-articles')({
  component: MyArticlesPage,
})
