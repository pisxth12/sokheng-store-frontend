import { Brand } from "@/types/admin/brand.type";
import { Plus } from "lucide-react";

interface NoBrandProps {
    searchInput: string;
    handleClearSearch: () => void;
    handleAdd: () => void;
}

export const NoBrand = ({ searchInput, handleClearSearch, handleAdd }: NoBrandProps) => {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            {searchInput ? (
                <div>
                    <p className="text-gray-600">
                        No brands found for "{searchInput}"
                    </p>
                    <button
                        onClick={handleClearSearch}
                        className="mt-2 text-sm text-gray-900 underline hover:no-underline"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600">No brands yet</p>
                    <button
                        onClick={handleAdd}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create your first brand
                    </button>
                </div>
            )}
        </div>
    );
};