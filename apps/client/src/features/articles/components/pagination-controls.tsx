import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationMeta } from '../services/articles.service'

interface PaginationControlsProps {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  const { page, totalPages, total } = pagination

  if (total === 0) {
    return null
  }

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-[#EAEAEA] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {Math.max(totalPages, 1)}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-2 rounded-lg border border-[#EAEAEA] px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-2 rounded-lg border border-[#EAEAEA] px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
