import {create} from 'zustand'
import { Category, Transaction,Account,FormData} from '../types/transactions.types';

interface TransactionsState{
    searchTerm:string|null;
    setSearchTerm:(searchTerm:string|null)=>void;

    showFilterPanel:boolean;
    setShowFilterPanel:(showFilterPanel:boolean)=>void;

    filterType:'all' | 'income' | 'expense';
    setFilterType:(filterType:'all' | 'income' | 'expense')=>void;

    activeCategoryId:number|null;
    setActiveCategoryId:(activeCategoryId:number|null)=>void;

    showModal:boolean;
    setShowModal:(showModal:boolean)=>void;

    transactions:Transaction[]|null;
    setTransactions:(transactions:Transaction[]|null)=>void;

    categories:Category[]|null;
    setCategories:(categories:Category[]|null)=>void;

    accounts:Account[]|null;
    setAccounts:(accounts:Account[]|null)=>void;

    formData:FormData|null;
    setFormData:(formData:FormData)=>void;

    loading:boolean;
    setLoading:(loading:boolean)=>void;
    fetchData: (userId: any) => Promise<void>;
}

export const useTransactionsStore=create<TransactionsState>((set)=>({
    searchTerm:null,
    setSearchTerm:(searchTerm:string|null)=>
        set({searchTerm}),

    showFilterPanel:false,
    setShowFilterPanel:(showFilterPanel:boolean)=>
        set({showFilterPanel}),

    filterType:'all',
    setFilterType:(filterType:'all' | 'income' | 'expense')=>
        set({filterType}),

    activeCategoryId:null,
    setActiveCategoryId:(activeCategoryId:number|null)=>
        set({activeCategoryId}),

    showModal:false,
    setShowModal:(showModal:boolean)=>
        set({showModal}),

    transactions:null,
    setTransactions:(transactions:Transaction[]|null)=>
        set({transactions}),

    categories:null,
    setCategories:(categories:Category[]|null)=>
        set({categories}),

    accounts:null,
    setAccounts:(accounts:Account[]|null)=>
        set({accounts}),

    formData:null,
    setFormData:(formData:FormData|null)=>
        set({formData}),

    loading:true,
    
    setLoading:(loading:boolean)=>
        set({loading}),
    fetchData: async (userId: any) => {
        set({ loading: true });
        try {
            const { transactionsAPI, accountsAPI, categoriesAPI } = await import('@/lib/api');
            const [txRes, acRes, catRes] = await Promise.all([
                transactionsAPI.getByUser(userId),
                accountsAPI.getByUser(userId),
                categoriesAPI.getByUser(userId),
            ]);
            set({
                transactions: txRes?.result || [],
                accounts: acRes?.result || [],
                categories: catRes?.result || []
            });
        } catch (error: any) {
            const { toast } = await import('react-hot-toast');
            toast.error('Failed to load data');
        } finally {
            set({ loading: false });
        }
    }
}))
