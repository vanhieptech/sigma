'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import {
  TikTokEvent,
  TikTokConnectionState,
  TikTokComment,
  TikTokGift,
  TikTokLike,
  TikTokMember,
  TikTokViewerCount,
  TikTokShare,
  TikTokFollow,
  AIResponse,
  AIConfig,
  TikTokEventEnum,
} from '@/types/tiktok';

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
  sendMessage: <T>(event: string, data: T) => Promise<void>;
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
        'x-client-id': clientIdRef.current,
      },
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

    socketInstance.on('connect_error', err => {
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

    // Add custom event handlers
    // TikTok live stream events
    socketInstance.on('tiktok:comment', (data: TikTokComment) => {
      console.log('Received comment:', data);
      addEvent(TikTokEventEnum.Comment, data);
    });

    socketInstance.on('tiktok:gift', (data: TikTokGift) => {
      console.log('Received gift:', data);
      addEvent(TikTokEventEnum.Gift, data);
    });

    socketInstance.on('tiktok:like', (data: TikTokLike) => {
      console.log('Received like:', data);
      addEvent(TikTokEventEnum.Like, data);
    });

    socketInstance.on('tiktok:share', (data: TikTokShare) => {
      console.log('Received share:', data);
      addEvent(TikTokEventEnum.Share, data);
    });

    socketInstance.on('tiktok:follow', (data: TikTokFollow) => {
      console.log('Received follow:', data);
      addEvent(TikTokEventEnum.Follow, data);
    });

    socketInstance.on('tiktok:join', (data: TikTokMember) => {
      console.log('Received join:', data);
      addEvent(TikTokEventEnum.Member, data);
    });

    socketInstance.on('tiktok:viewers', (data: TikTokViewerCount) => {
      console.log('Received viewer count:', data);
      addEvent(TikTokEventEnum.ViewerCount, data);
    });

    // Connection state events
    socketInstance.on('tiktok:connected', (data: TikTokConnectionState) => {
      console.log('TikTok connected:', data);
      addEvent(TikTokEventEnum.Connection, { ...data, state: 'CONNECTED' });
    });

    socketInstance.on('tiktok:connecting', (data: { targetUniqueId: string }) => {
      console.log('TikTok connecting:', data);
      addEvent(TikTokEventEnum.Connection, { ...data, state: 'CONNECTING' });
    });

    socketInstance.on('tiktok:disconnected', (data: { error?: string }) => {
      console.log('TikTok disconnected:', data);
      addEvent(TikTokEventEnum.Connection, { state: 'DISCONNECTED', serverError: data.error });
    });

    // AI response events
    socketInstance.on('ai:response', (data: AIResponse) => {
      console.log('Received AI response:', data);
      addEvent(TikTokEventEnum.AIResponse, data);
    });

    // Enhanced platform events
    socketInstance.on('tiktok:poll', (data: any) => {
      console.log('Received poll data:', data);
      addEvent(TikTokEventEnum.Poll, data);
    });

    socketInstance.on('tiktok:question', (data: any) => {
      console.log('Received question data:', data);
      addEvent(TikTokEventEnum.Question, data);
    });

    socketInstance.on('tiktok:milestone', (data: any) => {
      console.log('Received milestone data:', data);
      addEvent(TikTokEventEnum.Milestone, data);
    });

    // Set socket instance
    setSocket(socketInstance);

    // Helper function to add events
    function addEvent(type: TikTokEvent['type'], data: any) {
      setEvents(prev => [...prev, createEvent(type, data)]);
    }
  }, []);

  // Disconnect from socket.io server
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setError(null);
    }
  }, [socket]);

  // Connect to TikTok user via socket
  const connectToUser = useCallback(
    (username: string) => {
      if (!username || typeof username !== 'string') {
        const errorMsg = 'Invalid username: username must be a non-empty string';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      console.log(`Attempting to connect to TikTok user: @${username}`);

      if (!socket || !isConnected) {
        console.log('Socket not connected, attempting to connect first...');

        // First connect the socket
        connect();

        // Wait for socket to connect before continuing
        const connectionTimeout = setTimeout(() => {
          console.error('Socket connection timed out');
          setError('Socket connection timed out. Please try again.');
          setIsConnecting(false);
        }, 10000); // 10 second timeout

        // Create event listener for socket connection
        const connectHandler = () => {
          console.log('Socket connected, now connecting to TikTok user...');
          clearTimeout(connectionTimeout);

          // Now connect to TikTok user
          if (socket) {
            console.log(`Emitting connectToUser event for @${username}`);
            socket.emit('connectToUser', { username }); // IMPORTANT: Fixed parameter name to match server expectation
          } else {
            console.error('Socket still not available after connection');
            setError('Failed to establish socket connection');
            setIsConnecting(false);
          }
        };

        if (socket) {
          socket.once('connect', connectHandler);
        } else {
          console.error('No socket instance available');
          setError('Failed to create socket connection');
          setIsConnecting(false);
        }
      } else {
        // Socket already connected
        console.log(`Socket already connected, emitting connectToUser event for @${username}`);
        socket.emit('connectToUser', { username }); // IMPORTANT: Fixed parameter name to match server expectation
      }
    },
    [socket, isConnected, connect]
  );

  // Disconnect from TikTok user via socket
  const disconnectFromUser = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('tiktok:disconnect');
    }
  }, [socket, isConnected]);

  // Update AI configuration
  const updateAIConfig = useCallback(
    (config: Partial<AIConfig>) => {
      if (socket && isConnected) {
        socket.emit('ai:config', config);
      }
    },
    [socket, isConnected]
  );

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Send a message to the server
  const sendMessage = useCallback(
    async <T>(event: string, data: T): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socket || !isConnected) {
          reject(new Error('Socket not connected'));
          return;
        }

        socket.emit(event, data, (error: any, response: any) => {
          if (error) {
            console.error(`Error sending ${event}:`, error);
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    },
    [socket, isConnected]
  );

  // Auto-connect on first mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

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
    sendMessage,
  };
}
