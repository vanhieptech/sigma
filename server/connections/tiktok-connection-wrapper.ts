import { Options } from '@/types/socket';
import { EventEmitter } from 'events';
import { WebcastPushConnection } from 'tiktok-live-connector';
import { logger } from '../utils/logger';

let globalConnectionCount = 0;

/**
 * TikTok LIVE connection wrapper with advanced reconnect functionality and error handling
 */
class TikTokConnectionWrapper extends EventEmitter {
  uniqueId: string;
  enableLog?: boolean;
  clientDisconnected = false;
  reconnectEnabled = true;
  reconnectCount = 0;
  reconnectWaitMs = 1000;
  maxReconnectAttempts = 5;
  connection: WebcastPushConnection;

  constructor(uniqueId: string, options?: Options, enableLog?: boolean) {
    super();

    this.uniqueId = uniqueId;
    this.enableLog = enableLog;

    // Connection State
    this.clientDisconnected = false;
    this.reconnectEnabled = true;
    this.reconnectCount = 0;
    this.reconnectWaitMs = 1000;
    this.maxReconnectAttempts = 5;

    logger.info('TikTok', `Creating connection for @${uniqueId} with options:`);
    logger.debug('TikTok', 'Connection options:', options);

    this.connection = new WebcastPushConnection(uniqueId, options);

    this.connection.on('streamEnd', () => {
      logger.warn('TikTok', `Stream ended for @${this.uniqueId}`);
      this.reconnectEnabled = false;
    });

    this.connection.on('disconnected', () => {
      globalConnectionCount -= 1;
      logger.warn('TikTok', `Connection disconnected for @${this.uniqueId}`);
      this.scheduleReconnect();
    });

    this.connection.on('error', err => {
      logger.error('TikTok', `Error in connection for @${this.uniqueId}`, err);
    });

    // Add logging for all events
    const events = ['chat', 'gift', 'like', 'member', 'share', 'follow', 'roomUser'];
    events.forEach(event => {
      this.connection.on(event, data => {
        logger.debug('TikTok', `Received ${event} event for @${this.uniqueId}`, data);
        this.emit(event, data);
      });
    });
  }

  async connect(isReconnect?: boolean) {
    try {
      logger.info(
        'TikTok',
        `${isReconnect ? 'Reconnecting' : 'Connecting'} to @${this.uniqueId}...`
      );

      const state = await this.connection.connect();

      logger.success('TikTok', `${isReconnect ? 'Reconnected' : 'Connected'} to @${this.uniqueId}`);
      logger.debug('TikTok', 'Connection state:', {
        roomId: state.roomId,
        websocket: state.upgradedToWebsocket,
        isReconnect,
      });

      globalConnectionCount += 1;

      // Reset reconnect vars
      this.reconnectCount = 0;
      this.reconnectWaitMs = 1000;

      // Client disconnected while establishing connection => drop connection
      if (this.clientDisconnected) {
        logger.warn(
          'TikTok',
          `Client disconnected during connection, dropping connection for @${this.uniqueId}`
        );
        this.connection.disconnect();
        return;
      }

      logger.debug('TikTok', 'isReconnect:', isReconnect);
      // Notify client
      if (!isReconnect) {
        logger.debug('TikTok', 'Emitting connected event with state:', state);

        // Create a properly formatted state object that matches TikTokConnectionState
        const connectionState = {
          state: 'CONNECTED',
          targetUniqueId: this.uniqueId,
          roomId: state && state.roomId ? state.roomId : 'unknown',
        };

        logger.debug('TikTok', 'Formatted connection state:', connectionState);
        this.emit('connected', connectionState);
      }
    } catch (err) {
      logger.error(
        'TikTok',
        `${isReconnect ? 'Reconnection' : 'Connection'} failed for @${this.uniqueId}`,
        err
      );

      if (isReconnect) {
        // Schedule the next reconnect attempt
        this.scheduleReconnect(err instanceof Error ? err.message : String(err));
      } else {
        // Notify client
        this.emit('disconnected', err instanceof Error ? err.message : String(err));
      }
    }
  }

  scheduleReconnect(reason?: string) {
    if (!this.reconnectEnabled) {
      logger.info('TikTok', `Reconnect disabled for @${this.uniqueId}, not attempting reconnect`);
      return;
    }

    if (this.reconnectCount >= this.maxReconnectAttempts) {
      logger.warn(
        'TikTok',
        `Max reconnect attempts (${this.maxReconnectAttempts}) exceeded for @${this.uniqueId}`
      );
      this.emit('disconnected', `Connection lost. ${reason}`);
      return;
    }

    logger.info(
      'TikTok',
      `Scheduling reconnect for @${this.uniqueId} in ${this.reconnectWaitMs}ms (attempt ${this.reconnectCount + 1}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      if (!this.reconnectEnabled || this.reconnectCount >= this.maxReconnectAttempts) {
        return;
      }

      this.reconnectCount += 1;
      this.reconnectWaitMs *= 2;
      this.connect(true);
    }, this.reconnectWaitMs);
  }

  disconnect() {
    logger.info('TikTok', `Disconnecting @${this.uniqueId}`);

    this.clientDisconnected = true;
    this.reconnectEnabled = false;

    if ((this.connection.getState() as any).isConnected) {
      this.connection.disconnect();
    }
  }
}

const getGlobalConnectionCount = () => {
  return globalConnectionCount;
};

export { getGlobalConnectionCount, TikTokConnectionWrapper };
