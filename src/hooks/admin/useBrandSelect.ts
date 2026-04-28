import { adminBrandApi } from "@/lib/admin/brand";
import { BrandSelection } from "@/types/admin/brand.type";
import { useCallback, useState } from "react";

export const useBrandSelect = () => {
    const [brands, setBrands] = useState<BrandSelection[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    

    const loadBrands = useCallback(async () => {
        if(loaded) return;
        setLoading(true);
        try {
            const res = await adminBrandApi.selectBrands();
            setBrands(res);
            setLoaded(true);
        }  finally {
            setLoading(false);
        }
    },[loaded]);


    return {
    brands,
    loading,
    loadBrands,
  };
  
    
}