// Mock implementation of TikTok Live Client
// This avoids direct import of the problematic library in the browser context

import { WebcastPushConnection as TikTokLiveConnection } from 'tiktok-live-connector';

// Client-side interfaces for TikTok Live data
export interface TikTokComment {
  userId: string;
  uniqueId: string; // Username
  nickname: string; // Display name
  comment: string;
  profilePictureUrl: string;
  timestamp: number;
}

export interface TikTokGift {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  giftId: number;
  giftName: string;
  diamondCount: number;
  repeatCount: number;
  repeatEnd: boolean;
  timestamp: number;
}

export interface TikTokLike {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  likeCount: number;
  totalLikeCount: number;
  timestamp: number;
}

export interface TikTokShare {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  timestamp: number;
}

export interface TikTokFollow {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  timestamp: number;
}

export interface TikTokMember {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  joinType: string;
  timestamp: number;
}

export interface TikTokViewerCount {
  viewerCount: number;
  timestamp: number;
}

export interface TikTokConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  roomId?: string;
  error: string | null;
}

export class TikTokLiveClient {
  private static instance: TikTokLiveClient;
  private connection: TikTokLiveConnection | null = null;
  private username: string = '';
  private connectionState: TikTokConnectionState = {
    isConnected: false,
    isConnecting: false,
    error: null,
  };

  private constructor() {}

  static getInstance(): TikTokLiveClient {
    if (!TikTokLiveClient.instance) {
      TikTokLiveClient.instance = new TikTokLiveClient();
    }
    return TikTokLiveClient.instance;
  }

  async connect(username: string): Promise<TikTokConnectionState> {
    try {
      // Update state
      this.connectionState.isConnecting = true;
      this.username = username;

      // Disconnect existing connection if any
      if (this.connection) {
        this.connection.disconnect();
        this.connection = null;
      }

      // Create new connection
      this.connection = new TikTokLiveConnection(username);

      // Connect and wait for response
      const state = await this.connection.connect();

      // Update connection state
      this.connectionState = {
        isConnected: true,
        isConnecting: false,
        roomId: state.roomId,
        error: null,
      };

      // Set up event handlers
      this.setupEventHandlers();

      return this.connectionState;
    } catch (error) {
      this.connectionState = {
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      throw error;
    }
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
      this.connectionState = {
        isConnected: false,
        isConnecting: false,
        error: null,
      };
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    // Handle disconnection
    this.connection.on('disconnected', () => {
      this.connectionState.isConnected = false;
    });

    // Handle connection error
    this.connection.on('error', (error: unknown) => {
      this.connectionState.error =
        error instanceof Error ? error.message : 'Unknown error occurred';
    });
  }

  onChat(callback: (data: TikTokComment) => void): void {
    if (this.connection) {
      this.connection.on('chat', callback);
    }
  }

  onGift(callback: (data: TikTokGift) => void): void {
    if (this.connection) {
      this.connection.on('gift', callback);
    }
  }

  onLike(callback: (data: TikTokLike) => void): void {
    if (this.connection) {
      this.connection.on('like', callback);
    }
  }

  onRoomUser(callback: (data: TikTokViewerCount) => void): void {
    if (this.connection) {
      this.connection.on('roomUser', callback);
    }
  }

  getUsername(): string {
    return this.username;
  }

  getConnectionState(): TikTokConnectionState {
    return this.connectionState;
  }

  isConnected(): boolean {
    return this.connectionState.isConnected;
  }
}
