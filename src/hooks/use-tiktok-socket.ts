"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { TikTokEvent, TikTokConnectionState, TikTokComment, TikTokGift, TikTokLike, TikTokMember, TikTokViewerCount, TikTokShare, TikTokFollow, AIResponse, AIConfig } from '@/types/tiktok';

// Helper function to create TikTok events with the correct type
export const createEvent = <T extends TikTokEvent['data']>(
  type: TikTokEvent['type'], 
  data: T
): TikTokEvent => ({ type, data });

interface UseTikTokSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  events: TikTokEvent[];
  connect: () => void;
  disconnect: () => void;
  connectToUser: (username: string) => void;
  disconnectFromUser: () => void;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  clearEvents: () => void;
}

export function useTikTokSocket(): UseTikTokSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<TikTokEvent[]>([]);
  const clientIdRef = useRef<string>(`client-${Math.random().toString(36).substring(2, 15)}`);
  const connectingRef = useRef<boolean>(false);
  
  // Connect to socket.io server
  const connect = useCallback(() => {
    // Prevent duplicate connection attempts
    if (socket || connectingRef.current) {
      return;
    }
    
    connectingRef.current = true;
    setIsConnecting(true);
    setError(null);
    
    // Use socket.io-client with proper settings
    const socketInstance = io({
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
      reconnection: true,
      extraHeaders: {
        'x-client-id': clientIdRef.current
      }
    });
    
    let reconnectAttempts = 0;
    
    socketInstance.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setIsConnecting(false);
      connectingRef.current = false;
      setError(null);
      reconnectAttempts = 0;
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setError('Socket disconnected');
    });
    
    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(`Connection error: ${err.message}`);
      setIsConnecting(false);
      
      // Handle reconnection logic manually if needed
      reconnectAttempts++;
      if (reconnectAttempts > 5) {
        console.log('Max reconnect attempts reached, giving up');
        socketInstance.disconnect();
      }
    });
    
    // TikTok specific events
    socketInstance.on('connected', (state) => {
      console.log('Socket connected event received:', state);
      
      // Extract the username from the state object
      const username = state?.uniqueId || 'unknown';
      const roomId = state?.roomId || 'unknown';
      
      // Create a proper connection state event
      const connectionEvent = createEvent('connection', {
        state: 'CONNECTED',
        targetUniqueId: username,
        roomId: roomId
      });
      
      console.log('Creating connection event:', connectionEvent);
      
      // Add the event to the events array
      setEvents(prev => [...prev, connectionEvent]);
      
      // Update connection status
      setIsConnecting(false);
      setIsConnected(true);
      setError(null);
    });
    
    socketInstance.on('error', (data) => {
      setError(data.error || 'Unknown error');
      setEvents(prev => [...prev, createEvent('connection', {
        state: 'FAILED',
        serverError: data.error,
      })]);
    });
    
    socketInstance.on('chat', (data) => {
      setEvents(prev => [...prev, createEvent('comment', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('gift', (data) => {
      setEvents(prev => [...prev, createEvent('gift', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('like', (data) => {
      setEvents(prev => [...prev, createEvent('like', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('member', (data) => {
      setEvents(prev => [...prev, createEvent('member', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('share', (data) => {
      setEvents(prev => [...prev, createEvent('share', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('follow', (data) => {
      setEvents(prev => [...prev, createEvent('follow', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('roomUser', (data) => {
      setEvents(prev => [...prev, createEvent('viewerCount', {
        viewerCount: data.viewerCount,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    socketInstance.on('aiResponse', (data) => {
      setEvents(prev => [...prev, createEvent('aiResponse', {
        ...data,
        timestamp: data.timestamp || Date.now()
      })]);
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);
  
  // Disconnect from socket.io server
  const disconnect = useCallback(() => {
    if (!socket) return;
    
    socket.disconnect();
    setSocket(null);
    setIsConnected(false);
    connectingRef.current = false;
  }, [socket]);
  
  // Connect to a TikTok user
  const connectToUser = useCallback((username: string) => {
    if (!socket) {
      setError('Socket not connected');
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    // Add connection event to state
    setEvents(prev => [...prev, createEvent('connection', {
      state: 'CONNECTING',
      targetUniqueId: username
    })]);
    
    // Emit connection request to server
    socket.emit('connectToUser', { username });
  }, [socket]);
  
  // Disconnect from TikTok user
  const disconnectFromUser = useCallback(() => {
    if (!socket) return;
    
    // Get the last connected event to extract the username
    const lastConnectionEvent = events
      .filter(e => e.type === 'connection' && (e.data as any).state === 'CONNECTED')
      .pop();
    
    const username = lastConnectionEvent ? (lastConnectionEvent.data as any).targetUniqueId : null;
    
    // Add disconnection event to state with the username
    setEvents(prev => [...prev, createEvent('connection', {
      state: 'DISCONNECTED',
      targetUniqueId: username
    })]);
    
    // Emit disconnection to server
    socket.emit('disconnectFromUser');
  }, [socket, events]);
  
  // Update AI configuration
  const updateAIConfig = useCallback((config: Partial<AIConfig>) => {
    if (!socket) return;
    
    socket.emit('updateAIConfig', config);
  }, [socket]);
  
  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  
  // Auto-connect to socket.io on mount
  useEffect(() => {
    const hasConnected = connectingRef.current || socket;
    if (!hasConnected) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  // Limit events array to the last 100 events
  useEffect(() => {
    if (events.length > 100) {
      setEvents(prev => prev.slice(-100));
    }
  }, [events]);
  
  return {
    socket,
    isConnected,
    isConnecting,
    error,
    events,
    connect,
    disconnect,
    connectToUser,
    disconnectFromUser,
    updateAIConfig,
    clearEvents,
  };
} 