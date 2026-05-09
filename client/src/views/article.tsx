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
        class: 'prose prose-slate max-w-none focus:outline-none font-sans',
      },
    },
  })

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#f8cb5b]/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-[#13383d] uppercase tracking-wider">
              Technology
            </span>
            <span className="w-1 h-1 rounded-full bg-[#EAEAEA]"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Web Development
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#0b2226] mb-6 leading-tight">
            The Architecture of Tomorrow's Web
          </h1>
          
          <p className="text-xl text-slate-500 mb-8 leading-relaxed font-serif">
            Exploring how server components and edge computing are reshaping the way we build and deliver user interfaces in the modern era.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-[#EAEAEA] py-6 gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                alt="Elena Rodriguez" 
                className="w-12 h-12 rounded-full object-cover border border-[#EAEAEA]"
              />
              <div>
                <p className="font-semibold text-[#0b2226]">Elena Rodriguez</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Oct 24, 2023</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Interaction Buttons (Like, Dislike, Block) */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-[#EAEAEA] hover:bg-slate-50 text-slate-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">1.2k</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-[#EAEAEA] hover:bg-slate-50 text-slate-600 transition-colors">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-[#EAEAEA] mx-2"></div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Block Author">
                <ShieldAlert className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-400 hover:bg-slate-50 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Article Cover Image */}
        <figure className="mb-16 rounded-xl overflow-hidden border border-[#EAEAEA]">
          <img 
            src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=1200" 
            alt="Article Cover" 
            className="w-full h-auto object-cover aspect-[21/9]"
          />
        </figure>

        {/* Tiptap Editor Content */}
        <div className="text-lg leading-relaxed text-[#111111]">
          <EditorContent editor={editor} />
        </div>

      </main>
    </div>
  )
}
