import { Link } from '@tanstack/react-router'
import { BookOpen, Edit2, Trash2, ThumbsUp } from 'lucide-react'
import type { Article } from '@lumina/shared-types'
import { Skeleton } from '#/components/skeleton'
import { ArticleReactionActions } from './article-reaction-actions'
import { ROUTES } from '@/constants/routes'

interface ArticleCardProps {
  article: Article
  isAuthor?: boolean
  onDelete?: (article: Article) => void
  isDeleting?: boolean
  showReactionActions?: boolean
}

export function ArticleCard({
  article,
  isAuthor,
  onDelete,
  isDeleting,
  showReactionActions = true,
}: ArticleCardProps) {
  return (
    <div className="group relative flex flex-col gap-6 rounded-xl border border-[#EAEAEA] bg-white p-6 transition-all hover:shadow-sm md:flex-row md:items-start">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-3">
          <h2 className="line-clamp-1 text-xl font-serif font-medium text-[#0b2226]">
            <Link
              to={ROUTES.article.detail}
              params={{ id: article.id }}
              className="transition-colors hover:text-[#13383d]"
            >
              {article.title}
            </Link>
          </h2>
          <span className="rounded-md border border-[#EAEAEA] bg-slate-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            {article.category.name}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          {!isAuthor && (
            <>
              <span className="font-medium text-slate-700">
                {article.author.firstName} {article.author.lastName}
              </span>
              <span>•</span>
            </>
          )}
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          {!isAuthor && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {article.likesCount}
              </span>
            </>
          )}
        </div>

        <p className="mb-6 line-clamp-2 text-sm leading-6 text-slate-500">
          {article.description}
        </p>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <Link
            to={ROUTES.article.detail}
            params={{ id: article.id }}
            className="flex items-center gap-2 rounded-md border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <BookOpen className="h-4 w-4" />
            Read
          </Link>

          {isAuthor && (
            <>
              <Link
                to={ROUTES.article.edit}
                params={{ id: article.id }}
                className="flex items-center gap-2 rounded-md border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(article)}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </>
          )}

          {!isAuthor && showReactionActions && (
            <ArticleReactionActions article={article} articleId={article.id} />
          )}
        </div>
      </div>

      <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg border border-[#EAEAEA] bg-[#F7F6F3] md:w-48">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[#EAEAEA] bg-white p-6 md:flex-row md:items-start md:justify-between">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <div className="mt-6 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-40 w-full shrink-0 rounded-lg md:w-48" />
    </div>
  )
}
