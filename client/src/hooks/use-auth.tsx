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

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AuthStatus>({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const response = await apiCall('/api/auth/status');
      if (!response.ok) {
        throw new Error('Failed to check auth status');
      }
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });

  const login = () => {
    // Redirect to Railway backend for OAuth
    window.location.href = `${API_BASE_URL}/api/auth/google/redirect`;
  };

  const logout = async () => {
    try {
      await apiCall('/api/auth/logout', { method: 'POST' });
      queryClient.setQueryData(['auth-status'], { authenticated: false });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
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

