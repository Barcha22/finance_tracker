'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

// Sample data
const monthlyData = [
  { month: 'Jan', income: 4000, expenses: 2400 },
  { month: 'Feb', income: 3000, expenses: 1398 },
  { month: 'Mar', income: 2000, expenses: 9800 },
  { month: 'Apr', income: 2780, expenses: 3908 },
  { month: 'May', income: 1890, expenses: 4800 },
  { month: 'Jun', income: 2390, expenses: 3800 },
]

const categoryData = [
  { name: 'Food', value: 30, color: '#ff6b6b' },
  { name: 'Transport', value: 25, color: '#4ecdc4' },
  { name: 'Entertainment', value: 20, color: '#45b7d1' },
  { name: 'Utilities', value: 15, color: '#96ceb4' },
  { name: 'Other', value: 10, color: '#ffeaa7' },
]

export default function DashboardHome() {
  const totalIncome = 16060
  const totalExpenses = 25906
  const balance = totalIncome - totalExpenses

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-green-700 mt-2">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-red-700 mt-2">${totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-red-200 p-3 rounded-lg">
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Balance</p>
                <p className={`text-3xl font-bold mt-2 ${balance < 0 ? 'text-red-700' : 'text-blue-700'}`}>
                  ${balance.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Income vs Expenses</h2>
            <p className="text-gray-600 text-sm mt-1">Last 6 months</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Distribution */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Expense Categories</h2>
            <p className="text-gray-600 text-sm mt-1">Distribution by category</p>
          </div>
          <div className="p-6 flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
