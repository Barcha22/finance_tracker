import { useAuth } from "@/context/AuthContext";
import { Tag,Edit2,Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useCategoriesStore } from "../stores/categories.store"
import toast from "react-hot-toast"
import { categoriesAPI } from "@/lib/api"
import { Category } from "../types/categories.types"

export function CategoriesGrid(){
    const { user } = useAuth();
    const {categories,setFormData,setEditingId,setShowForm,filterType,setFilterType}=useCategoriesStore()
    const filteredCategories = filterType === 'all'? categories: categories?.filter((cat) => cat.type === filterType)
    
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
            await useCategoriesStore.getState().fetchCategories(user?.id)
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete')
          }
        }
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories?.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Tag size={48} className="mx-auto text-indigo-400/30 mb-4" />
            <p className="text-white/60 font-semibold">No categories found for this type</p>
          </div>
        ) : (
          filteredCategories?.map((category) => (
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
    )
}