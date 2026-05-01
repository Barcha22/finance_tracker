'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { transactionsAPI, accountsAPI, categoriesAPI } from '@/lib/api'
import { Trash2, Plus, Calendar, Tag, DollarSign, ArrowUpCircle, ArrowDownCircle, Search, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Transaction {
  id: number
  user_id: number
  account_id: number
  category_id: number
  amount: number
  description: string
  type: 'income' | 'expense'
  transaction_date: string
}

interface Account {
  id: number
  user_id: number
  name: string
  balance: number
  account_type: string
}

interface Category {
  id: number
  user_id: number
  name: string
  type: 'income' | 'expense'
}

/**
 * Premium Transactions Management Component
 * 
 * Coherent with "Indigo Financial" Dark Theme:
 * - High Contrast: White/Indigo text on deep backgrounds.
 * - Textured Containers: Deep indigo cards with subtle borders.
 * - Polished Forms: Themed inputs with clear focus states.
 * - Responsive Table: Optimized for readability with status-based color coding.
 */
export default function Transactions() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    account_id: '',
    type: 'expense' as const,
    transaction_date: new Date().toISOString().split('T')[0],
  })

  // Fetch data on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [isAuthenticated, user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [txRes, acRes, catRes] = await Promise.all([
        transactionsAPI.getByUser(user!.id),
        accountsAPI.getByUser(user!.id),
        categoriesAPI.getByUser(user!.id),
      ])
      
      setTransactions(txRes?.result || [])
      setAccounts(acRes?.result || [])
      setCategories(catRes?.result || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
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

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category_id || !formData.account_id) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await transactionsAPI.create({
        account_id: parseInt(formData.account_id),
        category_id: parseInt(formData.category_id),
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: formData.type,
        transaction_date: formData.transaction_date,
      })
      
      toast.success('Transaction added successfully!')
      setFormData({
        description: '',
        amount: '',
        category_id: '',
        account_id: '',
        type: 'expense',
        transaction_date: new Date().toISOString().split('T')[0],
      })
      setShowForm(false)
      await fetchData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add transaction')
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionsAPI.delete(id)
      toast.success('Transaction deleted!')
      await fetchData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete transaction')
    }
  }

  const getFilteredTransactions = () => {
    return transactions.filter((tx) => {
      const matchesType = filterType === 'all' || tx.type === filterType
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
  }

  return (
    <div className="min-h-screen bg-[#051424] p-4 md:p-8 space-y-10 font-['Manrope'] text-white">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      )}
      {!loading && (
        <>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">
              Transactions
            </h1>
            <div className="flex items-center gap-4 text-indigo-200/60 font-semibold text-sm">
               <p>Monitor and manage your cashflow with precision.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all active:scale-95">
              <Filter size={18} className="text-indigo-400" />
              Filter
            </button>
            <button 
              onClick={() => setShowModal(!showModal)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-95"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>

          {/* --- Transaction Modal (Overlay) --- */}
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
              {/* Backdrop (Solid Overlay, No Blur) */}
              <div 
                className="absolute inset-0 bg-[#051424]/90 transition-opacity"
                onClick={() => setShowModal(false)}
              />
              
              {/* Modal Container */}
              <Card className="relative w-full max-w-2xl bg-[#1e1b4b] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <DollarSign size={160} />
                </div>
                
                <div className="p-10 md:p-12 relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/20">
                        <Plus size={24} className="text-indigo-400" />
                      </div>
                      New Entry
                    </h2>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/50 hover:text-white transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleAddTransaction} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Description</label>
                        <div className="relative">
                          <input name="description" type="text" placeholder="e.g., Grocery Shopping" value={formData.description} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/10 font-bold outline-none transition-all" />
                          <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/40" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Amount ($)</label>
                        <div className="relative">
                          <input name="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleInputChange} step="0.01" className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/10 font-bold outline-none transition-all" />
                          <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/40" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Type</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Account</label>
                        <select name="account_id" value={formData.account_id} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="">Select Account</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Category</label>
                        <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Date</label>
                        <input name="transaction_date" type="date" value={formData.transaction_date} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer" />
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
          )}

      {/* --- Transactions Ledger --- */}
      <Card className="bg-[#1e1b4b] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col group">
        <div className="p-8 md:p-10 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-2xl font-black text-white">Recent Ledger</h2>
            <p className="text-indigo-300 font-semibold text-sm mt-1">Live updates from your connected accounts</p>
          </div>
          <div className="hidden md:flex relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
             <input 
               type="text" 
               placeholder="Search ledger..." 
               className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
             />
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
              {getFilteredTransactions().length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <DollarSign size={48} className="text-indigo-400" />
                      <p className="font-bold text-lg">No records found in current view</p>
                    </div>
                  </td>
                </tr>
              ) : (
                getFilteredTransactions().map((transaction) => {
                  const category = categories.find(c => c.id === transaction.category_id)
                  return (
                    <tr key={transaction.id} className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl border ${
                            transaction.type === 'income' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
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
                        <span className={`text-lg font-black tracking-tighter ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-3 text-rose-400/20 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all active:scale-90"
                          title="Remove Transaction"
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
        
        {/* Footer info bar */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-center">
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/20">
              End of Ledger — Secure Encrypted Sync
           </p>
        </div>
      </Card>
        </>
      )}
    </div>
  )
}
