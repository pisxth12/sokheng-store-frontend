import { publicSocialsContact } from "@/lib/api/open/useSocialContact";
import { ContactSocialResponse } from "@/types/open/socialsContact.type";
import { useEffect, useState } from "react";

export const useContact = () => {
  const [contacts, setContacts] = useState<ContactSocialResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    setLoading(true);
    setError("");
    try {
        const data = await publicSocialsContact.getAllContacts();
        setContacts(data);
    } catch (err: any) {
      setError("Failed to load contact");
    } finally {
      setLoading(false);
    }
  };

  return { contacts, loading, error, fetchContact };
};
