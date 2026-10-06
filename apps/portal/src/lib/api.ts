/**
 * Client Portal API Client
 *
 * Implements hardened session transport:
 * 1. ZERO authentication secrets in localStorage / sessionStorage
 * 2. Secure HttpOnly cookies managed exclusively by the browser (credentials: 'include')
 * 3. Double-Submit CSRF protection on mutating HTTP requests (X-CSRF-Token header)
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

/**
 * Extracts a cookie value by name from document.cookie
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach double-submit CSRF token on mutating requests if present in cookies
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCookie('panacea_csrf');
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      // Credentials: include ensures HttpOnly session cookies are transmitted securely
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
