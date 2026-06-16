'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useTransactionsStore } from '../stores/transactions.store'

import ActionBar from '../views/action-bar'
import ShowFilterPanel from '../views/show-filter-panel'
import TransactionLedger from '../views/transaction-ledger'
import TransactionModal from '../views/transaction-modal'



export default function Transactions() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const {showFilterPanel,showModal,loading}=useTransactionsStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }
    useTransactionsStore.getState().fetchData(user?.id)
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-[#051424] p-4 md:p-8 space-y-10 font-['Manrope'] text-white">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Transactions</h1>
            <p className="text-indigo-200/60 font-semibold text-sm">Monitor and manage your cashflow with precision.</p>
          </div>

          {/* Action Bar */}
          <ActionBar />

          {/* Filter Panel */}
          {showFilterPanel && (
            <ShowFilterPanel />
          )}

          {/* Transaction Modal */}
          {showModal && (
            <TransactionModal />
          )}

          {/* Transactions Ledger */}
          <TransactionLedger />
        </>
      )}
    </div>
  )
}