import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/views/dashboard'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
