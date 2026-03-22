// lib/services/user.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { User } from "@/types/open/user.type";

export async function getUserProfile(token?: string): Promise<User | null> {
  if (!token) {
    return null;
  }

  try {
    const user = await apiServerService.get<User>("/users/me", {
      token,  
    });

    console.log("=============================== user =" + user);
    
    
    return user ?? null;
    
  } catch (error) {
    return null;
  }
}