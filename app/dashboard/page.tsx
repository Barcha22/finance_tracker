'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  Calendar,
  DollarSign,
  Tag,
  X,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  title: string
  amount: number
  category: string
  date: string
  type: 'income' | 'expense'
}

// --- Mock Data ---
const initialMonthlyData = [
  { month: 'Jan', income: 4500, expenses: 2400 },
  { month: 'Feb', income: 5200, expenses: 1398 },
  { month: 'Mar', income: 4800, expenses: 3200 },
  { month: 'Apr', income: 6100, expenses: 3908 },
  { month: 'May', income: 5900, expenses: 4800 },
  { month: 'Jun', income: 7200, expenses: 3800 },
]

/**
 * Integrated High-Fidelity FinTrack Dashboard - Modal Edition (No Blur)
 */
export default function DashboardHome() {
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

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense' as const,
  })

  // Dynamic calculations
  const totalIncomeBase = 33700
  const totalExpensesBase = 19506
  
  const currentIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)
    
  const currentExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalIncome = totalIncomeBase + currentIncome
  const totalExpenses = totalExpensesBase + currentExpenses
  const balance = totalIncome - totalExpenses

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
    setShowModal(false)
    toast.success('Transaction added!')
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    toast.success('Transaction deleted!')
  }

  return (
    <div className="min-h-screen w-full bg-[#051424] font-['Manrope'] text-white overflow-x-hidden relative">
      
      {/* --- Main Dashboard Content --- */}
      <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Dashboard</h1>
            <div className="flex items-center gap-4 text-indigo-200/60 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" />
                <span>Oct 1 - Oct 31, 2023</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-400">Live Ledger Active</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-95"
          >
            <Plus size={20} />
            Add Transactions
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-[#1e1b4b] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={120} /></div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit mb-6">Income</span>
              <div className="mt-auto">
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${totalIncome.toLocaleString()}</div>
                <div className="text-sm font-bold text-emerald-400">+14.2% <span className="text-indigo-200/30 font-medium tracking-normal text-xs">vs last month</span></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#1e1b4b] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:border-rose-500/30">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingDown size={120} /></div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit mb-6">Expenses</span>
              <div className="mt-auto">
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${totalExpenses.toLocaleString()}</div>
                <div className="text-sm font-bold text-rose-400">+2.4% <span className="text-indigo-200/30 font-medium tracking-normal text-xs">vs budget</span></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-indigo-600 border border-indigo-400/30 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-indigo-100 font-black text-xs uppercase tracking-[0.2em] mb-6">Net Balance</span>
              <div className="mt-auto">
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${balance.toLocaleString()}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-6">Global Portfolio Summary</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[#1e1b4b] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col group p-10">
            <h3 className="text-2xl font-black text-white mb-6">Cashflow Analysis</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={initialMonthlyData}>
                <defs>
                  <linearGradient id="barInc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" stopOpacity={1}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0.4}/></linearGradient>
                  <linearGradient id="barExp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={1}/><stop offset="100%" stopColor="#e11d48" stopOpacity={0.4}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }} />
                <Bar dataKey="income" fill="url(#barInc)" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="url(#barExp)" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#1e1b4b] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col group">
            <div className="p-10 border-b border-white/5">
              <h3 className="text-2xl font-black text-white">Recent Activity</h3>
              <p className="text-indigo-300 font-semibold text-sm mt-1">Live ledger from integrated sources</p>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl border ${transaction.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                            {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <TrendingDown size={20} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-black text-white">{transaction.title}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/50">{transaction.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`text-lg font-black tracking-tighter ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-rose-400/20 hover:text-rose-400 p-1 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
                      <input name="title" type="text" placeholder="e.g., Apple Store" value={formData.title} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-white/10 font-bold outline-none transition-all" />
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#2c2a5e] border border-white/10 h-16 px-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white font-bold appearance-none cursor-pointer">
                      <option value="">Select Category</option>
                      <option value="Food">Food & Dining</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Housing">Housing</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-95">
                    Sync Transaction
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
    </div>
  )
}
