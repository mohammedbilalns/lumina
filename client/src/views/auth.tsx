import { useState } from 'react'
import { BookOpen, Mail, Lock, User, Phone, Calendar } from 'lucide-react'

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Card */}
            <div className="w-full max-w-md relative z-10 my-8">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Lumina</span>
                    </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {isLogin
                                ? 'Enter your details to access your account'
                                : 'Join us to start reading and writing stories'}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {!isLogin && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-300">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="John"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-300">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
                                        <input
                                            type="date"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                {isLogin && (
                                    <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-xl font-medium transition-opacity mt-6 shadow-lg shadow-indigo-500/25"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
