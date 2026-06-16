export interface Transaction {
  id: number
  user_id: number
  account_id: number
  category_id: number
  amount: number
  description: string
  type: 'income' | 'expense'
  transaction_date: string
}

export interface Account {
  id: number
  user_id: number
  name: string
  balance: number
  account_type: string
}

export interface Category {
  id: number
  user_id: number
  name: string
  type: 'income' | 'expense'
}

export interface FormData {
  description: string
  amount: string
  category_id: string
  account_id: string
  type: 'income' | 'expense'
  transaction_date: string
}