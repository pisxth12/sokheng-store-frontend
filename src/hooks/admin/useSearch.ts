import { SearchContext } from "@/context/SearchContext";
import { Search } from "lucide-react";
import { useContext } from "react";


export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  
  return context;
}