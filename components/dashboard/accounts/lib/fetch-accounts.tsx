import { accountsAPI } from "@/lib/api"
import {toast} from 'react-hot-toast'
import { useAuth } from "@/context/AuthContext"  
import { AccountsStore } from "../stores/accounts.store"


export const fetchAccounts = async () => {
    const { user, isAuthenticated } = useAuth()
    const {setLoading,setAccounts} = AccountsStore()
    
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