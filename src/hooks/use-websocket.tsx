import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Initialize WebSocket connection
    const socket = io(import.meta.env.PROD ? 'https://rafagent-engine-production.up.railway.app' : 'http://localhost:3000', {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      // Join user-specific room
      socket.emit('join', user.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    // Listen for prospect status changes
    socket.on('prospect:status', (data: { prospectId: string; status: string }) => {
      console.log('📡 Prospect status changed:', data);
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
    });

    // Listen for prospect updates
    socket.on('prospect:update', (prospect: any) => {
      console.log('📡 Prospect updated:', prospect);
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
    });

    // Listen for meeting scheduled events
    socket.on('meeting:scheduled', (data: any) => {
      console.log('📅 Meeting scheduled:', data);
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
      
      // You can also show a toast notification here
      // toast.success(`Meeting scheduled with ${data.contactEmail}!`);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, queryClient]);

  return socketRef.current;
}

