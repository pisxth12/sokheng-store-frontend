import { adminSocialLinks } from "@/lib/api/admin/contacts";
import { SocialLinks } from "@/types/social.type"
import { useEffect, useState } from "react"

export const useSocialLinks = () => {
    const [links, setLinks] = useState<SocialLinks | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const fetchLinks = async () => {
        setSaving(true);
        setError(null); 
        try {
            const data = await adminSocialLinks.getLinks();
            setLinks(data);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 
                                 err?.message || 
                                 "Failed to fetch social links";
            setError(errorMessage);
            console.error("Fetch error:", err);
        } finally {
            setSaving(false);
        }
    }

    const updateLinks = async (data: SocialLinks) => {
        setError(null);
        setSaving(true);
        setSuccess(false);
        try {
            const res = await adminSocialLinks.updateLinks(data);
            setLinks(res);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 
                                 err?.message || 
                                 "Failed to update social links";
            setError(errorMessage);
            console.error("Update error:", err);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    return {
        links,
        saving,
        error,     
        success,
        updateLinks,
        refresh: fetchLinks
    }
}