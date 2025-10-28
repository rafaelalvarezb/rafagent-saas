import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

export function usePolling() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;

    // Poll every 3 seconds for updates
    intervalRef.current = setInterval(() => {
      console.log('🔄 Polling for updates...');
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, queryClient]);

  return null;
}
