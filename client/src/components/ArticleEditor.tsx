import { Image as ImageIcon, Tag, Hash, Layout, Type, Save } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface ArticleEditorProps {
  mode: 'create' | 'edit'
  initialData?: {
    title: string
    description: string
    content: string
    imageUrl: string
    category: string
    tags: string
  }
}

export function ArticleEditor({ mode, initialData }: ArticleEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || '<p>Start writing your story here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-indigo max-w-none focus:outline-none min-h-[300px] p-4 bg-white/5 border border-white/10 rounded-xl',
      },
    },
  })

  return (
    <form className="space-y-8" onSubmit={e => e.preventDefault()}>
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-400" /> Article Name
        </label>
        <input 
          type="text" 
          defaultValue={initialData?.title}
          placeholder="Enter a captivating title..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium text-lg"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-400" /> Description
        </label>
        <textarea 
          defaultValue={initialData?.description}
          placeholder="Write a short summary or description of the article..."
          rows={3}
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-400" /> Category
          </label>
          <select 
            defaultValue={initialData?.category || ""}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
          >
            <option value="" disabled>Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="Psychology">Psychology</option>
            <option value="Self Improvement">Self Improvement</option>
            <option value="Web3">Web3</option>
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-400" /> Tags
          </label>
          <input 
            type="text" 
            defaultValue={initialData?.tags}
            placeholder="e.g. React, UI/UX, Productivity (comma separated)"
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" /> Cover Image URL
        </label>
        <div className="flex gap-4">
          <input 
            type="url" 
            defaultValue={initialData?.imageUrl}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Main Content Editor */}
      <div className="space-y-2 pt-4">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
          <Layout className="w-4 h-4 text-indigo-400" /> Article Content
        </label>
        <EditorContent editor={editor} />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-8 pb-4">
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {mode === 'create' ? 'Publish Article' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
