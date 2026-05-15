import { Skeleton } from './skeleton'

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <main className="w-full max-w-4xl">
          <div className="mb-10">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-10 w-64" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-full sm:w-64 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-5 w-full max-w-md mt-2" />
          </div>

          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col-reverse gap-8 rounded-xl border border-[#EAEAEA] p-6 sm:flex-row">
                <div className="flex flex-1 flex-col">
                  <Skeleton className="mb-3 h-4 w-24" />
                  <Skeleton className="mb-3 h-8 w-full" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-6 h-4 w-3/4" />
                  <div className="mt-auto flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-48 w-full shrink-0 rounded-lg sm:h-40 sm:w-56" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export function ArticleDetailSkeleton() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <Skeleton className="mb-8 h-5 w-40" />
          
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="mb-6 h-12 w-full" />
          <Skeleton className="mb-4 h-12 w-3/4" />

          <Skeleton className="mb-8 h-6 w-full" />

          <div className="flex flex-col justify-between gap-6 border-y border-[#EAEAEA] py-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-10" />
            </div>
          </div>
        </header>

        <Skeleton className="mb-16 aspect-video w-full rounded-xl" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </main>
  )
}
