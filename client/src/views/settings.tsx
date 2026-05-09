import { User, Phone, Mail, Calendar, Lock, Save, Tag } from 'lucide-react'
import { Navbar } from '#/components/Navbar'

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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-slate-400">
            Manage your personal information, security, and preferences.
          </p>
        </div>

        <div className="space-y-10">
          {/* Personal Information */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Personal Information</h2>
                <p className="text-sm text-slate-400">
                  Update your basic profile details.
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      defaultValue="+1 (555) 000-0000"
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:w-1/2 sm:pr-3">
                <label className="text-sm font-medium text-slate-300">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
                  <input
                    type="date"
                    defaultValue="1995-08-15"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Security */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Security</h2>
                <p className="text-sm text-slate-400">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>

            <form
              className="space-y-6 max-w-lg"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Preferences */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Article Preferences</h2>
                <p className="text-sm text-slate-400">
                  Select the topics you're most interested in to personalize
                  your feed.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {ALL_INTERESTS.map((interest, i) => {
                const isSelected = i % 3 === 0 || i === 1 || i === 4
                return (
                  <button
                    key={interest}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end pt-8">
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
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
