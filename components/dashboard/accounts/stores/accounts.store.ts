import {create} from 'zustand'
import { Account, FormData } from '../types/accounts.types'


interface AccountsState{
    formData: FormData | null;
    setFormData: (formData:FormData|null)=>void;

    editingId:number|null;
    setEditingId:(editingId:number|null)=>void;

    showForm:boolean;
    setShowForm:(showForm:boolean)=>void;

    loading: boolean;
    setLoading: (loading:boolean)=>void;

    accounts:Account[]|null;
    setAccounts:(accounts:Account[]|null)=>void;

    fetchAccounts: (userId: any) => Promise<void>;

}

export const useAccountsStore=create<AccountsState>((set)=>({
    formData:null,
    setFormData:(formData:FormData|null)=>
        set({formData}),

    editingId:null,
    setEditingId:(editingId:number|null)=>
        set({editingId}),

    showForm:false,
    setShowForm:(showForm:boolean)=>
        set({showForm}),

    loading:true,
    setLoading:(loading:boolean)=>
        set({loading}),

    accounts:null,
    setAccounts:(accounts:Account[]|null)=>
        set({accounts}),

    fetchAccounts: async (userId: any) => { set({ loading: true }); try { const { accountsAPI } = await import('@/lib/api'); const res = await accountsAPI.getByUser(userId); set({ accounts: res?.result || [] }); } catch (error: any) { const { toast } = await import('react-hot-toast'); toast.error('Failed to load accounts'); } finally { set({ loading: false }); } }
}))