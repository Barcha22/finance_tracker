'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { accountsAPI } from '@/lib/api'
import { Plus, Trash2, Edit2, Wallet, DollarSign, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Account {
  id: number
  user_id: number
  name: string
  balance: number
  account_type: string
}

export default function AccountsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    account_type: 'Checking',
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }
    fetchAccounts()
  }, [isAuthenticated, user, router])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const res = await accountsAPI.getByUser(user!.id)
      setAccounts(res?.result || [])
    } catch (error) {
      toast.error('Failed to load accounts')
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

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.balance || !formData.account_type) {
      toast.error('Please fill all fields')
      return
    }

    try {
      if (editingId) {
        await accountsAPI.update(editingId, {
          name: formData.name,
          balance: parseFloat(formData.balance),
          account_type: formData.account_type,
        })
        toast.success('Account updated!')
      } else {
        await accountsAPI.create({
          name: formData.name,
          balance: parseFloat(formData.balance),
          account_type: formData.account_type,
        })
        toast.success('Account created!')
      }
      
      setFormData({ name: '', balance: '', account_type: 'Checking' })
      setEditingId(null)
      setShowForm(false)
      await fetchAccounts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed')
    }
  }

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
        await fetchAccounts()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', balance: '', account_type: 'Checking' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#051424] p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#051424] p-4 md:p-8 space-y-10 font-['Manrope'] text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Accounts
          </h1>
          <p className="text-indigo-200/60 font-semibold text-sm">
            Manage your financial accounts and view balances
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'New Account'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-[#1e1b4b] border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <Wallet className="text-indigo-400" />
            {editingId ? 'Update Account' : 'Create New Account'}
          </h2>

          <form onSubmit={handleAddOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase text-indigo-300">
                  Account Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Checking Account"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 h-12 px-4 rounded-xl focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_type" className="text-xs font-black uppercase text-indigo-300">
                  Account Type
                </Label>
                <select
                  id="account_type"
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleInputChange}
                  className="w-full bg-[#1e1b4b] border border-white/10 h-12 px-4 rounded-xl focus:ring-indigo-500 text-white"
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="balance" className="text-xs font-black uppercase text-indigo-300">
                  Current Balance ($)
                </Label>
                <div className="relative">
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full bg-white/5 border-white/10 h-12 pl-10 rounded-xl focus:ring-indigo-500 text-white"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black"
              >
                {editingId ? 'Update Account' : 'Create Account'}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Wallet size={48} className="mx-auto text-indigo-400/30 mb-4" />
            <p className="text-white/60 font-semibold">No accounts yet. Create one to get started!</p>
          </div>
        ) : (
          accounts.map((account) => (
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
    </div>
  )
}
