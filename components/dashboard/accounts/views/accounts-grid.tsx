import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card"
import { Wallet,Edit2,Trash2 } from "lucide-react"
import { useAccountsStore } from "../stores/accounts.store"
import { Account } from "../types/accounts.types";
import toast from "react-hot-toast";
import { accountsAPI } from "@/lib/api";

export function AccountsGrid(){
    const { user } = useAuth();
    const {accounts,setFormData,setEditingId,setShowForm}=useAccountsStore();

    const handleEdit = (account: Account) => {
        setFormData({
          name: account.name,
          balance: account.balance.toString(),
          account_type: account.account_type,
        })
        setEditingId(account.id)
        setShowForm(true)
    }
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
          try {
            await accountsAPI.delete(id)
            toast.success('Account deleted!')
            await useAccountsStore.getState().fetchAccounts(user?.id)
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete')
          }
        }
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts?.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Wallet size={48} className="mx-auto text-indigo-400/30 mb-4" />
            <p className="text-white/60 font-semibold">No accounts yet. Create one to get started!</p>
          </div>
        ) : (
          accounts?.map((account) => (
            <Card
              key={account.id}
              className="bg-gradient-to-br from-[#1e1b4b] to-[#2d2749] border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                  <Wallet className="text-indigo-400" size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-white mb-1">{account.name}</h3>
              <p className="text-indigo-300/60 text-sm mb-4">{account.account_type}</p>

              <div className="pt-4 border-t border-white/5">
                <p className="text-indigo-300/60 text-xs uppercase tracking-widest font-bold mb-1">Balance</p>
                <p className="text-2xl font-black text-indigo-300">
                  ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    )
}