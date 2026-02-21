import { adminAnalyticsApi } from "@/lib/api/admin/analytics"
import { AnalyticsData } from "@/types/analytics.type"
import { useEffect, useState } from "react"

export const useAnalytics = () =>{
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAnalytics = async () => {
        setLoading(true)
        setError(null)
        try{
            const res = await adminAnalyticsApi.getDashboard()
            setData(res)
        }catch(err: any){
            const errorMessage = err?.response?.data?.message || 
                                 err?.message || 
                                 "Failed to fetch analytics"
            setError(errorMessage)
            console.error("Fetch error:", err)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    return {
        data,
        loading,
        error,
        refresh: fetchAnalytics
    }

}