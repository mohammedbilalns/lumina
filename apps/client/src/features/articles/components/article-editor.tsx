import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Bold,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Hash,
  Layout,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Save,
  Type,
  Undo2,
  X,
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { Category } from '@/features/preferences/services/preferences.service'
import { createPresignedUploadUrl } from '@/features/uploads/server/uploads.functions'
import { uploadsService } from '@/features/uploads/services/uploads.service'
import { callAuthorized } from '@/utils/auth-client'
import { toast } from 'sonner'
import type { ZodIssue } from 'zod'
import { createArticleSchema } from '../schemas/articles.schema'

interface ArticleEditorProps {
  mode: 'create' | 'edit'
  initialData?: {
    title: string
    content: string
    featuredImage: string
    categoryId: string
  }
  categories: Category[]
  isSubmitting?: boolean
  onSubmit: (data: {
    title: string
    content: string
    featuredImage: string
    categoryId: string
  }) => Promise<void> | void
}

const COVER_PREVIEW_WIDTH = 1600
const COVER_PREVIEW_HEIGHT = 900
const CROP_ASPECT_RATIO = COVER_PREVIEW_WIDTH / COVER_PREVIEW_HEIGHT // 16:9
const MIN_CROP_PERCENT = 10

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

interface DragState {
  mode: 'move' | 'resize'
  handle?: 'nw' | 'ne' | 'sw' | 'se'
  startX: number
  startY: number
  initialRect: CropRect
}

const articleEditorSchema = createArticleSchema.omit({ accessToken: true })

type ArticleEditorErrors = Partial<Record<'title' | 'content' | 'categoryId', string>>

const getFieldErrors = (issues: ZodIssue[]) =>
  issues.reduce<ArticleEditorErrors>((accumulator, issue) => {
    const fieldName = issue.path[0]

    if (fieldName === 'title' || fieldName === 'content' || fieldName === 'categoryId') {
      accumulator[fieldName] = issue.message
    }

    return accumulator
  }, {})

export function ArticleEditor({
  mode,
  initialData,
  categories,
  isSubmitting = false,
  onSubmit,
}: ArticleEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cropAreaRef = useRef<HTMLDivElement | null>(null)
  const cropImageRef = useRef<HTMLImageElement | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [pendingImageSize, setPendingImageSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const [cropRect, setCropRect] = useState<CropRect>({
    x: 15,
    y: 15,
    width: 70,
    height: 70 / CROP_ASPECT_RATIO, // enforced 16:9
  })
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ArticleEditorErrors>({})

  useEffect(() => {
    setTitle(initialData?.title ?? '')
    setFeaturedImage(initialData?.featuredImage ?? '')
    setCategoryId(initialData?.categoryId ?? '')
    setContent(initialData?.content ?? '')
    setFieldErrors({})
  }, [initialData])

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getHTML())
      setFieldErrors((current) =>
        current.content ? { ...current, content: undefined } : current,
      )
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 bg-white border border-[#EAEAEA] rounded-md font-sans text-slate-900',
      },
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false)
    }
  }, [content, editor])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      title,
      content: editor?.getHTML() ?? content,
      featuredImage,
      categoryId,
    }

    const validationResult = articleEditorSchema.safeParse(payload)

    if (!validationResult.success) {
      const nextFieldErrors = getFieldErrors(validationResult.error.issues)
      setFieldErrors(nextFieldErrors)
      toast.error(validationResult.error.issues[0]?.message ?? 'Please fix the highlighted fields')
      return
    }

    setFieldErrors({})
    await onSubmit(validationResult.data)
  }

  const resetCropState = () => {
    setPendingImageSrc(null)
    setPendingImageFile(null)
    setPendingImageSize(null)
    setCropRect({
      x: 15,
      y: 15,
      width: 70,
      height: 70 / CROP_ASPECT_RATIO,
    })
    setDragState(null)
  }

  const removeImage = () => {
    setFeaturedImage('')
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl)
    }
    setLocalPreviewUrl(null)
  }

  const uploadImageFile = async (file: File, blobUrl: string) => {
    setIsUploadingImage(true)

    // Show local preview immediately while uploading
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl)
    }
    setLocalPreviewUrl(blobUrl)

    try {
      const response = await callAuthorized(createPresignedUploadUrl, {
        contentType: file.type,
        fileName: file.name,
      })

      await uploadsService.uploadFileToPresignedUrl(
        response.data.uploadUrl,
        file,
        response.data.contentType,
      )

      setFeaturedImage(response.data.fileUrl)
      toast.success('Cover image uploaded')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image'
      toast.error(message)
      // Revert preview on failure
      URL.revokeObjectURL(blobUrl)
      setLocalPreviewUrl(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setPendingImageSrc(typeof reader.result === 'string' ? reader.result : null)
      setPendingImageFile(file)
      setCropRect({
        x: 15,
        y: 15,
        width: 70,
        height: 70 / CROP_ASPECT_RATIO,
      })
    }

    reader.onerror = () => {
      toast.error('Failed to load image')
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleCropConfirm = async () => {
    if (!pendingImageSrc || !pendingImageFile || !pendingImageSize) {
      return
    }

    const image = new Image()
    image.src = pendingImageSrc

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Failed to process image'))
    })

    const canvas = document.createElement('canvas')
    canvas.width = COVER_PREVIEW_WIDTH
    canvas.height = COVER_PREVIEW_HEIGHT

    const context = canvas.getContext('2d')

    if (!context) {
      toast.error('Failed to initialize image cropper')
      return
    }

    const sourceX = (cropRect.x / 100) * pendingImageSize.width
    const sourceY = (cropRect.y / 100) * pendingImageSize.height
    const sourceWidth = (cropRect.width / 100) * pendingImageSize.width
    const sourceHeight = (cropRect.height / 100) * pendingImageSize.height

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((createdBlob) => resolve(createdBlob), 'image/jpeg', 0.92)
    })

    if (!blob) {
      toast.error('Failed to crop image')
      return
    }

    const croppedFile = new File(
      [blob],
      pendingImageFile.name.replace(/\.[^.]+$/, '') + '.jpg',
      { type: 'image/jpeg' },
    )

    // Create a local blob URL for the preview before resetting crop state
    const blobUrl = URL.createObjectURL(blob)

    resetCropState()
    await uploadImageFile(croppedFile, blobUrl)
  }

  useEffect(() => {
    if (!dragState) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const imageElement = cropImageRef.current

      if (!imageElement) {
        return
      }

      const rect = imageElement.getBoundingClientRect()
      const deltaXPercent = ((event.clientX - dragState.startX) / rect.width) * 100
      const deltaYPercent = ((event.clientY - dragState.startY) / rect.height) * 100

      setCropRect(() => {
        const nextRect = { ...dragState.initialRect }

        const imageEl = cropImageRef.current
        const renderedAspect = imageEl
          ? imageEl.clientWidth / imageEl.clientHeight
          : 1
        const cropRatioInPct = CROP_ASPECT_RATIO / renderedAspect

        const deriveHeight = (width: number) => width / cropRatioInPct
        const deriveWidth = (height: number) => height * cropRatioInPct

        if (dragState.mode === 'move') {
          nextRect.x = Math.min(
            Math.max(0, dragState.initialRect.x + deltaXPercent),
            100 - dragState.initialRect.width,
          )
          nextRect.y = Math.min(
            Math.max(0, dragState.initialRect.y + deltaYPercent),
            100 - dragState.initialRect.height,
          )
          return nextRect
        }

        if (dragState.handle === 'se') {
          // Lead with horizontal delta; derive height from width
          const rawWidth = dragState.initialRect.width + deltaXPercent
          nextRect.width = Math.min(
            100 - dragState.initialRect.x,
            Math.max(MIN_CROP_PERCENT, rawWidth),
          )
          nextRect.height = Math.min(
            100 - dragState.initialRect.y,
            deriveHeight(nextRect.width),
          )
          // Re-clamp width if height was clamped
          nextRect.width = deriveWidth(nextRect.height)
        }

        if (dragState.handle === 'sw') {
          // Lead with horizontal delta on left edge
          const rawX = Math.max(0, dragState.initialRect.x + deltaXPercent)
          const maxX = dragState.initialRect.x + dragState.initialRect.width - MIN_CROP_PERCENT
          nextRect.x = Math.min(maxX, rawX)
          nextRect.width = dragState.initialRect.width + (dragState.initialRect.x - nextRect.x)
          nextRect.height = Math.min(
            100 - dragState.initialRect.y,
            deriveHeight(nextRect.width),
          )
          nextRect.width = deriveWidth(nextRect.height)
        }

        if (dragState.handle === 'ne') {
          // Lead with horizontal delta on right edge; height grows upward
          const rawWidth = dragState.initialRect.width + deltaXPercent
          nextRect.width = Math.min(
            100 - dragState.initialRect.x,
            Math.max(MIN_CROP_PERCENT, rawWidth),
          )
          nextRect.height = deriveHeight(nextRect.width)
          // Adjust y upward
          nextRect.y = Math.max(
            0,
            dragState.initialRect.y + dragState.initialRect.height - nextRect.height,
          )
          // Re-derive in case y was clamped
          nextRect.height = dragState.initialRect.height + (dragState.initialRect.y - nextRect.y)
          nextRect.width = deriveWidth(nextRect.height)
        }

        if (dragState.handle === 'nw') {
          // Lead with horizontal delta on left/top edges
          const rawX = Math.max(0, dragState.initialRect.x + deltaXPercent)
          const maxX = dragState.initialRect.x + dragState.initialRect.width - MIN_CROP_PERCENT
          nextRect.x = Math.min(maxX, rawX)
          nextRect.width = dragState.initialRect.width + (dragState.initialRect.x - nextRect.x)
          nextRect.height = deriveHeight(nextRect.width)
          nextRect.y = Math.max(
            0,
            dragState.initialRect.y + dragState.initialRect.height - nextRect.height,
          )
          // Re-clamp
          nextRect.height = dragState.initialRect.height + (dragState.initialRect.y - nextRect.y)
          nextRect.width = deriveWidth(nextRect.height)
          nextRect.x = dragState.initialRect.x + dragState.initialRect.width - nextRect.width
        }

        return nextRect
      })
    }

    const handlePointerUp = () => {
      setDragState(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragState])

  const startMoveCrop = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragState({
      mode: 'move',
      startX: event.clientX,
      startY: event.clientY,
      initialRect: cropRect,
    })
  }

  const startResizeCrop = (
    handle: NonNullable<DragState['handle']>,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setDragState({
      mode: 'resize',
      handle,
      startX: event.clientX,
      startY: event.clientY,
      initialRect: cropRect,
    })
  }

  const toolbarButtonClassName =
    'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAEAEA] text-slate-600 transition-colors hover:bg-slate-50 data-[active=true]:border-[#0b2226] data-[active=true]:bg-[#0b2226] data-[active=true]:text-white'

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Type className="w-4 h-4 text-slate-500" /> Article Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (fieldErrors.title) {
              setFieldErrors((current) => ({ ...current, title: undefined }))
            }
          }}
          placeholder="Enter a captivating title..."
          className={`w-full bg-white border rounded-md py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all font-serif text-lg ${
            fieldErrors.title
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
          }`}
        />
        {fieldErrors.title ? (
          <p className="text-xs text-red-500">{fieldErrors.title}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-500" /> Category
          </label>
          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value)
              if (fieldErrors.categoryId) {
                setFieldErrors((current) => ({ ...current, categoryId: undefined }))
              }
            }}
            className={`w-full bg-white border rounded-md py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
              fieldErrors.categoryId
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-[#EAEAEA] focus:border-[#0b2226] focus:ring-[#0b2226]'
            }`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldErrors.categoryId ? (
            <p className="text-xs text-red-500">{fieldErrors.categoryId}</p>
          ) : null}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-slate-500" /> Cover Image
        </label>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelection}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#EAEAEA] px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading image...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  {featuredImage ? 'Replace image' : 'Upload from device'}
                </>
              )}
            </button>
          </div>
          {(localPreviewUrl || featuredImage) ? (
            <div className="relative overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] group">
              <img
                src={localPreviewUrl ?? featuredImage}
                alt="Cover preview"
                className="h-56 w-full object-cover"
              />
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={removeImage}
                disabled={isUploadingImage}
                title="Remove image"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content Editor */}
      <div className="space-y-2 pt-4">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
          <Layout className="w-4 h-4 text-slate-500" /> Article Content
        </label>
        <div className="flex flex-wrap gap-2 rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-3">
          <button
            type="button"
            data-active={editor?.isActive('bold') || undefined}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={toolbarButtonClassName}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-active={editor?.isActive('italic') || undefined}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={toolbarButtonClassName}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-active={editor?.isActive('heading', { level: 1 }) || undefined}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={toolbarButtonClassName}
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-active={editor?.isActive('heading', { level: 2 }) || undefined}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={toolbarButtonClassName}
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-active={editor?.isActive('bulletList') || undefined}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={toolbarButtonClassName}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-active={editor?.isActive('orderedList') || undefined}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={toolbarButtonClassName}
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-active={editor?.isActive('blockquote') || undefined}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={toolbarButtonClassName}
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            className={toolbarButtonClassName}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            className={toolbarButtonClassName}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <EditorContent editor={editor} />
          {(editor?.isEmpty ?? content.trim().length === 0) ? (
            <div className="pointer-events-none absolute left-4 top-4 text-slate-400">
              Start writing your story here...
            </div>
          ) : null}
        </div>
        {fieldErrors.content ? (
          <p className="text-xs text-red-500">{fieldErrors.content}</p>
        ) : null}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-8 pb-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#0b2226] hover:bg-[#13383d] text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting
            ? mode === 'create'
              ? 'Publishing...'
              : 'Saving...'
            : mode === 'create'
              ? 'Publish Article'
              : 'Save Changes'}
        </button>
      </div>

      {pendingImageSrc ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-medium text-[#0b2226]">
                  Crop cover image
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Adjust the framing before uploading the cover image.
                </p>
              </div>
              <button
                type="button"
                onClick={resetCropState}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#0b2226]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA]">
                <div className="border-b border-[#EAEAEA] px-4 py-3 text-sm font-medium text-slate-700 flex items-center justify-between">
                  <span>Source image</span>
                  <span className="text-xs text-slate-400 font-normal">Fixed 16 : 9 ratio</span>
                </div>
                <div
                  ref={cropAreaRef}
                  className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-white p-4"
                >
                  <img
                    ref={cropImageRef}
                    src={pendingImageSrc}
                    alt="Source preview"
                    onLoad={(event) =>
                      setPendingImageSize({
                        width: event.currentTarget.naturalWidth,
                        height: event.currentTarget.naturalHeight,
                      })
                    }
                    className="max-h-full max-w-full object-contain"
                  />
                  {pendingImageSize ? (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        left: cropImageRef.current?.offsetLeft ?? 0,
                        top: cropImageRef.current?.offsetTop ?? 0,
                        width: cropImageRef.current?.clientWidth ?? 0,
                        height: cropImageRef.current?.clientHeight ?? 0,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/35" />
                      <div
                        role="presentation"
                        onPointerDown={startMoveCrop}
                        className="pointer-events-auto absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
                        style={{
                          left: `${cropRect.x}%`,
                          top: `${cropRect.y}%`,
                          width: `${cropRect.width}%`,
                          height: `${cropRect.height}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-transparent" />
                        {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            onPointerDown={(event) => startResizeCrop(handle, event)}
                            className={`absolute h-4 w-4 rounded-full border-2 border-[#0b2226] bg-white ${
                              handle === 'nw'
                                ? '-left-2 -top-2 cursor-nwse-resize'
                                : handle === 'ne'
                                  ? '-right-2 -top-2 cursor-nesw-resize'
                                  : handle === 'sw'
                                    ? '-bottom-2 -left-2 cursor-nesw-resize'
                                    : '-bottom-2 -right-2 cursor-nwse-resize'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-4 text-sm leading-6 text-slate-500">
                Drag the crop box to reposition. Drag a corner handle to resize — width and height stay locked at <strong className="text-slate-700">16:9</strong>.
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetCropState}
                  className="flex-1 rounded-xl border border-[#EAEAEA] px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  disabled={isUploadingImage || !pendingImageSize}
                  className="flex-1 rounded-xl bg-[#0b2226] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#13383d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isUploadingImage ? 'Uploading...' : 'Crop and upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  )
}
