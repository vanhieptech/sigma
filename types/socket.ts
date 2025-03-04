import { TikTokConnectionWrapper } from '@/server/connections/tiktok-connection-wrapper'

export interface IPCounts {
  [key: string]: number
}

export interface Options {
  enableExtendedGiftInfo?: boolean
  enableWebsocketUpgrade?: boolean
  enableRequestPolling?: boolean
  requestPollingIntervalMs?: number
  sessionId?: string
  clientParams?: { [key: string]: string | number }
  requestHeaders?: { [key: string]: string }
  websocketHeaders?: { [key: string]: string }
  processInitialData?: boolean
  enableLog?: boolean
  enablePrivateMessage?: boolean
}

export interface TikTokConnectionState {
  isConnected: boolean
  isConnecting: boolean
  roomId?: string
  error: string | null
}


export interface TikTokConnectionManager {
  [socketId: string]: {
    connection: TikTokConnectionWrapper | null;
    uniqueId: string | null;
  };
}