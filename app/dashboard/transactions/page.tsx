'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Calendar, Tag, DollarSign, ArrowUpCircle, ArrowDownCircle, Search, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  title: string
  amount: number
  category: string
  date: string
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
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      title: 'Grocery Shopping',
      amount: 120,
      category: 'Food',
      date: '2024-03-28',
      type: 'expense',
    },
    {
      id: '2',
      title: 'Salary',
      amount: 3500,
      category: 'Income',
      date: '2024-03-25',
      type: 'income',
    },
    {
      id: '3',
      title: 'Gas',
      amount: 50,
      category: 'Transport',
      date: '2024-03-24',
      type: 'expense',
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense' as const,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error('Please fill all fields')
      return
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
    }

    setTransactions([newTransaction, ...transactions])
    setFormData({ title: '', amount: '', category: '', type: 'expense' })
    setShowForm(false)
    toast.success('Transaction added!')
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    toast.success('Transaction deleted!')
  }

  return (
    <div className="min-h-screen bg-[#051424] p-4 md:p-8 space-y-10 font-['Manrope'] text-white">
      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
                  <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Description
                  </Label>
                  <div className="relative">
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g., Apple Store Purchase"
                      value={formData.title}
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
                    Classification
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
                  <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Sector / Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#1e1b4b] border border-white/10 h-14 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-semibold appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Transport">Transport & Travel</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities & Subs</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex pt-4">
                <Button
                  type="submit"
                  className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95"
                >
                  Confirm & Sync Transaction
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <DollarSign size={48} className="text-indigo-400" />
                      <p className="font-bold text-lg">No records found in current view</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
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
                           {transaction.title}
                         </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-indigo-200/40 font-bold text-sm">
                         <Calendar size={14} />
                         {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                ))
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
    </div>
  )
}
