// app/actions/invoice.actions.ts
"use server";

import { cookies } from "next/headers";
import { API } from "@/lib/config/constants";

export async function downloadInvoice(orderNumber: string): Promise<ArrayBuffer> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const token = cookieStore.get('token')?.value;
    
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (sessionId) headers['Cookie'] = `sessionId=${sessionId}`;
    
    const url = `${API.BASE_URL}/api/${API.VERSION}/invoices/${orderNumber}`;
    
    const res = await fetch(url, { headers, credentials: 'include' });
    return await res.arrayBuffer();
}