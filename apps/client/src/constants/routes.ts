export const ROUTES = {
  home: '/',
  auth: '/auth',
  dashboard: '/dashboard',
  myArticles: '/my-articles',
  settings: '/settings',
  article: {
    create: '/article/create',
    detail: '/article/$id',
    detailIndex: '/article/$id/',
    edit: '/article/$id/edit',
  },
} as const
