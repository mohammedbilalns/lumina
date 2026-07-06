import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { verifySignupOtp, resendSignupOtp } from '../server/auth.functions'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/utils/auth-client'
import { ROUTES } from '@/constants/routes'

interface OtpFormProps {
  email: string
  onSwitchToLogin: () => void
  onSuccess?: () => void
}

export function OtpForm({ email, onSwitchToLogin, onSuccess }: OtpFormProps) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const navigate = useNavigate()

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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    setError(null)
    setIsVerifying(true)
    try {
      const response = await verifySignupOtp({ data: { email, otp } })
      authClient.setSession({
        user: response.data.user,
        accessToken: response.data.accessToken,
        authMode: 'authenticated',
      })
      toast.success('Verification successful!')
      
      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => {
          navigate({ to: ROUTES.dashboard, replace: true })
        }, 50)
      }
    } catch (err: any) {
      const message = err.message || 'Invalid verification code'
      setError(message)
      toast.error(message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setError(null)
    setIsResending(true)
    try {
      await resendSignupOtp({ data: { email } })
      toast.success('Code resent to your email')
      setTimer(60)
      setCanResend(false)
    } catch (err: any) {
      const message = err.message || 'Failed to resend OTP'
      setError(message)
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleVerify}>
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 block text-center">
            Verification Code
          </label>
          <div className="flex justify-center">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full max-w-50 bg-white border border-[#EAEAEA] rounded-md py-3 px-3 text-center text-3xl tracking-[0.2em] font-mono text-[#0b2226] placeholder:text-slate-200 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
            />
          </div>
          <p className="text-xs text-slate-500 text-center">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <button 
          type="submit"
          disabled={otp.length !== 6 || isVerifying}
          className="w-full bg-[#0b2226] text-white font-medium py-3 rounded-md hover:bg-[#13383d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </button>
      </form>

      <div className="mt-8 space-y-4 text-center">
        <div className="text-sm">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-[#0b2226] font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? 'Resending...' : "Didn't receive a code? Resend"}
            </button>
          ) : (
            <p className="text-slate-500">
              Resend code in <span className="font-medium text-[#0b2226]">{timer}s</span>
            </p>
          )}
        </div>

        <button
          onClick={onSwitchToLogin}
          className="text-sm font-medium text-slate-500 hover:text-[#0b2226] transition-colors"
        >
          Back to Login
        </button>
      </div>
    </>
  )
}
