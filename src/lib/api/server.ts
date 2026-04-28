// lib/api/server.ts - SIMPLE VERSION (read-only)
import 'server-only';
import { API } from '@/lib/config/constants';
import { cookies } from 'next/headers';

interface FetchOptions extends RequestInit {
  cacheTime?: number;
}

export async function apiServer<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<{ data: T; cookie?: string | null }> {
  const { cacheTime, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  const token = cookieStore.get('token')?.value;

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let cookieHeader = '';
  if (sessionId) {
    cookieHeader = `sessionId=${sessionId}`;
  }

  const url = `${API.BASE_URL}/api/${API.VERSION}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: 'include',
    });


    const cookie = res.headers.get('set-cookie');
    const data = await res.json();

    if (!res.ok) {
      return { data: null as T, cookie };
    }

    return { data, cookie };
  } catch (error) {
    console.error(`API Server Error (${endpoint}):`, error);
    throw error;
  }
}

export const apiServerService = {
  get: <T>(endpoint: string, options?: { cacheTime?: number }) => 
    apiServer<T>(endpoint, { method: 'GET', ...options }),
    
  post: <T>(endpoint: string, data?: any, options?: { cacheTime?: number }) =>
    apiServer<T>(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
  
  put: <T>(endpoint: string, data?: any, options?: { cacheTime?: number }) =>
    apiServer<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
    
  delete: <T>(endpoint: string, options?: { cacheTime?: number }) =>
    apiServer<T>(endpoint, { method: 'DELETE', ...options })
};