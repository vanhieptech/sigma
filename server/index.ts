import { TikTokConnectionManager } from '@/types/socket'
import express from 'express'
import { createServer } from 'http'
import next from 'next'
import { Server } from 'socket.io'
import { AIVoiceManager } from '../lib/ai-voice'
import { PurchaseEvent, StreamEventHandler, StreamEventHandlerConfig } from '../lib/stream-event-handler'
import { clientBlocked } from './connections/limiter'
import { TikTokConnectionWrapper } from './connections/tiktok-connection-wrapper'
import { logger } from './utils/logger'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Store active connections
const connections: TikTokConnectionManager = {}
const eventHandlers: Record<string, StreamEventHandler> = {}

// Default configuration for AI responses
const defaultConfig: StreamEventHandlerConfig = {
  enableAIResponses: true,
  respondToComments: true,
  respondToGifts: true,
  respondToLikes: true,
  respondToFollows: true,
  respondToShares: true,
  respondToJoins: true,
  respondToPurchases: true,
  giftThreshold: 10, // Only respond to gifts worth 10+ diamonds
  likeThreshold: 5,  // Only respond to 5+ likes at once
  joinResponseRate: 20 // Only respond to 20% of joins to avoid spam
}

// Initialize AI Voice Manager
const aiManager = AIVoiceManager.getInstance(process.env.OPENAI_API_KEY)

app.prepare().then(() => {
  const server = express()
  const httpServer = createServer(server)

  // Create Socket.IO server
  const io = new Server(httpServer, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    logger.info('Socket connected', socket.id)

    // Check if the client is rate limited
    if (clientBlocked(socket)) {
      logger.warn('Client is rate limited', socket.id)
      socket.emit('error', {
        isConnected: false,
        isConnecting: false,
        error: 'Too many connection attempts. Please try again later.'
      })
      return
    }

    // Store socket connection
    connections[socket.id] = {
      connection: null,
      uniqueId: null
    }

    // Handle product catalog setup
    socket.on('setupCatalog', (products) => {
      logger.info('Setting up product catalog', socket.id)
      
      // Create event handler if it doesn't exist
      if (!eventHandlers[socket.id]) {
        eventHandlers[socket.id] = new StreamEventHandler(socket.id, aiManager, defaultConfig)
        eventHandlers[socket.id].setSocket(socket)
      }
      
      // Add products to catalog
      if (Array.isArray(products)) {
        products.forEach(product => {
          eventHandlers[socket.id].addProductToCatalog(product)
        })
      }
    })

    // Handle AI configuration updates
    socket.on('updateAIConfig', (config) => {
      logger.info('Updating AI config', socket.id)
      
      if (!eventHandlers[socket.id]) {
        eventHandlers[socket.id] = new StreamEventHandler(socket.id, aiManager, {
          ...defaultConfig,
          ...config
        })
        eventHandlers[socket.id].setSocket(socket)
      } else {
        eventHandlers[socket.id].updateConfig(config)
      }
    })

    // Handle AI personality setup
    socket.on('setupAIPersonality', async (personality) => {
      logger.info('Setting up AI personality', socket.id)
      await aiManager.registerPersonality(socket.id, personality)
    })

    // Handle connection to TikTok user
    socket.on('connectToUser', async (data) => {
      const username = data.username
      logger.info('Socket', `Socket ${socket.id} connecting to TikTok user: ${username}`)

      // If there's an existing connection, disconnect it
      if (connections[socket.id]?.connection) {
        connections[socket.id].connection?.disconnect()
        connections[socket.id].connection = null
        connections[socket.id].uniqueId = null
      }

      try {
        // Create a new TikTok connection
        const connection = new TikTokConnectionWrapper(username)
        connections[socket.id].connection = connection
        connections[socket.id].uniqueId = username

        // Create event handler if it doesn't exist
        if (!eventHandlers[socket.id]) {
          eventHandlers[socket.id] = new StreamEventHandler(socket.id, aiManager, defaultConfig)
          eventHandlers[socket.id].setSocket(socket)
        }

        // Connect to TikTok
        connection.connect()
          .then(state => {
            logger.info('Socket', `Socket ${socket.id} connected to TikTok user ${username}`)
            socket.emit('connected', state)

            // Forward TikTok events to the client
            connection.on('chat', (data) => {
              socket.emit('chat', data)
              if (eventHandlers[socket.id]) {
                eventHandlers[socket.id].handleComment(data)
              }
            })

            connection.on('gift', (data) => {
              socket.emit('gift', data)
              if (eventHandlers[socket.id]) {
                eventHandlers[socket.id].handleGift(data)
              }
            })

            connection.on('like', (data) => {
              socket.emit('like', data)
              if (eventHandlers[socket.id]) {
                eventHandlers[socket.id].handleLike(data)
              }
            })

            connection.on('member', (data) => {
              socket.emit('member', data)
              if (eventHandlers[socket.id]) {
                eventHandlers[socket.id].handleMember(data)
              }
            })

            connection.on('share', (data) => {
              socket.emit('share', data)
              if (eventHandlers[socket.id]) {
                eventHandlers[socket.id].handleShare(data)
              }
            })

            connection.on('follow', (data) => {
              socket.emit('follow', data)
              if (eventHandlers[socket.id]) {
                eventHandlers[socket.id].handleFollow(data)
              }
            })

            connection.on('roomUser', (data) => {
              socket.emit('roomUser', data)
            })
          })
          .catch(error => {
            logger.error('Error connecting to TikTok user', error)
            socket.emit('error', {
              isConnected: false,
              isConnecting: false,
              error: error.message || 'Failed to connect to TikTok user'
            })
          })
      } catch (error: any) {
        logger.error('Error creating TikTok connection', error.message)
        socket.emit('error', {
          isConnected: false,
          isConnecting: false,
          error: error.message || 'Failed to create TikTok connection'
        })
      }
    })

    // Handle purchase events
    socket.on('purchase', (data: PurchaseEvent) => {
      logger.info('Purchase event', `Purchase event from user ${data.uniqueId}: ${data.product.name}`)
      socket.emit('purchase', data)
      
      if (eventHandlers[socket.id]) {
        eventHandlers[socket.id].handlePurchase(data)
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info('Socket disconnected', socket.id)
      
      // Clean up TikTok connection
      if (connections[socket.id]?.connection) {
        connections[socket.id].connection?.disconnect()
      }
      
      // Clean up event handler
      if (eventHandlers[socket.id]) {
        delete eventHandlers[socket.id]
      }
      
      // Clean up connection
      delete connections[socket.id]
    })
  })

  // Handle Next.js requests
  server.all('*', (req: express.Request, res: express.Response) => {
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 3000
  httpServer.listen(PORT, () => {
    logger.info('Server started', `> Ready on http://localhost:${PORT}`)
  })
}) 