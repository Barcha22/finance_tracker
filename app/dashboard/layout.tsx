'use client'

import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
