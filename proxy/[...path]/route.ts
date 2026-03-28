// app/api/proxy/[...path]/route.ts
import { API } from '@/lib/config/constants';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = API.FULL_URL;

export async function GET(req: NextRequest, { params }: any) {
  return handleRequest(req, params, 'GET');
}

export async function POST(req: NextRequest, { params }: any) {
  return handleRequest(req, params, 'POST');
}

export async function PUT(req: NextRequest, { params }: any) {
  return handleRequest(req, params, 'PUT');
}

export async function DELETE(req: NextRequest, { params }: any) {
  return handleRequest(req, params, 'DELETE');
}

async function handleRequest(req: NextRequest, params: any, method: string) {
  const path = params.path?.join('/') || '';
  const url = `${BASE_URL}/${path}`; 

  console.log('Proxying to:', url);
  
  const cookieHeader = req.headers.get('cookie') || '';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    body: method !== 'GET' ? await req.text() : undefined,
  });

  const data = await res.text();

  const response = new NextResponse(data, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
    },
  });

  // Forward cookies
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
}

