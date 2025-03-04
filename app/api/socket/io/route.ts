import { Server as ServerIO, Socket } from 'socket.io'
import { WebcastPushConnection } from 'tiktok-live-connector'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// Declare global type for Socket.IO instance
declare global {
  var io: ServerIO | undefined
  var connections: Map<string, WebcastPushConnection> | undefined
}

// Initialize connections map if not exists
global.connections = global.connections || new Map<string, WebcastPushConnection>()

export async function GET(req: Request) {
  try {
    if (!global.io) {
      return new Response('Socket.IO server not initialized', {
        status: 500,
      })
    }

    // Set up event handlers if they haven't been set up yet
    if (global.io.listeners('connection').length === 0) {
      global.io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id)

        // Handle connection request from client
        socket.on('connectToUser', async (username: string) => {
          try {
            // Disconnect existing connection if any
            if (global.connections?.has(socket.id)) {
              global.connections.get(socket.id)?.disconnect()
              global.connections.delete(socket.id)
            }

            // Create new connection
            const tiktokConnection = new WebcastPushConnection(username)

            // Connect to TikTok live
            const state = await tiktokConnection.connect()
            
            // Store connection
            global.connections?.set(socket.id, tiktokConnection)

            // Send connection success to client
            socket.emit('connected', {
              isConnected: true,
              isConnecting: false,
              roomId: state.roomId,
              error: null
            })

            // Forward TikTok events to the client
            tiktokConnection.on('chat', (data) => {
              socket.emit('chat', {
                ...data,
                timestamp: Date.now()
              })
            })

            tiktokConnection.on('gift', (data) => {
              socket.emit('gift', {
                ...data,
                timestamp: Date.now()
              })
            })

            tiktokConnection.on('like', (data) => {
              socket.emit('like', {
                ...data,
                timestamp: Date.now()
              })
            })

            tiktokConnection.on('roomUser', (data) => {
              socket.emit('roomUser', {
                viewerCount: data.viewerCount,
                timestamp: Date.now()
              })
            })

          } catch (error) {
            console.error('Failed to connect to TikTok:', error)
            socket.emit('error', {
              isConnected: false,
              isConnecting: false,
              error: error instanceof Error ? error.message : 'Failed to connect to TikTok'
            })
          }
        })

        // Handle disconnect request from client
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id)
          if (global.connections?.has(socket.id)) {
            global.connections.get(socket.id)?.disconnect()
            global.connections.delete(socket.id)
          }
        })
      })
    }

    return new Response('Socket.IO server is running', {
      status: 200,
    })
  } catch (error) {
    console.error('Failed to initialize Socket.IO:', error)
    return new Response('Failed to initialize Socket.IO server', {
      status: 500,
    })
  }
}

// Handle WebSocket upgrade requests
export async function POST(req: Request) {
  return GET(req)
} 