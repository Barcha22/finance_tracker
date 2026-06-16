import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card"
import { Trash2,Search,Calendar,ArrowUpCircle,ArrowDownCircle } from "lucide-react"
import { useTransactionsStore } from "../stores/transactions.store"
import { useMemo } from "react";
import toast from "react-hot-toast";
import { transactionsAPI } from "@/lib/api";

export default function TransactionLedger(){
    const { user } = useAuth();
    const {searchTerm,filterType,activeCategoryId,transactions,categories,
        setSearchTerm,setFilterType,setActiveCategoryId}=useTransactionsStore();

    const hasActiveFilters = searchTerm?.trim() !== '' || filterType !== 'all' || activeCategoryId !== null
    const filteredTransactions = useMemo(() => {
        return transactions?.filter((tx) => {
          const matchesType = filterType === 'all' || tx.type === filterType
          const matchesCategory = activeCategoryId === null || tx.category_id === activeCategoryId
          const matchesSearch =
            searchTerm?.trim() === '' ||
            tx.description.toLowerCase().includes(searchTerm!.toLowerCase()) ||
            String(tx.amount).includes(searchTerm!) ||
            tx.transaction_date.includes(searchTerm!)
          return matchesType && matchesCategory && matchesSearch
        })
    }, [transactions, filterType, activeCategoryId, searchTerm])

    const clearAllFilters = () => {
        setSearchTerm('')
        setFilterType('all')
        setActiveCategoryId(null)
    }

    const handleDeleteTransaction = async (id: number) => {
        try {
          await transactionsAPI.delete(id)
          toast.success('Transaction deleted!')
          await useTransactionsStore.getState().fetchData(user?.id)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to delete transaction')
        }
    }

    return (
        <Card className="bg-[#1e1b4b] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col group">
            <div className="p-8 md:p-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/5">
              <div>
                <h2 className="text-2xl font-black text-white">Recent Ledger</h2>
                <p className="text-indigo-300 font-semibold text-sm mt-1">
                  {hasActiveFilters
                    ? `${filteredTransactions?.length} result${filteredTransactions?.length !== 1 ? 's' : ''} matching filters`
                    : 'Live updates from your connected accounts'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Transaction</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Sector</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Date</th>
                    <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Amount</th>
                    <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={48} className="text-indigo-400" />
                          <p className="font-bold text-lg">No records match your filters</p>
                          {hasActiveFilters && (
                            <button onClick={clearAllFilters} className="text-indigo-400 text-sm underline">
                              Clear all filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions?.map((transaction) => {
                      const category = categories?.find(c => c.id === transaction.category_id)
                      return (
                        <tr key={transaction.id} className="group/row hover:bg-white/[0.02] transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl border ${transaction.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                {transaction.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                              </div>
                              <span className="text-base font-black text-white group-hover/row:text-indigo-300 transition-colors">
                                {transaction.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {category?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-indigo-200/40 font-bold text-sm">
                              <Calendar size={14} />
                              {new Date(transaction.transaction_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <span className={`text-lg font-black tracking-tighter ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="p-3 text-rose-400/20 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all active:scale-90"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/20">
                End of Ledger — Secure Encrypted Sync
              </p>
            </div>
          </Card>
    )
}