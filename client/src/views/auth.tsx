import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, ArrowLeft } from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans selection:bg-[#f8cb5b]/30 flex flex-col items-center justify-center p-6">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[#0b2226] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#0b2226] flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-medium text-[#0b2226] mb-2 text-center">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-500 text-center">
            {isLogin ? 'Enter your details to access your account.' : 'Join Lumina to discover and share insights.'}
          </p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm p-8">
          <form className="space-y-5" onSubmit={e => e.preventDefault()}>
            
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">First Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Elena"
                      className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rodriguez"
                      className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
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
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[#0b2226] hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
