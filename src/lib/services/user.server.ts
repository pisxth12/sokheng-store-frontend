import "server-only";
import { apiServerService } from "../api/server";
import { User } from "@/types/open/user.type";

export async function getUserProfile(sessionId?: string): Promise<User | null> {

  if (!sessionId) {
    return null;
  }

  try {
    const user = await apiServerService.get<User>("/users/me", {
      sessionId,
      cacheTime: 60, 
    });
    
    return user ?? null;
    
  } catch (error) {
    console.error("❌ Failed to fetch user profile:", {
      error: error instanceof Error ? error.message : "Unknown error",
      sessionId: sessionId ? "present" : "missing",
      timestamp: new Date().toISOString()
    });
    
    return null;
  }
}