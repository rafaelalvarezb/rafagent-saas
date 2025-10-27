// API Configuration for Production
// All API calls go to Railway backend

// In production, use Railway backend. In development, use local server.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://rafagent-engine-production.up.railway.app'
    : 'http://localhost:3000');

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
