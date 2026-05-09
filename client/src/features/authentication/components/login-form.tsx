
interface LoginFormProps {
  onSwitchToSignup: () => void
  onSwitchToOtp: () => void
}

export function LoginForm({ onSwitchToSignup, onSwitchToOtp }: LoginFormProps) {
  return (
    <>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Min. 8 characters"
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
          />
        </div>

        <button className="w-full bg-[#0b2226] text-white font-medium py-3 rounded-md hover:bg-[#13383d] transition-colors mt-2">
          Sign In
        </button>

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-[#EAEAEA]"></div>
          <span className="shrink-0 mx-4 text-slate-400 text-sm">or</span>
          <div className="grow border-t border-[#EAEAEA]"></div>
        </div>

        <button
          type="button"
          onClick={onSwitchToOtp}
          className="w-full bg-white border border-[#EAEAEA] text-[#0b2226] font-medium py-3 rounded-md hover:bg-slate-50 transition-colors"
        >
          Login with OTP
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="font-medium text-[#0b2226] hover:underline"
        >
          Sign up
        </button>
      </div>
    </>
  )
}
