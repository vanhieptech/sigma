import { IPCounts } from '@/types/socket'
import { Server, Socket } from 'socket.io'

const MAX_CONNECTIONS_PER_IP = 3
const ipCounts: IPCounts = {}

export function clientBlocked(socket: Socket): boolean {
  // Get IP from various possible sources
  const ip = 
    socket.handshake.headers['x-forwarded-for'] || 
    socket.handshake.headers['x-real-ip'] ||
    socket.handshake.address ||
    'unknown'

  const clientIp = Array.isArray(ip) ? ip[0] : ip

  if (clientIp === 'unknown') {
    console.warn('LIMITER: Unable to determine client IP, allowing connection')
    return false
  }

  // Initialize count for this IP
  if (!ipCounts[clientIp]) {
    ipCounts[clientIp] = 0
  }

  // Increment connection count
  ipCounts[clientIp]++

  // Check if over limit
  if (ipCounts[clientIp] > MAX_CONNECTIONS_PER_IP) {
    console.warn(`LIMITER: IP ${clientIp} exceeded connection limit`)
    return true
  }

  // Clean up when client disconnects
  socket.on('disconnect', () => {
    if (ipCounts[clientIp]) {
      ipCounts[clientIp]--
      if (ipCounts[clientIp] <= 0) {
        delete ipCounts[clientIp]
      }
    }
  })

  return false
}

function getOverallIpConnectionCounts(io: Server) {
  const ipCounts: IPCounts = {}

  io.of('/').sockets.forEach((socket) => {
    const ip = getSocketIp(socket)
    if (ip) {
      if (!ipCounts[ip]) {
        ipCounts[ip] = 1
      } else {
        ipCounts[ip] += 1
      }
    }
  })

  return ipCounts
}

function getSocketIp(socket: Socket): string | undefined {
  if (['::1', '::ffff:127.0.0.1'].includes(socket.handshake.address)) {
    return socket.handshake.headers['x-forwarded-for'] as string
  } else {
    return socket.handshake.address
  }
}
