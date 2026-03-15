import { publicBannerApi } from "@/lib/open/banner";
import { Banner } from "@/types/open/banner.type";
import { useCallback, useEffect, useState } from "react";

export const useBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await publicBannerApi.getActiveBanners();
      setBanners(res);
    } catch (err: any) {
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchBanners();
  }, []);

  return { banners, loading, error, fetchBanners };
};
