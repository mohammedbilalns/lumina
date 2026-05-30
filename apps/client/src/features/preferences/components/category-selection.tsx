import { useEffect, useState } from 'react'
import type { Category } from '@lumina/shared-types'
import { getCategories, saveUserPreferences, getUserPreferences } from '../server/preferences.functions'
import { toast } from 'sonner'
import { Check, Loader2 } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Route as RootRoute } from '@/routes/__root'
import { callAuthorized } from '@/utils/auth-client'
import { ROUTES } from '@/constants/routes'

interface CategorySelectionProps {
  onSuccess?: () => void
}

export function CategorySelection({ onSuccess }: CategorySelectionProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { queryClient } = RootRoute.useRouteContext()
  const navigate = useNavigate()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, preferencesRes] = await Promise.all([
          getCategories(),
          callAuthorized(getUserPreferences, {})
        ])
        
        setCategories(categoriesRes.data.categories)
        
        const currentIds = preferencesRes.data.preferences.map((p: any) => p.categoryId || p.category?.id)
        setSelectedIds(currentIds.filter(Boolean))
      } catch (err) {
        toast.error('Failed to load interests')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleCategory = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one category')
      return
    }

    setIsSaving(true)
    try {
      await callAuthorized(saveUserPreferences, { categoryIds: selectedIds })
      queryClient.removeQueries({ queryKey: ['articles', 'preferred'] })
      queryClient.removeQueries({ queryKey: ['articles', 'own'] })
      toast.success('Interests saved successfully!')

      await router.invalidate()

      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => {
          navigate({ to: ROUTES.dashboard, replace: true })
        }, 50)
      }
    } catch (err) {
      toast.error('Failed to save interests')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#0b2226] mb-4" />
        <p className="text-slate-500 font-sans">Curating categories...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-serif font-medium text-[#0b2226]">
          What interests you?
        </h2>
        <p className="text-slate-500 text-base font-sans max-w-sm mx-auto">
          Choose the topics you&apos;d like to see in your feed. Select at least one to get started.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`
px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300
${isSelected 
? 'border-[#0b2226] bg-[#0b2226] text-white shadow-md scale-105' 
: 'border-[#EAEAEA] bg-white text-slate-600 hover:border-[#0b2226]/30 hover:bg-slate-50'}
`}
            >
              <div className="flex items-center gap-2">
                {category.name}
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={handleSave}
          disabled={selectedIds.length === 0 || isSaving}
          className="group relative w-full max-w-sm overflow-hidden bg-[#0b2226] text-white font-medium py-4 rounded-2xl hover:bg-[#13383d] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Curating your feed...
              </>
            ) : (
                <>
                  <span>Save Interests & Continue</span>
                  <div className="w-2 h-2 rounded-full bg-[#f8cb5b] group-hover:animate-ping" />
                </>
              )}
          </div>
        </button>
      </div>
    </div>
  )
}
