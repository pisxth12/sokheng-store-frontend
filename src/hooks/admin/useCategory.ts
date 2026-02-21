import { adminCategoryApi } from "@/lib/api/admin/category";
import { Category } from "@/types/category.type";
import { useEffect, useState } from "react";

export const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    //Pagination state
    const [currentPage,setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

     const fetchCategories = async (page = currentPage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminCategoryApi.getAll(page, pageSize); 
            setCategories(response.content || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
            setCurrentPage(page);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 
                                 err?.message || 
                                 "Failed to fetch categories";
            setError(errorMessage);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const searchCategories = async (query: string, page = 0) =>{
        if(!query.trim()){
            setSearchQuery("");
            fetchCategories(page);
            return;
        }
        setIsSearching(true);
        setError(null);
        try{
            const response = await adminCategoryApi.search(query, page, pageSize);
            setCategories(response.content || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
            setCurrentPage(response.number || 0);
        }catch(err: any){
             const errorMessage = err?.response?.data?.message || 
                                 err?.message || 
                                 "Failed to search categories";
            setError(errorMessage);
        }finally{
            setIsSearching(false);
        }
    }

    const goToPage = async (page: number) => {
        if(page >= 0 && page < totalPages){
            fetchCategories(page);
        }
    }
    const nextPage = async () => {
        if(currentPage < totalPages - 1){
            fetchCategories(currentPage + 1);
        }
    }

    const prevPage = async () => {
        if(currentPage > 0){
            fetchCategories(currentPage - 1);
        }
    }

    const resetSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        fetchCategories();
    }

    
   

    const createCategory = async (data: FormData) => {
        setError(null);
        setSaving(true);
        setSuccess(false);
        try{
            await adminCategoryApi.create(data);
            await fetchCategories(0);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }catch(err: any){
            const errorMessage = err?.response?.data?.message || 
                         err?.response?.data || 
                         err?.message || 
                         "Failed to create category";
    setError(errorMessage);
    throw err;  
        }finally{
            setSaving(false);
        }
    }

    const updateCategory = async (id: number, data: FormData) => {
        setError(null);
        setSaving(true);
        setSuccess(false);
        try{
            await adminCategoryApi.update(id, data);
            await fetchCategories(currentPage);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }catch (err: any){
              const errorMessage = err?.response?.data?.message || 
                         err?.response?.data || 
                         err?.message || 
                         "Failed to create category";
    setError(errorMessage);
    throw err;  

        }finally{
            setSaving(false);
        }
    }

    const deleteCategory = async (id: number) => {
        setError(null);
        setSaving(true);
        setSuccess(false);
        try{
            await adminCategoryApi.delete(id);
            await fetchCategories(currentPage);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }catch(err: any){
           const errorMessage = err?.response?.data?.message || 
                         err?.response?.data || 
                         err?.message || 
                         "Failed to create category";
    setError(errorMessage);
    
    
            throw err;  
        }finally{
            setSaving(false);
        }
    }

    const toggleStatus = async (id: number) => {
        setError(null);
        setSaving(true);
        setSuccess(false);
        try{
            await adminCategoryApi.toggleStatus(id);
            await   fetchCategories(currentPage);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }catch(err: any){
          const errorMessage = err?.response?.data?.message || 
                         err?.response?.data || 
                         err?.message || 
                         "Failed to create category";
    setError(errorMessage);
    throw err;  
        }finally{
            setSaving(false);
        }
    }

    const clearError = () => {
        setError(null);
    }

  



    useEffect(() => {
        fetchCategories();
    }, []);

    return {
         categories,
        loading,
        saving,
        error,
        clearError,
        success,
        
        // Pagination
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        goToPage,
        nextPage,
        prevPage,
        
        // Search
        searchQuery,
        isSearching,
        resetSearch,
        searchCategories,
      
        

        
        // Actions
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        toggleStatus,
        refresh: () => isSearching && searchQuery ? 
            searchCategories(searchQuery, currentPage) : 
            fetchCategories(currentPage)

    }
}