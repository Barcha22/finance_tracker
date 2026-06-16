'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus,X,Tag } from 'lucide-react'
import { useCategoriesStore } from '../stores/categories.store'

import AddForm from '../components/add.form'
import { CategoriesGrid } from '../views/categories-grid'

export default function CategoriesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const {editingId,showForm,setShowForm,loading,filterType,setFilterType}=useCategoriesStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }
    useCategoriesStore.getState().fetchCategories(user?.id)
  }, [isAuthenticated, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#051424] p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-[#051424] p-4 md:p-8 space-y-10 font-['Manrope'] text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Categories
          </h1>
          <p className="text-indigo-200/60 font-semibold text-sm">
            Organize your transactions with custom categories
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-[#1e1b4b] border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <Tag className="text-indigo-400" />
            {editingId ? 'Update Category' : 'Create New Category'}
          </h2>
          {/* form */}
            <AddForm />
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {(['all', 'expense', 'income'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
              filterType === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <CategoriesGrid />
      
    </div>
  )
}
