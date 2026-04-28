import { SocialLinks, SocialLinksResponse } from "@/types/admin/social.type";
import apiClient from "../api/client";

export const adminSocialLinks = {
  getLinks: async () => {
    const res = await apiClient.get<SocialLinks>("/admin/store/contacts");
    return res.data;
  },

  //update store contacts
  updateLinks: async (data: SocialLinks) => {
    const res = await apiClient.put<SocialLinksResponse>(
      "/admin/store/contacts",
      data,
    );
    return res.data;
  },
};
