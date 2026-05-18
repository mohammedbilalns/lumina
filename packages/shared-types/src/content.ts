export interface Category {
  id: string
  name: string
  slug: string
}

export interface ArticleAuthor {
  id: string
  firstName: string
  lastName: string
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  featuredImage: string | null
  likesCount: number
  reactionType: 'LIKE' | 'DISLIKE' | null
  isLiked: boolean
  createdAt: string
  updatedAt: string
  author: ArticleAuthor
  category: Category
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListArticlesData {
  articles: Article[]
  pagination: PaginationMeta
}

export interface UserPreference {
  id: string
  category: Category
}

export interface PreferencesStatus {
  isConfigured: boolean
}
