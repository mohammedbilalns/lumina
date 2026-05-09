import { Navbar } from '#/components/Navbar'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ThumbsUp, ThumbsDown, ShieldAlert, MoreHorizontal } from 'lucide-react'

// Dummy article content
const ARTICLE_CONTENT = `
<h2>The Shift in Modern Web Architecture</h2>
<p>Over the past few years, we've witnessed a massive shift in how web applications are built. The pendulum has swung from heavily client-side rendered Single Page Applications (SPAs) back to server-rendered HTML, but with a twist.</p>
<p>With frameworks introducing Server Components, we now have the ability to render components on the server while maintaining the rich interactivity of client-side React. This hybrid approach promises the best of both worlds: fast initial page loads, excellent SEO, and a snappy user experience.</p>
<h3>Why Server Components?</h3>
<ul>
  <li><strong>Reduced Bundle Size:</strong> Heavy dependencies can stay on the server.</li>
  <li><strong>Direct Backend Access:</strong> Query databases directly from your components securely.</li>
  <li><strong>Better Performance:</strong> Less JavaScript for the browser to parse and execute.</li>
</ul>
<blockquote><p>"The future of web development is a seamless blend of server capabilities and client interactivity."</p></blockquote>
<p>As we continue to build more complex applications, understanding these architectural shifts becomes crucial for delivering optimal user experiences.</p>
`

export function ArticlePage() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: ARTICLE_CONTENT,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-indigo max-w-none focus:outline-none',
      },
    },
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/20">
              Technology
            </span>
            <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded-full border border-white/10">
              Web Development
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
            The Architecture of Tomorrow's Web
          </h1>

          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            Exploring how server components and edge computing are reshaping the
            way we build and deliver user interfaces in the modern era.
          </p>

          <div className="flex items-center justify-between border-t border-b border-white/10 py-6 mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Elena Rodriguez"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-200">Elena Rodriguez</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>Oct 24, 2023</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Interaction Buttons (Like, Dislike, Block) */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors border border-indigo-500/20">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">1.2k</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1"></div>
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                title="Block Author"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  Block
                </span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Article Cover Image */}
        <figure className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=1200"
            alt="Article Cover"
            className="w-full h-auto object-cover aspect-[21/9]"
          />
        </figure>

        {/* Tiptap Editor Content */}
        <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 sm:p-10 shadow-xl">
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  )
}
