import { useTransactionsStore } from "../stores/transactions.store"
import { useMemo } from "react";

export default function ShowFilterPanel(){
    const {setFilterType,filterType,activeCategoryId,setActiveCategoryId,
            transactions,categories,searchTerm}=useTransactionsStore();

    const usedCategories = useMemo(() => {
        const usedIds = new Set(transactions?.map((t) => t.category_id))
        return categories?.filter((c) => usedIds.has(c.id))
    }, [categories, transactions])

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


    return (
        <div className="bg-[#1e1b4b] border border-white/5 rounded-3xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Type Filter */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Type</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all active:scale-95 ${
                        filterType === type
                          ? type === 'income'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : type === 'expense'
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {usedCategories!.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Category</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategoryId(null)}
                      className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all active:scale-95 ${
                        activeCategoryId === null
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      All Categories
                    </button>
                    {usedCategories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryId(activeCategoryId === cat.id ? null : cat.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all active:scale-95 ${
                          activeCategoryId === cat.id
                            ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results count */}
              <p className="text-xs font-bold text-indigo-300/40">
                Showing {filteredTransactions?.length} of {transactions?.length} transactions
              </p>
            </div>
    )
}