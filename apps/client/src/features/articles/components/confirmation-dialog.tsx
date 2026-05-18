interface ConfirmationDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  confirmVariant?: 'danger' | 'default'
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) {
    return null
  }

  const confirmClassName =
    confirmVariant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[#0b2226] text-white hover:bg-[#13383d]'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0b2226]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-serif font-medium text-[#0b2226]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md border border-[#EAEAEA] px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${confirmClassName}`}
          >
            {isPending ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
