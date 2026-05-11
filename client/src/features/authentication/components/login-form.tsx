import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { loginSchema } from '../schemas/login.schema'
import { loginUser } from '../server/auth.functions'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/utils/auth-client'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onForgotPassword?: () => void
}

export function LoginForm({ onSwitchToSignup, onForgotPassword }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      credential: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const response = await loginUser({ data: value })
        authClient.setAccessToken(response.data.accessToken)
        toast.success('Signed in successfully')
        
        setTimeout(() => {
          navigate({ to: '/dashboard', replace: true })
        }, 50)
      } catch (err: any) {
        const message = err.message || 'Invalid credentials'
        setError(message)
        toast.error(message)
      }
    },
  })

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
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
          name="credential"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email or Username
              </label>
              <input
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
            </div>
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-medium text-[#0b2226] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
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
              Sign In
            </button>
          )}
        />


        <p className="text-center text-sm text-slate-500 pt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold text-[#0b2226] hover:underline"
          >
            Sign up for free
          </button>
        </p>
      </form>
    </>
  )
}
