import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiCall, API_BASE_URL } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
}

interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

// Token management utilities
const TOKEN_KEY = 'rafagent_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Check for token in URL after OAuth redirect
function checkForTokenInUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    setToken(token);
    // Clean up URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Check for token in URL on mount
  React.useEffect(() => {
    checkForTokenInUrl();
  }, []);

  const { data, isLoading, error } = useQuery<AuthStatus>({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const token = getToken();
      if (!token) {
        return { authenticated: false };
      }

      const response = await apiCall('/auth/status');
      
      if (!response.ok) {
        // Token is invalid, remove it
        removeToken();
        throw new Error('Failed to check auth status');
      }
      
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    onSuccess: async (data) => {
      // Auto-detect and set timezone when user successfully authenticates
      if (data.authenticated && data.user) {
        try {
          // Detect timezone from browser
          const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
          // Only update if different from current timezone
          if (detectedTimezone && detectedTimezone !== data.user.timezone) {
            // Set timezone in background (don't await, fire and forget)
            apiCall('/user/timezone', {
              method: 'POST',
              body: JSON.stringify({ timezone: detectedTimezone })
            }).catch(err => {
              // Silently fail - user can set it manually
              console.log('Auto timezone detection failed (user can set manually):', err);
            });
          }
        } catch (err) {
          // Silently fail - user can set it manually in Configuration
          console.log('Could not auto-detect timezone (user can set manually):', err);
        }
      }
    }
  });

  const login = () => {
    // Redirect to Railway backend for OAuth
    window.location.href = `${API_BASE_URL}/auth/google/redirect`;
  };

  const logout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      queryClient.setQueryData(['auth-status'], { authenticated: false });
      setLocation('/login');
    }
  };

  return {
    user: data?.user,
    isAuthenticated: data?.authenticated || false,
    isLoading,
    error,
    login,
    logout,
  };
}

/**
 * Component wrapper that requires authentication
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  return <>{children}</>;
}

