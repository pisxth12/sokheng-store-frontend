import apiClient from "./client"

export const publicBannerApi = {
    getActiveBanners : async () => {
        const res = await apiClient.get("/banners");
        return res.data;
    }
}
