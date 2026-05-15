import { createFileRoute, redirect } from '@tanstack/react-router'
import { User, Phone, Mail, Calendar, Lock, Save, Tag } from 'lucide-react'
import { Navbar } from '#/components/navbar'



export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth' })
    }
  },
  component: SettingsPage,
})


const ALL_INTERESTS = [
  'Technology',
  'Design',
  'Psychology',
  'Self Improvement',
  'Web3',
  'Engineering',
  'Science',
  'Productivity',
  'Marketing',
  'Business',
]

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans selection:bg-[#f8cb5b]/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-medium mb-2 text-[#0b2226]">
            Account Settings
          </h1>
          <p className="text-slate-500">
            Manage your personal information, security, and preferences.
          </p>
        </div>

        <div className="space-y-10">
          {/* Personal Information */}
          <section className="bg-white border border-[#EAEAEA] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-[#EAEAEA]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-[#0b2226]">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500">
                  Update your basic profile details.
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      disabled
                      className="w-full bg-slate-50 border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-500 placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      defaultValue="+1 (555) 000-0000"
                      disabled
                      className="w-full bg-slate-50 border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-500 placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:w-1/2 sm:pr-3">
                <label className="text-sm font-medium text-slate-700">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    defaultValue="1995-08-15"
                    className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#EAEAEA]">
                <button className="px-6 py-2.5 bg-[#0b2226] hover:bg-[#13383d] text-white rounded-md font-medium transition-colors flex items-center gap-2 text-sm">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Security */}
          <section className="bg-white border border-[#EAEAEA] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-[#EAEAEA]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-[#0b2226]">
                  Security
                </h2>
                <p className="text-sm text-slate-500">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>

            <form
              className="space-y-6 max-w-lg"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA]">
                <button className="px-6 py-2.5 bg-[#f8cb5b] hover:bg-[#f2c94c] text-[#0b2226] rounded-md font-medium transition-colors flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Preferences */}
          <section className="bg-white border border-[#EAEAEA] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-[#EAEAEA]">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-[#0b2226]">
                  Article Preferences
                </h2>
                <p className="text-sm text-slate-500">
                  Select the topics you're most interested in to personalize
                  your feed.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {ALL_INTERESTS.map((interest, i) => {
                const isSelected = i % 3 === 0 || i === 1 || i === 4
                return (
                  <button
                    key={interest}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      isSelected
                        ? 'bg-[#0b2226] text-white border-[#0b2226]'
                        : 'bg-white text-slate-600 border-[#EAEAEA] hover:bg-slate-50'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end pt-8 mt-8 border-t border-[#EAEAEA]">
              <button className="px-6 py-2.5 bg-[#0b2226] hover:bg-[#13383d] text-white rounded-md font-medium transition-colors flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
