import {create} from 'zustand'
import { Account, FormData } from '../types/accounts.types'
import { useAuth } from '@/context/AuthContext'


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

    user:typeof useAuth|null;
    isAuthenticated:(user:typeof useAuth|null)=>void;

}

export const AccountsStore=create<AccountsState>((set)=>({
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

    user:null,
    isAuthenticated:(user:typeof useAuth|null)=>
        set({user})
}))