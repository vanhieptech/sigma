import { AIVoiceManager, AIResponse } from './ai-voice';
import {
  TikTokComment,
  TikTokGift,
  TikTokLike,
  TikTokShare,
  TikTokFollow,
  TikTokMember
} from './tiktok-live';
import { Socket } from 'socket.io';

interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PurchaseEvent {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  product: ProductData;
  timestamp: number;
}

export interface QuestionEvent {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  question: string;
  timestamp: number;
}

export interface StreamEventHandlerConfig {
  enableAIResponses: boolean;
  respondToComments: boolean;
  respondToGifts: boolean;
  respondToLikes: boolean;
  respondToFollows: boolean;
  respondToShares: boolean;
  respondToJoins: boolean;
  respondToPurchases: boolean;
  giftThreshold: number; // Minimum diamond value to respond to
  likeThreshold: number; // Minimum like count to respond to
  joinResponseRate: number; // Percentage of joins to respond to (0-100)
}

export class StreamEventHandler {
  private storeId: string;
  private aiManager: AIVoiceManager;
  private config: StreamEventHandlerConfig;
  private socket: Socket | null = null;
  private productCatalog: Map<string, ProductData> = new Map();
  private recentResponses: Set<string> = new Set(); // To prevent duplicate responses
  private isProcessingQueue: boolean = false;
  private responseQueue: Array<{event: string, data: any}> = [];
  
  constructor(
    storeId: string, 
    aiManager: AIVoiceManager, 
    config: StreamEventHandlerConfig
  ) {
    this.storeId = storeId;
    this.aiManager = aiManager;
    this.config = config;
    
    // Start the response queue processor
    this.processResponseQueue();
  }

  public setSocket(socket: Socket) {
    this.socket = socket;
  }

  public addProductToCatalog(product: ProductData) {
    this.productCatalog.set(product.id, product);
  }

  public removeProductFromCatalog(productId: string) {
    this.productCatalog.delete(productId);
  }

  public updateConfig(config: Partial<StreamEventHandlerConfig>) {
    this.config = { ...this.config, ...config };
  }

  private getResponseKey(event: string, userId: string): string {
    return `${event}:${userId}:${Math.floor(Date.now() / 30000)}`; // Deduplication key valid for 30 seconds
  }

  private shouldRespond(event: string, data: any): boolean {
    if (!this.config.enableAIResponses) return false;
    
    const responseKey = this.getResponseKey(event, data.userId);
    if (this.recentResponses.has(responseKey)) return false;
    
    switch (event) {
      case 'comment':
        return this.config.respondToComments && this.isQuestionOrProductInquiry(data.comment);
      case 'gift':
        return this.config.respondToGifts && data.diamondCount >= this.config.giftThreshold;
      case 'like':
        return this.config.respondToLikes && data.likeCount >= this.config.likeThreshold;
      case 'follow':
        return this.config.respondToFollows;
      case 'share':
        return this.config.respondToShares;
      case 'member':
        // Only respond to a percentage of joins to avoid spam
        return this.config.respondToJoins && (Math.random() * 100 <= this.config.joinResponseRate);
      case 'purchase':
        return this.config.respondToPurchases;
      default:
        return false;
    }
  }
  
  private isQuestionOrProductInquiry(comment: string): boolean {
    // Check if the comment is a question or a product inquiry
    const lowerComment = comment.toLowerCase();
    
    // Check if it's a question
    if (lowerComment.endsWith('?')) return true;
    
    // Check for question words
    const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which', 'can', 'does', 'is', 'are', 'will', 'do'];
    if (questionWords.some(word => lowerComment.startsWith(word))) return true;
    
    // Check for product inquiry phrases
    const productPhrases = [
      'price', 'cost', 'how much', 'available', 'in stock', 'shipping', 'discount', 
      'where can i buy', 'tell me about', 'details', 'more info'
    ];
    if (productPhrases.some(phrase => lowerComment.includes(phrase))) return true;
    
    return false;
  }
  
  private async processResponseQueue() {
    if (this.isProcessingQueue || this.responseQueue.length === 0) {
      setTimeout(() => this.processResponseQueue(), 1000);
      return;
    }
    
    this.isProcessingQueue = true;
    
    try {
      const { event, data } = this.responseQueue.shift()!;
      const responseKey = this.getResponseKey(event, data.userId);
      
      // Mark as processed
      this.recentResponses.add(responseKey);
      setTimeout(() => this.recentResponses.delete(responseKey), 30000); // Clean up after 30 seconds
      
      // Generate text response
      const text = await this.aiManager.generateTextResponse(this.storeId, event, data);
      
      // Convert to speech
      const response = await this.aiManager.textToSpeech(this.storeId, text);
      
      // Send response to client
      if (this.socket) {
        this.socket.emit('aiResponse', {
          event,
          text: response.text,
          audioUrl: response.audioUrl,
          userData: {
            userId: data.userId,
            uniqueId: data.uniqueId,
            nickname: data.nickname
          },
          timestamp: Date.now()
        });
      }
      
      // Add a delay between responses to prevent overwhelming the stream
      await new Promise(resolve => setTimeout(resolve, (response.duration || 2) * 1000 + 500));
    } catch (error) {
      console.error('Error processing response queue:', error);
    } finally {
      this.isProcessingQueue = false;
      setTimeout(() => this.processResponseQueue(), 500);
    }
  }
  
  public async handleComment(comment: TikTokComment) {
    if (this.shouldRespond('comment', comment)) {
      const questionEvent: QuestionEvent = {
        userId: comment.userId,
        uniqueId: comment.uniqueId,
        nickname: comment.nickname,
        profilePictureUrl: comment.profilePictureUrl,
        question: comment.comment,
        timestamp: comment.timestamp
      };
      
      this.responseQueue.push({ event: 'question', data: questionEvent });
    }
  }
  
  public async handleGift(gift: TikTokGift) {
    if (this.shouldRespond('gift', gift)) {
      this.responseQueue.push({ event: 'gift', data: {
        username: gift.nickname,
        uniqueId: gift.uniqueId,
        giftName: gift.giftName,
        giftCount: gift.repeatCount,
        diamondCount: gift.diamondCount
      }});
    }
  }
  
  public async handleLike(like: TikTokLike) {
    if (this.shouldRespond('like', like)) {
      this.responseQueue.push({ event: 'like', data: {
        username: like.nickname,
        uniqueId: like.uniqueId,
        likeCount: like.likeCount
      }});
    }
  }
  
  public async handleFollow(follow: TikTokFollow) {
    if (this.shouldRespond('follow', follow)) {
      this.responseQueue.push({ event: 'follow', data: {
        username: follow.nickname,
        uniqueId: follow.uniqueId
      }});
    }
  }
  
  public async handleShare(share: TikTokShare) {
    if (this.shouldRespond('share', share)) {
      this.responseQueue.push({ event: 'share', data: {
        username: share.nickname,
        uniqueId: share.uniqueId
      }});
    }
  }
  
  public async handleMember(member: TikTokMember) {
    if (this.shouldRespond('member', member)) {
      this.responseQueue.push({ event: 'join', data: {
        username: member.nickname,
        uniqueId: member.uniqueId,
        joinType: member.joinType
      }});
    }
  }
  
  public async handlePurchase(purchase: PurchaseEvent) {
    if (this.shouldRespond('purchase', purchase)) {
      this.responseQueue.push({ event: 'purchase', data: {
        username: purchase.nickname,
        uniqueId: purchase.uniqueId,
        product: purchase.product.name,
        price: purchase.product.price
      }});
    }
  }
} 