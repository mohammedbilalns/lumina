import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/article/$id')({
  component: () => <Outlet />,
})
