import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/features/authentication/components/login-form'
import { SignupForm } from '@/features/authentication/components/signup-form'
import { OtpForm } from '@/features/authentication/components/otp-form'

type AuthMode = 'login' | 'signup' | 'otp'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')

  const titles = {
    login: 'Welcome back',
    signup: 'Create your account',
    otp: 'Login with OTP',
  }

  const descriptions = {
    login: 'Enter your details to access your account.',
    signup: 'Join Lumina to discover and share insights.',
    otp: 'Enter your email or phone number to receive a verification code.',
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

      <div className="w-full max-w-md">
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
              onSwitchToOtp={() => setMode('otp')} 
            />
          )}
          {mode === 'signup' && (
            <SignupForm 
              onSwitchToLogin={() => setMode('login')} 
            />
          )}
          {mode === 'otp' && (
            <OtpForm 
              onSwitchToLogin={() => setMode('login')} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
