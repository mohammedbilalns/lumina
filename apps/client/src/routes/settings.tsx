import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { User, Phone, Mail, Calendar, Lock, Save, Loader2 } from 'lucide-react'
import { Navbar } from '#/components/navbar'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { authClient, callAuthorized } from '@/utils/auth-client'
import { updateProfile, changePassword } from '@/features/profile/server/profile.functions'
import { CategorySelection } from '@/features/preferences/components/category-selection'
import { ConfirmationDialog } from '#/features/articles/components/confirmation-dialog'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { updateProfileSchema, changePasswordSchema } from '#/features/profile/schemas/profile.schema'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: ROUTES.auth })
    }
  },
  component: SettingsPage,
})

export function SettingsPage() {
  const { user, accessToken } = Route.useRouteContext()
  const router = useRouter()
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [pendingPasswordValues, setPendingPasswordValues] = useState<{
    oldPassword: string
    newPassword: string
  } | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      dateOfBirth: user?.dateOfBirth || '',
    },
    validators: {
      onChange: updateProfileSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await callAuthorized(updateProfile, value)
        authClient.setSession({
          user: response.data.user,
          accessToken,
        })
        toast.success('Profile updated successfully')
        await router.invalidate()
      } catch (err: any) {
        toast.error(err.message || 'Failed to update profile')
      }
    },
  })

  const passwordForm = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onChange: changePasswordSchema.extend({
        confirmPassword: z.string()
      }).refine(data => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
      })
    },
    onSubmit: async ({ value }) => {
      setPendingPasswordValues({
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      })
      setShowPasswordConfirm(true)
    },
  })

  const handleConfirmPasswordChange = async () => {
    if (!pendingPasswordValues) {
      return
    }

    setIsChangingPassword(true)

    try {
      await callAuthorized(changePassword, pendingPasswordValues)
      toast.success('Password updated successfully')
      passwordForm.reset()
      setShowPasswordConfirm(false)
      setPendingPasswordValues(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Sync profile form with user context
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth || '',
      })
    }
  }, [user])

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans selection:bg-[#f8cb5b]/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-serif font-medium mb-2 text-[#0b2226]">
            Account Settings
          </h1>
          <p className="text-slate-500">
            Manage your personal information, security, and preferences.
          </p>
        </div>

        <div className="space-y-10">
          {/* Personal Information */}
          <section className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-[#EAEAEA]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-[#0b2226]">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500">
                  Update your basic profile details.
                </p>
              </div>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                profileForm.handleSubmit()
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <profileForm.Field
                  name="firstName"
                  children={(field) => (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-1 transition-all ${field.state.meta.errors.length > 0
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
                            }`}
                        />
                      </div>
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                <profileForm.Field
                  name="lastName"
                  children={(field) => (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-1 transition-all ${field.state.meta.errors.length > 0
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
                            }`}
                        />
                      </div>
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-slate-50 border border-[#EAEAEA] rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      disabled
                      className="w-full bg-slate-50 border border-[#EAEAEA] rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <profileForm.Field
                name="dateOfBirth"
                children={(field) => (
                  <div className="space-y-1.5 sm:w-1/2 sm:pr-3">
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                      <input
                        type="date"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-1 transition-all cursor-pointer ${field.state.meta.errors.length > 0
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
                          }`}
                      />
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <div className="flex justify-end pt-4 border-t border-[#EAEAEA]">
                <profileForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="px-6 py-2.5 bg-[#0b2226] hover:bg-[#13383d] text-white rounded-xl font-medium transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  )}
                />
              </div>
            </form>
          </section>

          {/* Security */}
          <section className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-[#EAEAEA]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-[#0b2226]">Security</h2>
                <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
              </div>
            </div>

            <form
              className="space-y-6 max-w-lg"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                passwordForm.handleSubmit()
              }}
            >
              <passwordForm.Field
                name="oldPassword"
                children={(field) => (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter current password"
                        className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${field.state.meta.errors.length > 0
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
                          }`}
                      />
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <passwordForm.Field
                name="newPassword"
                children={(field) => (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter new password"
                        className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${field.state.meta.errors.length > 0
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
                          }`}
                      />
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <passwordForm.Field
                name="confirmPassword"
                children={(field) => (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${field.state.meta.errors.length > 0
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
                          }`}
                      />
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <div className="pt-4 border-t border-[#EAEAEA]">
                <passwordForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting || isChangingPassword}
                      className="px-6 py-2.5 bg-[#f8cb5b] hover:bg-[#f2c94c] text-[#0b2226] rounded-xl font-medium transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {isSubmitting || isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      Update Password
                    </button>
                  )}
                />
              </div>
            </form>
          </section>

          {/* Preferences */}
          <section className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm">
            <CategorySelection />
          </section>
        </div>
      </main>

      <ConfirmationDialog
        open={showPasswordConfirm}
        title="Update Password"
        description="Update your password now? You will need to use the new password the next time you sign in."
        confirmLabel="Update Password"
        isPending={isChangingPassword}
        onCancel={() => {
          if (!isChangingPassword) {
            setShowPasswordConfirm(false)
            setPendingPasswordValues(null)
          }
        }}
        onConfirm={() => {
          void handleConfirmPasswordChange()
        }}
      />
    </div>
  )
}

function FieldInfo({ field }: { field: any }) {
  const firstError = field.state.meta.errors?.[0]
  const message =
    typeof firstError === 'string'
      ? firstError
      : firstError && typeof firstError === 'object' && 'message' in firstError
        ? String(firstError.message)
        : null

  return (
    <>
      {field.state.meta.isTouched && message ? (
        <p className="mt-1 text-xs text-red-500">{message}</p>
      ) : null}
    </>
  )
}
