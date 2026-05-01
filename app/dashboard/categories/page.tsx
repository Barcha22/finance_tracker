'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { categoriesAPI } from '@/lib/api'
import { Plus, Trash2, Edit2, Tag, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: number
  user_id: number
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
}

export default function CategoriesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
  })
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }
    fetchCategories()
  }, [isAuthenticated, user, router])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await categoriesAPI.getByUser(user!.id)
      setCategories(res?.result || [])
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type) {
      toast.error('Please fill all fields')
      return
    }

    try {
      if (editingId) {
        await categoriesAPI.update(editingId, {
          name: formData.name,
          type: formData.type,
          color: '#6366f1',
          icon: 'tag',
        })
        toast.success('Category updated!')
      } else {
        await categoriesAPI.create({
          name: formData.name,
          type: formData.type,
          color: formData.type === 'income' ? '#10b981' : '#6366f1',
          icon: 'tag',
        })
        toast.success('Category created!')
      }

      setFormData({ name: '', type: 'expense' })
      setEditingId(null)
      setShowForm(false)
      await fetchCategories()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed')
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      type: category.type,
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(id)
        toast.success('Category deleted!')
        await fetchCategories()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', type: 'expense' })
  }

  const filteredCategories =
    filterType === 'all'
      ? categories
      : categories.filter((cat) => cat.type === filterType)

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

          <form onSubmit={handleAddOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase text-indigo-300">
                  Category Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Coffee Shops"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 h-12 px-4 rounded-xl focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-black uppercase text-indigo-300">
                  Type
                </Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-[#1e1b4b] border border-white/10 h-12 px-4 rounded-xl focus:ring-indigo-500 text-white"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black"
              >
                {editingId ? 'Update Category' : 'Create Category'}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Tag size={48} className="mx-auto text-indigo-400/30 mb-4" />
            <p className="text-white/60 font-semibold">No categories found for this type</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <Card
              key={category.id}
              className={`border-white/5 p-6 rounded-2xl hover:border-opacity-50 transition-all group ${
                category.type === 'income'
                  ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500'
                  : 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    category.type === 'income'
                      ? 'bg-emerald-500/10'
                      : 'bg-indigo-500/10'
                  }`}
                >
                  <Tag
                    className={category.type === 'income' ? 'text-emerald-400' : 'text-indigo-400'}
                    size={24}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className={`p-2 rounded-lg transition-all ${
                      category.type === 'income'
                        ? 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10'
                        : 'text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-400/10'
                    }`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-white mb-2">{category.name}</h3>

              <div className="pt-3 border-t border-white/5">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    category.type === 'income'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {category.type}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
