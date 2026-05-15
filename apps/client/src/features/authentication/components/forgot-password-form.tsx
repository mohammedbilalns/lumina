import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { forgotPasswordSchema } from '../schemas/forgot-password.schema'
import { forgotPassword } from '../server/auth.functions'
import { Loader2, ArrowLeft } from 'lucide-react'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
  onSuccess: (email: string) => void
}

export function ForgotPasswordForm({ onBackToLogin, onSuccess }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await forgotPassword({ data: value })
        toast.success('OTP sent to your email')
        onSuccess(value.email)
      } catch (err: any) {
        const message = err.message || 'Something went wrong'
        setError(message)
        toast.error(message)
      }
    },
  })

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-5"
      >
        <form.Field
          name="email"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-[#0b2226] text-white font-medium py-3.5 rounded-xl hover:bg-[#13383d] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Reset Code
            </button>
          )}
        />

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#0b2226] transition-colors pt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>
      </form>
    </div>
  )
}
