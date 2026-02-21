import { adminDashboardApi } from "@/lib/api/admin/dashboard";
import { DashboardSummary } from "@/types/dashboard.type";
import { useEffect, useState } from "react";

export const useDashboard = () => {
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminDashboardApi.getSummary();
            setData(response);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch summary";
            setError(errorMessage);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSummary();
    }, []);

    return {
        data,
        loading,
        error,
        refresh: fetchSummary
    }


}