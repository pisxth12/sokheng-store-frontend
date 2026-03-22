// lib/api/server.ts
import 'server-only';
import { API } from '@/lib/config/constants';

interface FetchOptions extends RequestInit {
  token?: string;
  sessionId?: string;
  cacheTime?: number;
}

export async function apiServer<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { token, sessionId, cacheTime, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  if (sessionId) {
    (headers as Record<string, string>)['X-Session-Id'] = sessionId;
  }

  const url = `${API.BASE_URL}/api/${API.VERSION}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
      next: cacheTime ? { revalidate: cacheTime } : undefined,
    });

    if (!res.ok) {
      return null as T;
    }

    return await res.json();
  } catch (error) {
    console.error(`API Server Error (${endpoint}):`, error);
    throw error;
  }
}

export const apiServerService = {
  get: <T>(endpoint: string, options?: { token?: string; sessionId?: string; cacheTime?: number }) => 
    apiServer<T>(endpoint, { 
      method: 'GET', 
      ...options 
    }),
    
  post: <T>(endpoint: string, data?: any, options?: { token?: string; sessionId?: string }) =>
    apiServer<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data),
      ...options 
    }),
};