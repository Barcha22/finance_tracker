import {create} from 'zustand'
import { FormData,Category } from '../types/categories.types';

interface CategoriesState{
    fetchCategories: (userId: any) => Promise<void>;
    formData:FormData|null;
    setFormData:(formData:FormData|null)=>void;

    editingId:number|null;
    setEditingId:(editingId:number|null)=>void;

    showForm:boolean;
    setShowForm:(showForm:boolean)=>void;

    categories:Category[]|null;
    setCategories:(categories:Category[]|null)=>void;

    loading:boolean;
    setLoading:(loading:boolean)=>void;

    filterType:'all'|'income'|'expense';
    setFilterType:(filterType:'all'|'income'|'expense')=>void;
}

export const useCategoriesStore=create<CategoriesState>((set)=>({
    formData:null,
    setFormData:(formData:FormData|null)=>
        set({formData}),

    editingId:null,
    setEditingId:(editingId:number|null)=>
        set({editingId}),

    showForm:false,
    setShowForm:(showForm:boolean)=>
        set({showForm}),

    categories:null,
    setCategories:(categories:Category[]|null)=>
        set({categories}),

    loading:true,
    setLoading:(loading:boolean)=>
        set({loading}),

    filterType:'all',
    setFilterType:(filterType:'all'|'income'|'expense')=>
        set({filterType}),
    fetchCategories: async (userId: any) => { set({ loading: true }); try { const { categoriesAPI } = await import('@/lib/api'); const res = await categoriesAPI.getByUser(userId); set({ categories: res?.result || [] }); } catch (error: any) { const { toast } = await import('react-hot-toast'); toast.error('Failed to load categories'); } finally { set({ loading: false }); } }

}))