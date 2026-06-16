export interface FormData{
    name: string,
    type: 'expense' | 'income',
};

export interface Category {
  id: number
  user_id: number
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
}
