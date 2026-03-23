// lib/services/user.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { User } from "@/types/open/user.type";
import { cookies } from "next/headers";

export async function getUserProfile(): Promise<User | null> {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }
  try {
      const user = await apiServerService.get<User>("/users/me", {
        token,  
      });

      return user ?? null;

    } catch (error) {
    return null;
  }
}