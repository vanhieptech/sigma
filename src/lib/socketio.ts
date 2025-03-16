import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { WebcastPushConnection } from 'tiktok-live-connector';

// Socket.IO types for our specific use case
export interface ServerToClientEvents {
  connected: (data: any) => void;
  error: (data: any) => void;
  chat: (data: any) => void;
  gift: (data: any) => void;
  like: (data: any) => void;
  share: (data: any) => void;
  follow: (data: any) => void;
  member: (data: any) => void;
  roomUser: (data: any) => void;
  aiResponse: (data: any) => void;
}

export interface ClientToServerEvents {
  connectToUser: (data: { username: string }) => void;
  updateAIConfig: (config: any) => void;
  setupAIPersonality: (personality: string) => void;
  setupCatalog: (products: any[]) => void;
  purchase: (data: any) => void;
}

// Initialize Socket.IO server if it doesn't exist
export function initSocketIO(server: NetServer) {
  if (!(global as any).io) {
    (global as any).io = new ServerIO<ClientToServerEvents, ServerToClientEvents>(server, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Initialize connections map if it doesn't exist
    (global as any).connections =
      (global as any).connections || new Map<string, WebcastPushConnection>();

    console.log('Socket.IO initialized');
  }

  return (global as any).io;
}

// Get the Socket.IO server instance
export function getIO() {
  return (global as any).io;
}

// Get the TikTok connections map
export function getConnections() {
  return (global as any).connections;
}
