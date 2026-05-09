import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '#/views/auth'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})
