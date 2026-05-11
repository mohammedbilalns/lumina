import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/features/authentication/components/login-form'
import { SignupForm } from '@/features/authentication/components/signup-form'
import { OtpForm } from '@/features/authentication/components/otp-form'
import { ForgotPasswordForm } from '@/features/authentication/components/forgot-password-form'
import { ResetPasswordForm } from '@/features/authentication/components/reset-password-form'
import { CategorySelection } from '@/features/preferences/components/category-selection'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AuthComponent,
})

type AuthMode = 'login' | 'signup' | 'otp' | 'interests' | 'forgot-password' | 'reset-password'

function AuthComponent() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [emailForOtp, setEmailForOtp] = useState<string>('')

  const titles = {
    login: 'Welcome back',
    signup: 'Create your account',
    otp: 'Verify your email',
    interests: 'Personalize your feed',
    'forgot-password': 'Reset your password',
    'reset-password': 'Set new password',
  }

  const descriptions = {
    login: 'Enter your details to access your account.',
    signup: 'Join Lumina to discover and share insights.',
    otp: `We've sent a 6-digit code to ${emailForOtp}.`,
    interests: 'Choose the topics that matter most to you.',
    'forgot-password': 'Enter your email to receive a password reset code.',
    'reset-password': `Enter the code sent to ${emailForOtp} and your new password.`,
  }

  const handleSignupSuccess = (email: string) => {
    setEmailForOtp(email)
    setMode('otp')
  }

  const handleForgotPasswordSuccess = (email: string) => {
    setEmailForOtp(email)
    setMode('reset-password')
  }

  const handleOtpSuccess = () => {
    setMode('interests')
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans selection:bg-[#f8cb5b]/30 flex flex-col items-center justify-center p-6">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[#0b2226] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className={`w-full transition-all duration-500 ${mode === 'interests' ? 'max-w-4xl' : 'max-w-md'}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#0b2226] flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-medium text-[#0b2226] mb-2 text-center">
            {titles[mode]}
          </h1>
          <p className="text-slate-500 text-center">
            {descriptions[mode]}
          </p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm p-8">
          {mode === 'login' && (
            <LoginForm 
              onSwitchToSignup={() => setMode('signup')} 
              onForgotPassword={() => setMode('forgot-password')}
            />
          )}
          {mode === 'signup' && (
            <SignupForm 
              onSwitchToLogin={() => setMode('login')} 
              onSuccess={handleSignupSuccess}
            />
          )}
          {mode === 'otp' && (
            <OtpForm 
              email={emailForOtp}
              onSwitchToLogin={() => setMode('login')} 
              onSuccess={handleOtpSuccess}
            />
          )}
          {mode === 'forgot-password' && (
            <ForgotPasswordForm 
              onBackToLogin={() => setMode('login')}
              onSuccess={handleForgotPasswordSuccess}
            />
          )}
          {mode === 'reset-password' && (
            <ResetPasswordForm 
              email={emailForOtp}
              onBackToLogin={() => setMode('login')}
              onSuccess={() => setMode('login')}
            />
          )}
          {mode === 'interests' && (
            <CategorySelection />
          )}
        </div>
      </div>
    </div>
  )
}
