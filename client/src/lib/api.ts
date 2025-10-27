// API Configuration for Production
// All API calls go through Vercel rewrites (same-origin)

// In production, use /api prefix (Vercel rewrites handle it)
// In development, use Railway backend directly
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api' // Vercel rewrites /api/* to Railway
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Helper to make API calls with credentials
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  return fetch(url, {
    ...options,
    credentials: 'include', // Important for cookies/sessions
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
