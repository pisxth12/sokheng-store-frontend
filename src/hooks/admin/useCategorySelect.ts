import { adminCategoryApi } from "@/lib/admin/category";
import { CategorySelect } from "@/types/admin/category.type";
import { useCallback, useState } from "react";

export const useCategorySelect = () => {
  const [categories, setCategories] = useState<CategorySelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadCategories = useCallback(async () => {
    if (loaded) return;

    setLoading(true);
    try {
      const res = await adminCategoryApi.selectCategories();
      setCategories(res);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  return {
    categories,
    loading,
    loadCategories,
  };
};