import { Await, Link, createFileRoute, defer, redirect, useRouteContext } from '@tanstack/react-router'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ArrowLeft, Edit2, MoreHorizontal, ThumbsUp } from 'lucide-react'
import { Suspense } from 'react'
import { Navbar } from '#/components/navbar'
import { ArticleDetailSkeleton } from '#/components/page-skeletons'
import { getArticle } from '#/features/articles/server/articles.functions'

export const Route = createFileRoute('/article/$id/')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  loader: async ({ params, context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/auth' })
    }

    const articlePromise = getArticle({
      data: {
        articleId: params.id,
        accessToken: context.accessToken,
      },
    })

    return {
      articleData: defer(articlePromise),
    }
  },
  component: ArticleDetailedComponent,
})

function ArticleDetailedComponent() {
  const { articleData } = Route.useLoaderData()
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-[#111111] selection:bg-[#f8cb5b]/30">
      <Navbar />
      <Suspense fallback={<ArticleDetailSkeleton />}>
        <Await promise={articleData}>
          {({ data: { article } }) => <ArticleContent article={article} user={user} />}
        </Await>
      </Suspense>
    </div>
  )
}

function ArticleContent({ article, user }: { article: any; user: any }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: article.content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none font-sans',
      },
    },
  })

  const isAuthor = user?.id === article.author.id

  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <div className="mb-8">
          <Link
            to={isAuthor ? '/my-articles' : '/dashboard'}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#0b2226]"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAuthor ? 'Back to My Articles' : 'Back to Dashboard'}
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#13383d]">
            {article.category.name}
          </span>
          {isAuthor && (
            <Link
              to="/article/$id/edit"
              params={{ id: article.id }}
              className="flex items-center gap-1.5 rounded-md border border-[#EAEAEA] px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Link>
          )}
        </div>

        <h1 className="mb-6 text-4xl leading-tight font-serif font-medium text-[#0b2226] md:text-5xl">
          {article.title}
        </h1>

        <p className="mb-8 text-xl leading-relaxed font-serif text-slate-500">
          {article.description}
        </p>

        <div className="flex flex-col justify-between gap-6 border-y border-[#EAEAEA] py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EAEAEA] bg-[#F7F6F3] text-sm font-semibold text-[#0b2226]">
              {article.author.firstName.charAt(0)}
              {article.author.lastName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#0b2226]">
                {article.author.firstName} {article.author.lastName}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-[#EAEAEA] bg-white px-3 py-2 text-slate-600">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">{article.likesCount}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-3 py-2 text-slate-400">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      {article.featuredImage ? (
        <figure className="mb-16 overflow-hidden rounded-xl border border-[#EAEAEA]">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="aspect-video h-auto w-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent) parent.style.display = 'none'
            }}
          />
        </figure>
      ) : null}

      <div className="text-lg leading-relaxed text-[#111111]">
        <EditorContent editor={editor} />
      </div>
    </main>
  )
}
