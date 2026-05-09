import { ArrowRight, Compass } from 'lucide-react'
import { Navbar } from '#/components/Navbar'
import { Link } from '@tanstack/react-router'

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#f8cb5b]/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-16 pb-32 max-w-6xl">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-8 text-slate-500">
          <Compass className="w-5 h-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">
            Featured Guides
          </span>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-[#13383d] rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-sm flex items-center min-h-[360px]">
          {/* Subtle Background Pattern / Graphics */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 md:opacity-100 pointer-events-none flex justify-end">
            {/* Mocking the compass graphic from Nova with CSS shapes */}
            <div className="relative w-96 h-full flex items-center justify-center">
              <div className="absolute w-64 h-64 border-4 border-emerald-400/30 rounded-full"></div>
              <div className="absolute w-48 h-48 border-[12px] border-[#0b2226] rounded-full"></div>
              <div className="absolute w-2 h-32 bg-emerald-400 rotate-45 transform origin-center"></div>
              <div className="absolute w-2 h-32 bg-white -rotate-[135deg] transform origin-center"></div>
              <div className="w-8 h-8 rounded-full bg-[#f8cb5b] z-10 shadow-lg"></div>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight mb-4 leading-tight">
              Looking for top-tier reading resources?
            </h1>
            <p className="text-lg text-emerald-50/70 mb-10">
              Download insightful guides written from an expert's perspective.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-[#13383d] font-medium px-6 py-3 rounded-md hover:bg-slate-100 transition-colors"
            >
              Explore <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Minimal Article Grid */}
        <div className="mt-24">
          <h2 className="text-2xl font-serif font-medium text-[#0b2226] mb-8">
            Latest Publications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <article key={item} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-[#EAEAEA]">
                  <img
                    src={`https://images.unsplash.com/photo-${item === 1 ? '1618005182384-a83a8bd57fbe' : item === 2 ? '1550745165-9bc0b252726f' : '1484480974693-6ca0a78fb36b'}?auto=format&fit=crop&q=80&w=800`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Cover"
                  />
                </div>
                <span className="text-xs font-semibold text-[#13383d] tracking-wide uppercase">
                  Design
                </span>
                <h3 className="text-lg font-serif font-medium mt-2 mb-2 text-[#0b2226] group-hover:text-[#13383d] transition-colors leading-snug">
                  The Psychology of Minimalist Interfaces
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  Understanding why stripping away the obvious adds so much
                  meaning to user experience and daily tools.
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b2226] text-white py-20 border-t border-[#0b2226]">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Subscribe Section */}
          <div className="max-w-md">
            <h2 className="text-3xl font-serif font-medium mb-4">
              Subscribe to Lumina Dispatch
            </h2>
            <p className="text-slate-400 mb-8">
              A weekly digest of latest news, articles and resources
            </p>

            <form
              className="flex gap-4 mb-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 bg-white border border-transparent rounded-md py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f8cb5b]"
              />
              <button className="bg-[#f8cb5b] text-[#0b2226] font-semibold px-6 py-3 rounded-md hover:bg-[#f2c94c] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>

            <p className="text-xs text-slate-500 leading-relaxed">
              By continuing, you agree to Lumina's{' '}
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Terms of Use
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-12">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500/30 border border-indigo-400"></span>
                Topics
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Technology
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Design
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Psychology
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Science
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400"></span>
                Platform
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Writers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Readers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-400"></span>
                Company
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
