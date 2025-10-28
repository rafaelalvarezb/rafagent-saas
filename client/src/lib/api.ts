// API Configuration for Production
// All API calls go through Vercel rewrites (same-origin)

// Always use /api prefix in Vercel (rewrites handle it)
// This ensures we don't try to connect to localhost in production
export const API_BASE_URL = '/api';

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
