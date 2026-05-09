
import { ArrowRight, BookOpen, Compass, PenTool, Sparkles } from 'lucide-react'

export function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Lumina</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <a href="#" className="hover:text-white transition-colors">Discover</a>
                        <a href="#" className="hover:text-white transition-colors">Trending</a>
                        <a href="#" className="hover:text-white transition-colors">Topics</a>
                        <a href="#" className="hover:text-white transition-colors">Writers</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</button>
                        <button className="text-sm font-medium bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Get Started</button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>Introducing the new reading experience</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
                            Where ideas <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">illuminate</span> the future.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Discover stories, thinking, and expertise from writers on any topic. A modern space for readers and creators to connect through profound ideas.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/25">
                                Start Reading
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
                                <PenTool className="w-4 h-4" />
                                Start Writing
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="py-24 bg-slate-900/50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Compass className="w-8 h-8 text-indigo-400" />
                            Trending on Lumina
                        </h2>
                        <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group">
                            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Article Card 1 */}
                        <article className="group relative bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-colors shadow-xl">
                            <div className="aspect-[16/9] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=800" alt="Article Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Author" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-200">Elena Rodriguez</p>
                                        <p className="text-slate-500">Oct 24 • 5 min read</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                    The Architecture of Tomorrow's Web
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-2">
                                    Exploring how server components and edge computing are reshaping the way we build and deliver user interfaces in the modern era.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/20">Engineering</span>
                                    <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded-full border border-white/10">Web3</span>
                                </div>
                            </div>
                        </article>

                        {/* Article Card 2 */}
                        <article className="group relative bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-colors shadow-xl">
                            <div className="aspect-[16/9] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800" alt="Article Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="Author" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-200">Marcus Chen</p>
                                        <p className="text-slate-500">Oct 22 • 8 min read</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                                    Minimalism in Digital Design
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-2">
                                    Why subtracting the obvious and adding the meaningful leads to products that people genuinely love using every day.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-medium rounded-full border border-purple-500/20">Design</span>
                                    <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded-full border border-white/10">UX</span>
                                </div>
                            </div>
                        </article>

                        {/* Article Card 3 */}
                        <article className="group relative bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors shadow-xl sm:hidden lg:block">
                            <div className="aspect-[16/9] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" alt="Article Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Author" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-200">Sarah Jenkins</p>
                                        <p className="text-slate-500">Oct 20 • 12 min read</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    The Neuroscience of Habit
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-2">
                                    A deep dive into how our brains wire routines and how we can effectively reprogram our daily behaviors for success.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs font-medium rounded-full border border-blue-500/20">Psychology</span>
                                    <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded-full border border-white/10">Science</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-slate-950 py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-slate-400">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-slate-200">Lumina</span>
                            <span>© {new Date().getFullYear()}</span>
                        </div>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">About</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>)
}