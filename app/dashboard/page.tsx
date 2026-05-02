'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { transactionsAPI, accountsAPI, categoriesAPI } from '@/lib/api'
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
  Calendar,
  Trash2
} from 'lucide-react'
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

export default function DashboardHome() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }

    fetchData()
  }, [user, isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [txnsRes, accsRes, catsRes] = await Promise.all([
        transactionsAPI.getByUser(user!.id),
        accountsAPI.getByUser(user!.id),
        categoriesAPI.getByUser(user!.id),
      ])
      
      setTransactions(txnsRes.result || [])
      setAccounts(accsRes.result || [])
      setCategories(catsRes.result || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  // Build per-account expense totals to infer total received (initial deposits + income transactions)
  const expenseByAccount: Record<number, number> = transactions
    .filter(t => t.type === 'expense')
    .reduce((map: Record<number, number>, t) => {
      const acct = t.account_id
      map[acct] = (map[acct] || 0) + parseFloat(String(t.amount || 0))
      return map
    }, {})

  // totalReceived = for each account: current_balance + sum_of_expenses_for_that_account
  // This reconstructs initial deposits + any income transactions and does not decrement when expenses occur
  const totalReceived = accounts.reduce((acc, curr) => {
    const bal = parseFloat(String(curr.balance || 0))
    const acctExpenses = expenseByAccount[curr.id] || 0
    return acc + bal + acctExpenses
  }, 0)

  // Total expenses across all accounts (for display)
  const totalExpenses = Object.values(expenseByAccount).reduce((a, b) => a + b, 0)

  // Net balance should be the current sum of all account balances (expenses only reduce this)
  const balance = accounts.reduce((acc, curr) => acc + parseFloat(String(curr.balance || 0)), 0)

  // Monthly data for chart
  const monthlyData = [
    { month: 'Jan', income: 0, expenses: 0 },
    { month: 'Feb', income: 0, expenses: 0 },
    { month: 'Mar', income: 0, expenses: 0 },
    { month: 'Apr', income: 0, expenses: 0 },
    { month: 'May', income: 0, expenses: 0 },
    { month: 'Jun', income: 0, expenses: 0 },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // This function is no longer used, kept for reference
  }

  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionsAPI.delete(id)
      toast.success('Transaction deleted!')
      fetchData() // Refresh datas
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete transaction')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#051424] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
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
                {/* <Calendar size={16} className="text-indigo-400" /> */}
                {/* <span>Oct 1 - Oct 31, 2023</span> */}
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-400">Live Ledger Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-[#1e1b4b] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={120} /></div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit mb-6">Income</span>
              <div className="mt-auto">
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                {/* <div className="text-sm font-bold text-emerald-400"> <span className="text-indigo-200/30 font-medium tracking-normal text-xs">vs last month</span></div> */}
              </div>
            </div>
          </div>

          <div className="group relative bg-[#1e1b4b] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:border-rose-500/30">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingDown size={120} /></div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit mb-6">Expenses</span>
              <div className="mt-auto">
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-sm font-bold text-rose-400">+2.4% <span className="text-indigo-200/30 font-medium tracking-normal text-xs">vs budget</span></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-indigo-600 border border-indigo-400/30 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-indigo-100 font-black text-xs uppercase tracking-[0.2em] mb-6">Net Balance</span>
              <div className="mt-auto">
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
              <BarChart data={monthlyData}>
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
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id} className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl border ${transaction.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                            {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <TrendingDown size={20} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-black text-white">{transaction.description}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/50">{transaction.transaction_date}</span>
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
    </div>
  )
}
