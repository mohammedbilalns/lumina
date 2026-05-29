import { BookOpen, Settings, LogOut } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Route } from '../routes/__root'
import { logoutUser } from '../features/authentication/server/auth.functions'
import { authClient } from '../utils/auth-client'
import { ROUTES } from '@/constants/routes'

export function Navbar() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    authClient.clearSession()
    navigate({ to: ROUTES.auth })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#EAEAEA] bg-white">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to={ROUTES.home} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0b2226] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0b2226]">
            Lumina
          </span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              to={ROUTES.dashboard}
              className="hover:text-[#0b2226] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.myArticles}
              className="hover:text-[#0b2226] transition-colors"
            >
              My Articles
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={ROUTES.settings}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-[#0b2226] hover:bg-[#F7F6F3] rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3 pl-2 border-l border-[#EAEAEA]">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-[#0b2226]">{user.firstName}</p>
                  <p className="text-xs text-slate-500 capitalize">Member</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.auth}
                className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-[#0b2226] px-4 py-2 border border-[#EAEAEA] rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.auth}
                className="text-sm font-medium bg-[#0b2226] text-white px-5 py-2 rounded-md hover:bg-[#13383d] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
