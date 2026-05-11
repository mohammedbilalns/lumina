import { toast } from 'sonner'
import { useState } from 'react'
import { registerUser } from '../server/auth.functions'
import { useForm } from '@tanstack/react-form'
import { registerSchema } from '../schemas/register.schema'
import { getDefaultDob } from '../utils/get-default-dob'

interface SignupFormProps {
  onSwitchToLogin: () => void
  onSuccess: (email: string) => void
}

export function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dob: getDefaultDob(),
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await registerUser({ data: value })
        toast.success('Verify OTP send to your email!')
        onSuccess(value.email)
      } catch (err: any) {
        const message = err.message || 'An unexpected error occurred'
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
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="firstName"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Elena"
                  className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                  <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
                ) : null}
              </div>
            )}
          />
          <form.Field
            name="lastName"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Rodriguez"
                  className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                  <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
                ) : null}
              </div>
            )}
          />
        </div>

        <form.Field
          name="phone"
          children={(field) => (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="tel"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="dob"
          children={(field) => (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="elena.rodriguez@example.com"
                className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
              ) : null}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Min. 8 chars"
                  className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                  <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
                ) : null}
              </div>
            )}
          />
          <form.Field
            name="confirmPassword"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Confirm</label>
                <input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                  <em role="alert" className="text-xs text-red-500">{field.state.meta.errors[0].message}</em>
                ) : null}
              </div>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-[#0b2226] text-white font-medium py-3 rounded-md hover:bg-[#13383d] transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          )}
        />
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-medium text-[#0b2226] hover:underline"
        >
          Log in
        </button>
      </div>
    </>
  )
}
