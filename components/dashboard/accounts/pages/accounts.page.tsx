'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, Wallet, X } from 'lucide-react'
import { fetchAccounts } from '../lib/fetch-accounts'
import { AccountsStore } from '../stores/accounts.store'
import AddForm from '../components/add.form'
import { AccountsGrid } from '../views/accounts-grid'

export default function AccountsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const {setShowForm,loading,showForm,editingId}=AccountsStore();
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }
    fetchAccounts()
  }, [isAuthenticated, user, router])

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
          onClick={() => showForm && setShowForm(!showForm)}
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
          {/* form */}
          <AddForm />
        </Card>
      )}

      {/* Accounts Grid */}
      <AccountsGrid />
    </div>
  )
}
