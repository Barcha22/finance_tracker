'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  const [showForm, setShowForm] = useState(false)
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
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-95"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? 'Cancel' : 'Add Transaction'}
            </button>
          </div>

          {/* --- Add Transaction Form (Animated Reveal) --- */}
          {showForm && (
        <Card className="bg-[#1e1b4b] border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-indigo-500/20">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <DollarSign size={120} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
               <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <Plus size={20} className="text-indigo-400" />
               </div>
               Record New Transaction
            </h2>
            
            <form onSubmit={handleAddTransaction} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Description
                  </Label>
                  <div className="relative">
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      placeholder="e.g., Apple Store Purchase"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/20 font-semibold"
                    />
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Amount ($)
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/20 font-semibold"
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-[#1e1b4b] border border-white/10 h-14 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-semibold appearance-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_id" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Account
                  </Label>
                  <select
                    id="account_id"
                    name="account_id"
                    value={formData.account_id}
                    onChange={handleInputChange}
                    className="w-full bg-[#1e1b4b] border border-white/10 h-14 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-semibold appearance-none"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="category_id" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Category
                  </Label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full bg-[#1e1b4b] border border-white/10 h-14 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-semibold appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction_date" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="transaction_date"
                      name="transaction_date"
                      type="date"
                      value={formData.transaction_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border-white/10 h-14 px-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/20 font-semibold"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex pt-4">
                <Button
                  type="submit"
                  className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95"
                >
                  Add Transaction
                </Button>
              </div>
            </form>
          </div>
        </Card>
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
