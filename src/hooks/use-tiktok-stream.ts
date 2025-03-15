"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TikTokComment, 
  TikTokGift, 
  TikTokLike,
  TikTokShare,
  TikTokFollow,
  TikTokMember,
  TikTokViewerCount,
  TikTokConnectionState,
  TikTokEvent,
  AIConfig
} from '@/types/tiktok';
import { useTikTokSocket } from './use-tiktok-socket';

interface UseTikTokStreamProps {
  initialAIConfig?: Partial<AIConfig>;
}

interface UseTikTokStreamReturn {
  events: TikTokEvent[];
  connectionState: TikTokConnectionState;
  viewerCount: number;
  aiConfig: AIConfig;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  connect: (uniqueId: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  uniqueId: string | null;
  error: string | null;
}

export function useTikTokStream({ 
  initialAIConfig 
}: UseTikTokStreamProps = {}): UseTikTokStreamReturn {
  // Use the socket connection
  const { 
    events: socketEvents, 
    connectToUser, 
    disconnectFromUser, 
    updateAIConfig: updateSocketAIConfig,
    error: socketError,
    isConnected: socketIsConnected,
    isConnecting: socketIsConnecting
  } = useTikTokSocket();
  
  const [events, setEvents] = useState<TikTokEvent[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<TikTokConnectionState>({
    state: 'DISCONNECTED'
  });
  
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    enableAIResponses: true,
    respondToComments: true,
    respondToGifts: true,
    respondToLikes: false,
    respondToFollows: true,
    respondToShares: true,
    respondToJoins: false,
    respondToPurchases: true,
    giftThreshold: 50, // Only respond to gifts with diamond value >= 50
    likeThreshold: 5, // Only respond to likes with count >= 5
    joinResponseRate: 0.1, // Respond to 10% of joins
    ...initialAIConfig
  });
  
  // Handle update of AI configuration
  const updateAIConfig = useCallback((config: Partial<AIConfig>) => {
    setAIConfig(prev => {
      const newConfig = { ...prev, ...config };
      updateSocketAIConfig(newConfig);
      return newConfig;
    });
  }, [updateSocketAIConfig]);
  
  // Connect to a TikTok live stream
  const connect = useCallback((targetUniqueId: string) => {
    // Reset events
    setEvents([]);
    
    // Update local state
    setUniqueId(targetUniqueId);
    
    // Update connection state to connecting
    setConnectionState({
      state: 'CONNECTING',
      targetUniqueId
    });
    
    // Connect to TikTok user via socket
    connectToUser(targetUniqueId);
  }, [connectToUser]);
  
  // Disconnect from a TikTok live stream
  const disconnect = useCallback(() => {
    // Update state
    setConnectionState({
      state: 'DISCONNECTED'
    });
    
    // Reset uniqueId
    setUniqueId(null);
    
    // Disconnect from TikTok user via socket
    disconnectFromUser();
  }, [disconnectFromUser]);
  
  // Update events from socket
  useEffect(() => {
    console.log('use-tiktok-stream - Received socket events:', socketEvents.length, socketEvents);
    
    // First, set all events
    setEvents(socketEvents);
    
    // Find the latest connection state event
    const connectionEvents = socketEvents.filter(event => event.type === 'connection');
    if (connectionEvents.length > 0) {
      const latestConnectionEvent = connectionEvents[connectionEvents.length - 1];
      console.log('use-tiktok-stream - Latest connection event:', latestConnectionEvent);
      
      // Update connection state
      const connectionData = latestConnectionEvent.data as TikTokConnectionState;
      setConnectionState(connectionData);
      
      // If we've just connected, update the uniqueId
      if (connectionData.state === 'CONNECTED' && connectionData.targetUniqueId) {
        console.log('Setting uniqueId to:', connectionData.targetUniqueId);
        setUniqueId(connectionData.targetUniqueId);
      }
    }
    
    // Find the latest viewer count event
    const viewerCountEvents = socketEvents.filter(event => event.type === 'viewerCount');
    if (viewerCountEvents.length > 0) {
      const latestViewerCountEvent = viewerCountEvents[viewerCountEvents.length - 1];
      setViewerCount((latestViewerCountEvent.data as TikTokViewerCount).viewerCount);
    }
  }, [socketEvents]);
  
  // No longer need this effect since we handle uniqueId update above
  useEffect(() => {
    console.log('Connection state changed:', connectionState);
  }, [connectionState]);
  
  return {
    events,
    connectionState,
    viewerCount,
    aiConfig,
    updateAIConfig,
    connect,
    disconnect,
    isConnected: connectionState.state === 'CONNECTED',
    uniqueId,
    error: socketError || (connectionState.state === 'FAILED' ? connectionState.serverError || 'Connection failed' : null)
  };
} 