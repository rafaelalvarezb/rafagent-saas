import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { triggerCelebration } from '@/lib/celebration';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      console.log('❌ No user found, skipping WebSocket connection');
      return;
    }

    // Temporarily disable WebSocket in production due to Railway configuration issues
    if (import.meta.env.PROD) {
      console.log('⚠️ WebSocket disabled in production - using polling instead');
      return;
    }

    const wsUrl = 'http://localhost:3000';
    console.log('🔌 Attempting to connect to WebSocket:', wsUrl);
    console.log('👤 User ID:', user.id);

    // Initialize WebSocket connection
    const socket = io(wsUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'], // Try both transports
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
      console.error('❌ Error details:', {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type,
      });
    });

    socket.on('reconnect_error', (error) => {
      console.error('🔄 WebSocket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('🔄 WebSocket reconnection failed after all attempts');
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
        variant: "success" as any,
      });
      
      // Trigger celebration
      triggerCelebration("meeting", "¡Reunión agendada!");
      
      // Invalidate and refetch prospects query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.refetchQueries({ queryKey: ['prospects'] });
    });
    
    // Also trigger celebration on prospect status change if it's a meeting scheduled
    socket.on('prospect:status', (data: { prospectId: string; status: string }) => {
      console.log('📡 Prospect status changed:', data);
      console.log('🔄 Invalidating and refetching prospects...');
      
      // Show toast notification
      toast({
        title: "Status Updated",
        description: `Prospect status changed to: ${data.status}`,
      });
      
      // Trigger celebration if meeting was scheduled
      if (data.status.includes('Meeting Scheduled')) {
        triggerCelebration("meeting", "¡Reunión agendada!");
      }
      
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
  }, [user, queryClient, toast]);

  return socketRef.current;
}

