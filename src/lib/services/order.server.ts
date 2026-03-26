// lib/api/order.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { cookies } from "next/headers";

export async function getOrderCount(): Promise<number> {
  
  try {
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("JSESSIONID")?.value; 
    const token = cookieStore.get("token")?.value;
    
    if (!sessionId && !token) {
      return 0;
    }
    const options = token ? { token } : { sessionId };



    const count = await apiServerService.get<number>("/orders/count", options);
    return count ?? 0;
  } catch {
    return 0;
  }
}