
interface SignupFormProps {
  onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  return (
    <>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="e.g. Elena"
              className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rodriguez"
              className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="elena.rodriguez@example.com"
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
          Create Account
        </button>
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
