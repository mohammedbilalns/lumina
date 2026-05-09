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
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 bg-white border border-[#EAEAEA] rounded-md font-sans text-slate-900',
      },
    },
  })

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Type className="w-4 h-4 text-slate-500" /> Article Name
        </label>
        <input
          type="text"
          defaultValue={initialData?.title}
          placeholder="Enter a captivating title..."
          className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all font-serif text-lg"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Layout className="w-4 h-4 text-slate-500" /> Description
        </label>
        <textarea
          defaultValue={initialData?.description}
          placeholder="Write a short summary or description of the article..."
          rows={3}
          className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-500" /> Category
          </label>
          <select
            defaultValue={initialData?.category || ''}
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-4 text-slate-900 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="Psychology">Psychology</option>
            <option value="Self Improvement">Self Improvement</option>
            <option value="Web3">Web3</option>
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" /> Tags
          </label>
          <input
            type="text"
            defaultValue={initialData?.tags}
            placeholder="e.g. React, UI/UX (comma separated)"
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-slate-500" /> Cover Image URL
        </label>
        <div className="flex gap-4">
          <input
            type="url"
            defaultValue={initialData?.imageUrl}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-white border border-[#EAEAEA] rounded-md py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2226] focus:ring-1 focus:ring-[#0b2226] transition-all"
          />
        </div>
      </div>

      {/* Main Content Editor */}
      <div className="space-y-2 pt-4">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
          <Layout className="w-4 h-4 text-slate-500" /> Article Content
        </label>
        <EditorContent editor={editor} />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-8 pb-4">
        <button className="px-6 py-3 bg-[#0b2226] hover:bg-[#13383d] text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {mode === 'create' ? 'Publish Article' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
