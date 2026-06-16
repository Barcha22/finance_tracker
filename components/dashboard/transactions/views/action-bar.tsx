import { Search,X,Filter,Plus } from "lucide-react"
import { useTransactionsStore } from "../stores/transactions.store"

export default function ActionBar(){
    const {searchTerm,setSearchTerm,showFilterPanel,setShowFilterPanel,filterType,activeCategoryId,setFilterType,setActiveCategoryId,showModal,setShowModal}=useTransactionsStore();

    const hasActiveFilters = searchTerm?.trim() !== '' || filterType !== 'all' || activeCategoryId !== null
    
    const clearAllFilters = () => {
        setSearchTerm('')
        setFilterType('all')
        setActiveCategoryId(null)
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm!}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-white/20 font-semibold"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 px-5 py-3 border rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                showFilterPanel || hasActiveFilters
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              <Filter size={16} className={showFilterPanel || hasActiveFilters ? 'text-white' : 'text-indigo-400'} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              )}
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-bold transition-all active:scale-95"
              >
                <X size={14} />
                Clear
              </button>
            )}

            <div className="flex-1" />

            {/* Add Transaction */}
            <button
              onClick={() => setShowModal(!showModal)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-95"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
    )
}