/**
 * Client Portal API Client
 * Connects to Panacea Security API at http://localhost:4000/api/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    requestId: string;
  };
  requestId?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('panacea_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: err.message || 'Unable to connect to security API server.',
        requestId: 'client-offline',
      },
    };
  }
}
