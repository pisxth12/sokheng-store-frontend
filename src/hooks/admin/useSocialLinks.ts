// hooks/admin/useSocialLinks.ts
import { adminSocialLinks } from "@/lib/admin/contacts";
import { SocialLinks } from "@/types/admin/social.type";
import { useEffect, useState, useRef } from "react";


let cachedLinks: SocialLinks | null = null;
let fetchPromise: Promise<SocialLinks> | null = null;

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLinks | null>(cachedLinks);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fetchedRef = useRef(false);

  const fetchLinks = async () => {
    
    if (cachedLinks) {
      setLinks(cachedLinks);
      return;
    }

    
    if (fetchPromise) {
      await fetchPromise;
      setLinks(cachedLinks);
      return;
    }

    setSaving(true);
    setError(null);
    
    fetchPromise = adminSocialLinks.getLinks()
      .then(data => {
        cachedLinks = data;
        setLinks(data);
        return data;
      })
      .catch((err: any) => {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch social links";
        setError(errorMessage);
        throw err;
      })
      .finally(() => {
        setSaving(false);
        fetchPromise = null;
      });

    await fetchPromise;
  };

  const updateLinks = async (data: SocialLinks) => {
    setError(null);
    setSaving(true);
    setSuccess(false);
    try {
      const res = await adminSocialLinks.updateLinks(data);
      cachedLinks = res; 
      setLinks(res);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update social links";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchLinks();
    }
  }, []);

  return {
    links,
    saving,
    error,
    success,
    updateLinks,
    refresh: fetchLinks,
  };
};