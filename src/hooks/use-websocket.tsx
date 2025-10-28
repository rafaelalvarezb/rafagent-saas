import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

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
      console.log('🔌 WebSocket connected to:', socket.io.uri);
      // Join user-specific room
      socket.emit('join', user.id);
      console.log('📤 Sent join event for user:', user.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    // Listen for prospect status changes
    socket.on('prospect:status', (data: { prospectId: string; status: string }) => {
      console.log('📡 Prospect status changed:', data);
      console.log('🔄 Invalidating and refetching prospects...');
      
      // Show toast notification
      toast({
        title: "Status Updated",
        description: `Prospect status changed to: ${data.status}`,
      });
      
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
    });

    // Listen for prospect updates
    socket.on('prospect:update', (prospect: any) => {
      console.log('📡 Prospect updated:', prospect);
      console.log('🔄 Invalidating and refetching prospects...');
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
    });

    // Listen for meeting scheduled events
    socket.on('meeting:scheduled', (data: any) => {
      console.log('📅 Meeting scheduled:', data);
      console.log('🔄 Invalidating and refetching prospects...');
      
      // Show toast notification
      toast({
        title: "Meeting Scheduled! 🎉",
        description: `Meeting scheduled with ${data.contactEmail || 'prospect'}`,
      });
      
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
    });

    // Add a general event listener to catch all events
    socket.onAny((eventName, ...args) => {
      console.log('📡 WebSocket event received:', eventName, args);
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

