import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCategoriesStore } from "../stores/categories.store"
import toast from "react-hot-toast"
import { categoriesAPI } from "@/lib/api"

export default function AddForm(){
    const { user } = useAuth();
    const {formData,setFormData,setEditingId,editingId,setShowForm}=useCategoriesStore();

    const handleAddOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData?.name || !formData?.type) {
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
          await useCategoriesStore.getState().fetchCategories(user?.id)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Operation failed')
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        formData && setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        })
    }
    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData({ name: '', type: 'expense' })
    }
    return (
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
                  value={formData?.name}
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
                  value={formData?.type}
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
    )
}