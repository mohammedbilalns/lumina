import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { resetPasswordFormSchema } from '../schemas/forgot-password.schema'
import { resetPassword, resendForgotPasswordOtp } from '../server/auth.functions'
import { Loader2, ArrowLeft } from 'lucide-react'

interface ResetPasswordFormProps {
  email: string
  onBackToLogin: () => void
  onSuccess: () => void
}

export function ResetPasswordForm({ email, onBackToLogin, onSuccess }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer])

  const form = useForm({
    defaultValues: {
      email,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const { confirmPassword, ...submitData } = value
        await resetPassword({ data: submitData })
        toast.success('Password reset successful')
        onSuccess()
      } catch (err: any) {
        const message = err.message || 'Something went wrong'
        setError(message)
        toast.error(message)
      }
    },
  })

  const handleResend = async () => {
    if (!canResend) return
    setIsResending(true)
    try {
      await resendForgotPasswordOtp({ data: { email } })
      toast.success('New OTP sent to your email')
      setTimer(60)
      setCanResend(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

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
        className="space-y-4"
      >
        <form.Field
          name="otp"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Reset Code
              </label>
              <input
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl py-3 px-4 text-center text-2xl tracking-[0.2em] font-mono text-[#0b2226] focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
            </div>
          )}
        />

        <form.Field
          name="newPassword"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
              {field.state.meta.errors[0] && (
                <p className="text-xs text-red-500">{field.state.meta.errors[0].message}</p>
              )}
            </div>
          )}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
            </div>
          )}
        />

        <div className="flex justify-center text-sm py-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#0b2226] font-medium hover:underline"
            >
              {isResending ? 'Resending...' : "Didn't receive code? Resend"}
            </button>
          ) : (
            <p className="text-slate-500">Resend code in <span className="text-[#0b2226] font-medium">{timer}s</span></p>
          )}
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-[#0b2226] text-white font-medium py-3.5 rounded-xl hover:bg-[#13383d] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Reset Password
            </button>
          )}
        />

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#0b2226] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>
      </form>
    </div>
  )
}
