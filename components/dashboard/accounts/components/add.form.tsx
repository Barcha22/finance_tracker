import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import {toast} from 'react-hot-toast'
import { useAccountsStore } from "../stores/accounts.store"
import { accountsAPI } from "@/lib/api"


export default function AddForm(){
    const { user } = useAuth();
    const {formData,setFormData,editingId,setEditingId,setShowForm}=useAccountsStore();

    const handleAddOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()   
        if (!formData?.name || !formData?.balance || !formData?.account_type) {
          toast.error('Please fill all fields')
          return
        }
        try {
          if (editingId) {
            await accountsAPI.update(editingId, {
              name: formData.name,
              balance: parseFloat(formData.balance),
              account_type: formData.account_type,
            })
            toast.success('Account updated!')
          } else {
            await accountsAPI.create({
              name: formData.name,
              balance: parseFloat(formData.balance),
              account_type: formData.account_type,
            })
            toast.success('Account created!')
          }
          setFormData({ name: '', balance: '', account_type: 'Checking' })
          setEditingId(null)
          setShowForm(false)
          await useAccountsStore.getState().fetchAccounts(user?.id)
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
        setFormData({ name: '', balance: '', account_type: 'Checking' })
    }


    return (
          <form onSubmit={handleAddOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase text-indigo-300">
                  Account Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Checking Account"
                  value={formData?.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 h-12 px-4 rounded-xl focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_type" className="text-xs font-black uppercase text-indigo-300">
                  Account Type
                </Label>
                <select
                  id="account_type"
                  name="account_type"
                  value={formData?.account_type}
                  onChange={handleInputChange}
                  className="w-full bg-[#1e1b4b] border border-white/10 h-12 px-4 rounded-xl focus:ring-indigo-500 text-white"
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="balance" className="text-xs font-black uppercase text-indigo-300">
                  Current Balance ($)
                </Label>
                <div className="relative">
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    placeholder="0.00"
                    value={formData?.balance}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full bg-white/5 border-white/10 h-12 pl-10 rounded-xl focus:ring-indigo-500 text-white"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black"
              >
                {editingId ? 'Update Account' : 'Create Account'}
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