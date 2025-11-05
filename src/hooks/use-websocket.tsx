import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const [connectionFailed, setConnectionFailed] = useState(false);
  const connectionAttempts = useRef(0);
  const maxAttempts = 3;

  useEffect(() => {
    if (!user) {
      console.log('❌ No user found, skipping WebSocket connection');
      return;
    }

    // Disable WebSocket in production - Railway has compatibility issues
    // Using polling as reliable fallback (updates every 3 seconds)
    if (import.meta.env.PROD) {
      console.log('⚠️ WebSocket disabled in production - using polling for reliable updates');
      return;
    }

    // Use localhost in development only
    const wsUrl = 'http://localhost:3000';
    
    console.log('🔌 Attempting to connect to WebSocket:', wsUrl);
    console.log('👤 User ID:', user.id);

    // Initialize WebSocket connection
    const socket = io(wsUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: maxAttempts,
      transports: ['polling', 'websocket'], // Start with polling, then upgrade to websocket
      timeout: 20000, // 20 second timeout
      path: '/socket.io/',
      autoConnect: true,
      upgrade: true, // Allow transport upgrade
      rememberUpgrade: true, // Remember successful upgrade
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      const transport = socket.io.engine.transport.name;
      console.log('✅ WebSocket connected successfully!');
      console.log('🚀 Transport type:', transport);
      console.log('📍 Connected to:', socket.io.uri);
      connectionAttempts.current = 0; // Reset counter on successful connection
      
      // Join user-specific room
      socket.emit('join', user.id);
      console.log('📤 Sent join event for user:', user.id);
    });

    // Listen for transport upgrade (polling → websocket)
    socket.io.engine.on('upgrade', (transport) => {
      console.log('⬆️ Transport upgraded to:', transport.name);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      connectionAttempts.current += 1;
      console.error(`❌ WebSocket connection error (attempt ${connectionAttempts.current}/${maxAttempts}):`, error.message);
      
      if (connectionAttempts.current >= maxAttempts) {
        console.log('⚠️ Max connection attempts reached. Falling back to polling only.');
        setConnectionFailed(true);
      }
    });

    socket.on('reconnect_error', (error) => {
      console.error('🔄 WebSocket reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.log('⚠️ WebSocket reconnection failed - using polling as fallback');
      setConnectionFailed(true);
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

