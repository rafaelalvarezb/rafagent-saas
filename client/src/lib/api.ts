// API Configuration for Production
// All API calls go through Vercel rewrites (same-origin)

// In production, use /api prefix (Vercel rewrites handle it)
// In development, use Railway backend directly
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api' // Vercel rewrites /api/* to Railway
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Token management utilities
const TOKEN_KEY = 'rafagent_token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Helper to make API calls with credentials and JWT token
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    credentials: 'include', // Important for cookies/sessions
    headers,
  });
}
