import { useState } from 'react'

interface OtpFormProps {
  onSwitchToLogin: () => void
}

export function OtpForm({ onSwitchToLogin }: OtpFormProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request')

  return (
    <>
      <form className="space-y-5" onSubmit={(e) => {
        e.preventDefault()
        if (step === 'request') {
          setStep('verify')
        }
      }}>
        {step === 'request' ? (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Email or Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter email or phone"
              className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Enter Verification Code
            </label>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-center text-2xl tracking-[0.5em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
            />
            <p className="text-xs text-slate-500 pt-2 text-center">
              We sent a code to your email/phone.
            </p>
          </div>
        )}

        <button className="w-full bg-[#0b2226] text-white font-medium py-3 rounded-md hover:bg-[#13383d] transition-colors mt-2">
          {step === 'request' ? 'Send OTP' : 'Verify & Login'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        <button
          onClick={onSwitchToLogin}
          className="font-medium text-[#0b2226] hover:underline"
        >
          Back to Login
        </button>
      </div>
    </>
  )
}
