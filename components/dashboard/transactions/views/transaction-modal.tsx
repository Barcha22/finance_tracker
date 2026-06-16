import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card"
import { Plus,X,DollarSign,Tag, } from "lucide-react"
import { useTransactionsStore } from "../stores/transactions.store"
import toast from "react-hot-toast";
import { transactionsAPI } from "@/lib/api";

export default function TransactionModal(){
    const { user } = useAuth();
    const {setShowModal,categories,formData,accounts,setFormData}=useTransactionsStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        formData && setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData?.description || !formData?.amount || !formData?.category_id || !formData?.account_id) {
          toast.error('Please fill all fields')
          return
        }
        try {

           const transactionDate = formData.transaction_date 
          ? new Date(formData.transaction_date).toISOString()
          : new Date().toISOString()

          await transactionsAPI.create({
            account_id: parseInt(formData.account_id),
            category_id: parseInt(formData.category_id),
            amount: parseFloat(formData.amount),
            description: formData.description,
            type: formData.type,
            transaction_date: transactionDate,
          })
          toast.success('Transaction added successfully!')
          setFormData({
            description: '', amount: '', category_id: '', account_id: '',
            type: 'expense', transaction_date: new Date().toISOString().split('T')[0],
          })
          setShowModal(false)
          await useTransactionsStore.getState().fetchData(user?.id)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to add transaction')
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="absolute inset-0 bg-[#051424]/90 transition-opacity" onClick={() => setShowModal(false)} />
              <Card className="relative w-full max-w-2xl bg-[#1e1b4b] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><DollarSign size={160} /></div>
                <div className="p-10 md:p-12 relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/20">
                        <Plus size={24} className="text-indigo-400" />
                      </div>
                      New Entry
                    </h2>
                    <button onClick={() => setShowModal(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/50 hover:text-white transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleAddTransaction} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Description</label>
                        <div className="relative">
                          <input name="description" type="text" placeholder="e.g., Grocery Shopping" value={formData?.description} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/10 font-bold outline-none transition-all" />
                          <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/40" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Amount ($)</label>
                        <div className="relative">
                          <input name="amount" type="number" placeholder="0.00" value={formData?.amount} onChange={handleInputChange} step="0.01" className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/10 font-bold outline-none transition-all" />
                          <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/40" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Type</label>
                        <select name="type" value={formData?.type} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Account</label>
                        <select name="account_id" value={formData?.account_id} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="">Select Account</option>
                          {accounts?.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Category</label>
                        <select name="category_id" value={formData?.category_id} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="">Select Category</option>
                          {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Date</label>
                        <input name="transaction_date" type="date" value={formData?.transaction_date} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer" />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button type="submit" className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-95">
                        Add Transaction
                      </button>
                      <button type="button" onClick={() => setShowModal(false)} className="px-8 h-16 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl text-sm font-bold transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
    )
}