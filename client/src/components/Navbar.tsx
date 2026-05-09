import { BookOpen, Search, Settings } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#EAEAEA] bg-white">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0b2226] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0b2226]">
            Lumina
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            to="/dashboard"
            className="hover:text-[#0b2226] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/my-articles"
            className="hover:text-[#0b2226] transition-colors"
          >
            My Articles
          </Link>
        </nav>

        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stories, topics, or writers..."
            className="w-full bg-[#F7F6F3] border border-transparent rounded-full py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#EAEAEA] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/settings"
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-[#0b2226] hover:bg-[#F7F6F3] rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <Link
            to="/auth"
            className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-[#0b2226] px-4 py-2 border border-[#EAEAEA] rounded-md transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="text-sm font-medium bg-[#0b2226] text-white px-5 py-2 rounded-md hover:bg-[#13383d] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
