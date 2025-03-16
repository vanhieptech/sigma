import { NextResponse } from 'next/server';
import { Socket } from 'socket.io';
import { WebcastPushConnection } from 'tiktok-live-connector';
import { getIO, getConnections } from '@/lib/socketio';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const io = getIO();

    if (!io) {
      return NextResponse.json({ error: 'Socket.IO server not initialized' }, { status: 500 });
    }

    // Set up event handlers if they haven't been set up yet
    if (io.listeners('connection').length === 0) {
      io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Handle connection request from client
        socket.on('connectToUser', async data => {
          try {
            const username = data.username;
            console.log(`Socket ${socket.id} connecting to TikTok user: ${username}`);

            const connections = getConnections();

            // Disconnect existing connection if any
            if (connections?.has(socket.id)) {
              connections.get(socket.id)?.disconnect();
              connections.delete(socket.id);
            }

            // Create new connection
            const tiktokConnection = new WebcastPushConnection(username);

            // Connect to TikTok live
            const state = await tiktokConnection.connect();

            // Store connection
            connections?.set(socket.id, tiktokConnection);

            // Send connection success to client
            socket.emit('connected', {
              isConnected: true,
              isConnecting: false,
              roomId: state.roomId,
              uniqueId: username,
              error: null,
            });

            // Forward TikTok events to the client
            tiktokConnection.on('chat', data => {
              socket.emit('chat', {
                ...data,
                timestamp: Date.now(),
              });
            });

            tiktokConnection.on('gift', data => {
              socket.emit('gift', {
                ...data,
                timestamp: Date.now(),
              });
            });

            tiktokConnection.on('like', data => {
              socket.emit('like', {
                ...data,
                timestamp: Date.now(),
              });
            });

            tiktokConnection.on('follow', data => {
              socket.emit('follow', {
                ...data,
                timestamp: Date.now(),
              });
            });

            tiktokConnection.on('share', data => {
              socket.emit('share', {
                ...data,
                timestamp: Date.now(),
              });
            });

            tiktokConnection.on('member', data => {
              socket.emit('member', {
                ...data,
                timestamp: Date.now(),
              });
            });

            tiktokConnection.on('roomUser', data => {
              socket.emit('roomUser', {
                viewerCount: data.viewerCount,
                timestamp: Date.now(),
              });
            });

            // Handle connection errors
            tiktokConnection.on('error', err => {
              console.error(`TikTok connection error for ${username}:`, err);
              socket.emit('error', {
                isConnected: false,
                isConnecting: false,
                error: err.toString(),
              });
            });

            // Handle disconnection
            tiktokConnection.on('streamEnd', () => {
              socket.emit('error', {
                isConnected: false,
                isConnecting: false,
                error: 'Stream ended',
              });
            });
          } catch (error) {
            console.error('Failed to connect to TikTok:', error);
            socket.emit('error', {
              isConnected: false,
              isConnecting: false,
              error: error instanceof Error ? error.message : 'Failed to connect to TikTok',
            });
          }
        });

        // Handle AI configuration updates
        socket.on('updateAIConfig', config => {
          console.log(`Socket ${socket.id} updating AI configuration:`, config);
          // In a real implementation, this would update AI config in the server
        });

        // Handle AI personality setup
        socket.on('setupAIPersonality', personality => {
          console.log(`Socket ${socket.id} setting up AI personality:`, personality);
          // In a real implementation, this would set up AI personality
        });

        // Handle product catalog setup
        socket.on('setupCatalog', products => {
          console.log(`Socket ${socket.id} setting up product catalog:`, products);
          // In a real implementation, this would set up product catalog
        });

        // Handle disconnect request from client
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
          const connections = getConnections();

          if (connections?.has(socket.id)) {
            connections.get(socket.id)?.disconnect();
            connections.delete(socket.id);
          }
        });
      });
    }

    return NextResponse.json({ status: 'Socket.IO server is running' });
  } catch (error) {
    console.error('Failed to initialize Socket.IO:', error);
    return NextResponse.json({ error: 'Failed to initialize Socket.IO server' }, { status: 500 });
  }
}

// Handle WebSocket upgrade requests
export async function POST() {
  return GET();
}
