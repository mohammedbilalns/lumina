import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Ban, Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { callAuthorized } from '@/utils/auth-client'
import { Route as RootRoute } from '@/routes/__root'
import { blockArticle, reactToArticle } from '../server/articles.functions'
import { removeArticleFromCaches, updateArticleReactionCaches } from '../utils/article-reaction-cache'
import { ApiError } from '@/types/response'
import type { Article } from '@lumina/shared-types'
import { ConfirmationDialog } from './confirmation-dialog'
import { ROUTES } from '@/constants/routes'

interface ArticleReactionActionsProps {
  article: Pick<Article, 'id' | 'reactionType'>
  articleId: string
  className?: string
}

export function ArticleReactionActions({
  article,
  articleId,
  className,
}: ArticleReactionActionsProps) {
  const [pendingAction, setPendingAction] = useState<'LIKE' | 'BLOCK' | null>(null)
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const { queryClient } = RootRoute.useRouteContext()
  const navigate = useNavigate()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMissingArticle = async () => {
    removeArticleFromCaches(queryClient, articleId, ['preferred'])
    toast.error('This article is no longer available')
    await navigate({ to: ROUTES.dashboard, replace: true })
  }

  const handleLikeToggle = () => {
    const nextReactionType = article.reactionType === 'LIKE' ? null : 'LIKE'
    updateArticleReactionCaches(queryClient, articleId, nextReactionType)
    setPendingAction('LIKE')

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await callAuthorized(reactToArticle, {
          articleId,
          reactionType: 'LIKE',
        })
      } catch (error) {
        updateArticleReactionCaches(queryClient, articleId, article.reactionType)

        if (error instanceof ApiError && error.statusCode === 404) {
          await handleMissingArticle()
          return
        }

        const message = error instanceof Error ? error.message : 'Failed to save reaction'
        toast.error(message)
      } finally {
        setPendingAction(null)
        timeoutRef.current = null
      }
    }, 250)
  }

  const handleBlock = async () => {
    setShowBlockConfirm(false)
    setPendingAction('BLOCK')

    try {
      await callAuthorized(blockArticle, {
        articleId,
      })
      removeArticleFromCaches(queryClient, articleId, ['preferred'])
      toast.success('Article blocked successfully')

      await navigate({ to: ROUTES.dashboard, replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        await handleMissingArticle()
        return
      }

      const message = error instanceof Error ? error.message : 'Failed to block article'
      toast.error(message)
    } finally {
      setPendingAction(null)
    }
  }

  const isPending = pendingAction !== null
  const isLiked = article.reactionType === 'LIKE'

  return (
    <div className={className ?? 'flex flex-wrap items-center gap-2'}>
      <button
        type="button"
        onClick={handleLikeToggle}
        disabled={isPending}
        className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
          isLiked
            ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100'
            : 'border-[#EAEAEA] bg-white text-slate-600 hover:bg-slate-50'
        }`}
      >
        {pendingAction === 'LIKE' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />}
        {isLiked ? 'Liked' : 'Like'}
      </button>
      <button
        type="button"
        onClick={() => setShowBlockConfirm(true)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pendingAction === 'BLOCK' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
        Block
      </button>

      <ConfirmationDialog
        open={showBlockConfirm}
        title="Block Article"
        description="This will remove the article from your feed. You can't undo it from here."
        confirmLabel="Block Article"
        confirmVariant="danger"
        isPending={pendingAction === 'BLOCK'}
        onCancel={() => setShowBlockConfirm(false)}
        onConfirm={handleBlock}
      />
    </div>
  )
}
