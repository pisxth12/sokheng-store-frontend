import { useCallback, useEffect, useState } from "react";

export default function useRecentSearch(limit: number = 5){
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        if(typeof window === "undefined") return;
        const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
        setRecentSearches(stored);
    },[]);

    const addRecent = useCallback((keyword: string) => {
    if (!keyword.trim()) return;

    setRecentSearches(prev => {
        const updated = [keyword, ...prev.filter(item => item !== keyword)].slice(0, limit);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
    });
}, [limit]);


    const removeRecent = useCallback((keyword: string) => {
            setRecentSearches((prev) => {
                const updated = prev.filter((item) => item !== keyword);
                localStorage.setItem("recentSearches", JSON.stringify(updated));
                return updated;
            })
    },[])

    const clearRecent = useCallback(() => {
        localStorage.removeItem("recentSearches");
        setRecentSearches([]);
    }, []);


    return { recentSearches, addRecent, removeRecent , clearRecent};
}