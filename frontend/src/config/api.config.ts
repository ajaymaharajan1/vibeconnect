export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://vibeconnect-qoyv.onrender.com';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vibeconnect_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
