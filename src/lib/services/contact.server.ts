import { ContactInfo } from "@/types/open/socialsContact.type";
import { apiServerService } from "../api/server";

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const contact = await apiServerService.get<ContactInfo>("/contacts", {
      cacheTime: 3600, // Cache 1 hours
    });
    return contact;
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    return null;
  }
}
