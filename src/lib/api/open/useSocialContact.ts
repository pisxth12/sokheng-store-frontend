import apiClient from "@/lib/api/open/client";
import { ContactSocialResponse } from "@/types/open/socialsContact.type";

export const publicSocialsContact = {
   

    getAllContacts: async (): Promise<ContactSocialResponse> => {
    const response = await apiClient.get<ContactSocialResponse>('/contacts');
    return response.data;
  }
}