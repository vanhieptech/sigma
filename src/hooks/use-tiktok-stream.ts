'use client';

import {
  AIConfig,
  Milestone,
  Poll,
  Question,
  StreamSettings,
  TikTokConnectionState,
  TikTokEvent,
  TikTokLike,
  TikTokViewerCount,
  VirtualAvatar,
  VoiceSettings,
} from '@/types/tiktok';
import { useCallback, useEffect, useState } from 'react';
import { useTikTokSocket } from './use-tiktok-socket';

interface UseTikTokStreamProps {
  initialAIConfig?: Partial<AIConfig>;
  initialStreamSettings?: Partial<StreamSettings>;
}

interface UseTikTokStreamReturn {
  events: TikTokEvent[];
  connectionState: TikTokConnectionState;
  viewerCount: number;
  aiConfig: AIConfig;
  streamSettings: StreamSettings;
  activePolls: Poll[];
  questions: Question[];
  milestones: Milestone[];
  virtualAvatar: VirtualAvatar | null;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  updateStreamSettings: (settings: Partial<StreamSettings>) => void;
  connect: (uniqueId: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  uniqueId: string | null;
  error: string | null;
  createPoll: (question: string, options: string[], duration: number) => Promise<Poll>;
  endPoll: (pollId: string) => void;
  addQuestion: (question: string, askedBy: string, askedById: string) => Promise<Question>;
  answerQuestion: (questionId: string, answer: string) => void;
  setVirtualAvatar: (avatar: VirtualAvatar | null) => void;
  updateVirtualAvatar: (updates: Partial<VirtualAvatar>) => void;
  sendAnnouncement: (text: string, level?: 'normal' | 'highlight' | 'super') => Promise<void>;
  pinComment: (commentId: string, pinned: boolean) => Promise<void>;
  toggleMute: (userId: string, muted: boolean) => Promise<void>;
}

// Default stream settings
const defaultStreamSettings: StreamSettings = {
  title: 'TikTok Live Stream',
  description: '',
  tags: [],
  allowComments: true,
  allowDuets: true,
  allowStitches: true,
  isPrivate: false,
  autoRecord: true,
  layoutTemplate: 'default',
  overlayUrls: [],
  liveGoals: [],
};

// Default voice settings
const defaultVoiceSettings: VoiceSettings = {
  voice: 'nova',
  model: 'tts-1-hd',
  speed: 1.0,
  language: 'en-US',
  pitch: 1.0,
  stability: 0.5,
  style: 0.5,
};

export function useTikTokStream({
  initialAIConfig,
  initialStreamSettings,
}: UseTikTokStreamProps = {}): UseTikTokStreamReturn {
  // Use the socket connection
  const {
    events: socketEvents,
    connectToUser,
    disconnectFromUser,
    updateAIConfig: updateSocketAIConfig,
    error: socketError,
    isConnected: socketIsConnected,
    isConnecting: socketIsConnecting,
    sendMessage,
  } = useTikTokSocket();

  const [events, setEvents] = useState<TikTokEvent[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<TikTokConnectionState>({
    state: 'DISCONNECTED',
  });

  // Added new state variables for enhanced features
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [virtualAvatar, setVirtualAvatarState] = useState<VirtualAvatar | null>(null);
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    ...defaultStreamSettings,
    ...initialStreamSettings,
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
    // Added new configuration options with defaults
    commentPrioritization: true,
    autoTranslation: false,
    voiceSettings: defaultVoiceSettings,
    autoModeration: true,
    sentimentAnalysis: true,
    contextualResponses: true,
    responseDelay: 1000,
    ...initialAIConfig,
  });

  // Handle update of AI configuration
  const updateAIConfig = useCallback(
    (config: Partial<AIConfig>) => {
      setAIConfig((prev: AIConfig) => {
        const newConfig = { ...prev, ...config };
        updateSocketAIConfig(newConfig);
        return newConfig;
      });
    },
    [updateSocketAIConfig]
  );

  // Handle update of stream settings
  const updateStreamSettings = useCallback(
    (settings: Partial<StreamSettings>) => {
      setStreamSettings((prev: StreamSettings) => ({ ...prev, ...settings }));
      // If connected, send updated settings to server
      if (connectionState.state === 'CONNECTED' && sendMessage) {
        sendMessage('updateStreamSettings', settings);
      }
    },
    [connectionState.state, sendMessage]
  );

  // Connect to a TikTok live stream
  const connect = useCallback(
    (targetUniqueId: string) => {
      // Reset events and state
      setEvents([]);
      setActivePolls([]);
      setQuestions([]);
      setMilestones([]);

      // Update local state
      setUniqueId(targetUniqueId);

      // Update connection state to connecting
      setConnectionState({
        state: 'CONNECTING',
        targetUniqueId,
      });

      // Connect to TikTok user via socket
      connectToUser(targetUniqueId);
    },
    [connectToUser]
  );

  // Disconnect from a TikTok live stream
  const disconnect = useCallback(() => {
    // Update state
    setConnectionState({
      state: 'DISCONNECTED',
    });

    // Reset uniqueId
    setUniqueId(null);

    // Disconnect from TikTok user via socket
    disconnectFromUser();
  }, [disconnectFromUser]);

  // Create a new poll
  const createPoll = useCallback(
    async (question: string, options: string[], duration: number): Promise<Poll> => {
      if (connectionState.state !== 'CONNECTED' || !sendMessage) {
        throw new Error('Not connected to a live stream');
      }

      const pollId = `poll-${Date.now()}`;
      const now = Date.now();
      const poll: Poll = {
        id: pollId,
        question,
        options: options.map((text, index) => ({ id: `option-${index}`, text, votes: 0 })),
        createdAt: now,
        endsAt: now + duration * 1000,
        isActive: true,
      };

      // Send poll to server
      await sendMessage('createPoll', poll);

      // Add to local state
      setActivePolls(prev => [...prev, poll]);

      // Set timer to end poll
      setTimeout(() => {
        endPoll(pollId);
      }, duration * 1000);

      return poll;
    },
    [connectionState.state, sendMessage]
  );

  // End an active poll
  const endPoll = useCallback(
    (pollId: string) => {
      setActivePolls(prev => {
        const updatedPolls = prev.map(poll =>
          poll.id === pollId ? { ...poll, isActive: false } : poll
        );

        // Send update to server
        if (connectionState.state === 'CONNECTED' && sendMessage) {
          const pollToEnd = updatedPolls.find(poll => poll.id === pollId);
          if (pollToEnd) {
            sendMessage('endPoll', { pollId });
          }
        }

        return updatedPolls;
      });
    },
    [connectionState.state, sendMessage]
  );

  // Add a new question
  const addQuestion = useCallback(
    async (questionText: string, askedBy: string, askedById: string): Promise<Question> => {
      const questionId = `question-${Date.now()}`;
      const question: Question = {
        id: questionId,
        questionText,
        askedBy,
        askedById,
        askedAt: Date.now(),
        isAnswered: false,
      };

      // Send to server if connected
      if (connectionState.state === 'CONNECTED' && sendMessage) {
        await sendMessage('addQuestion', question);
      }

      // Add to local state
      setQuestions(prev => [...prev, question]);

      return question;
    },
    [connectionState.state, sendMessage]
  );

  // Answer a question
  const answerQuestion = useCallback(
    (questionId: string, answer: string) => {
      setQuestions(prev => {
        const updatedQuestions = prev.map(question =>
          question.id === questionId
            ? {
                ...question,
                isAnswered: true,
                answeredAt: Date.now(),
                answerText: answer,
              }
            : question
        );

        // Send to server if connected
        if (connectionState.state === 'CONNECTED' && sendMessage) {
          const answeredQuestion = updatedQuestions.find(q => q.id === questionId);
          if (answeredQuestion) {
            sendMessage('answerQuestion', answeredQuestion);
          }
        }

        return updatedQuestions;
      });
    },
    [connectionState.state, sendMessage]
  );

  // Set virtual avatar
  const setVirtualAvatar = useCallback(
    (avatar: VirtualAvatar | null) => {
      setVirtualAvatarState(avatar);

      // Send to server if connected
      if (connectionState.state === 'CONNECTED' && sendMessage) {
        sendMessage('setVirtualAvatar', { avatar });
      }
    },
    [connectionState.state, sendMessage]
  );

  // Update virtual avatar
  const updateVirtualAvatar = useCallback(
    (updates: Partial<VirtualAvatar>) => {
      setVirtualAvatarState((prev: VirtualAvatar | null) => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };

        // Send to server if connected
        if (connectionState.state === 'CONNECTED' && sendMessage) {
          sendMessage('updateVirtualAvatar', updated);
        }

        return updated;
      });
    },
    [connectionState.state, sendMessage]
  );

  // Send announcement to live stream
  const sendAnnouncement = useCallback(
    async (text: string, level: 'normal' | 'highlight' | 'super' = 'normal'): Promise<void> => {
      if (connectionState.state !== 'CONNECTED' || !sendMessage) {
        throw new Error('Not connected to a live stream');
      }

      await sendMessage('sendAnnouncement', { text, level });
    },
    [connectionState.state, sendMessage]
  );

  // Pin a comment
  const pinComment = useCallback(
    async (commentId: string, pinned: boolean): Promise<void> => {
      if (connectionState.state !== 'CONNECTED' || !sendMessage) {
        throw new Error('Not connected to a live stream');
      }

      await sendMessage('pinComment', { commentId, pinned });
    },
    [connectionState.state, sendMessage]
  );

  // Mute/unmute a user
  const toggleMute = useCallback(
    async (userId: string, muted: boolean): Promise<void> => {
      if (connectionState.state !== 'CONNECTED' || !sendMessage) {
        throw new Error('Not connected to a live stream');
      }

      await sendMessage('toggleMute', { userId, muted });
    },
    [connectionState.state, sendMessage]
  );

  // Process milestones
  useEffect(() => {
    const comments = events.filter(event => event.type === 'comment');
    const follows = events.filter(event => event.type === 'follow');
    const shares = events.filter(event => event.type === 'share');
    const likes = events.filter(event => event.type === 'like');
    const gifts = events.filter(event => event.type === 'gift');

    // Check for milestones (e.g., every 100 followers, 1000 likes, etc.)
    const checkMilestones = () => {
      const newMilestones: Milestone[] = [];

      // Follower milestones
      if (follows.length > 0 && follows.length % 10 === 0) {
        newMilestones.push({
          type: 'followers',
          value: follows.length,
          timestamp: Date.now(),
        });
      }

      // Like milestones (calculate total likes from like events)
      const totalLikes = likes.reduce(
        (total, event) => total + ((event.data as TikTokLike).likeCount || 0),
        0
      );

      if (totalLikes > 0 && totalLikes % 50 === 0) {
        newMilestones.push({
          type: 'likes',
          value: totalLikes,
          timestamp: Date.now(),
        });
      }

      // Only add new milestones
      if (newMilestones.length > 0) {
        setMilestones(prev => [...prev, ...newMilestones]);
      }
    };

    checkMilestones();
  }, [events]);

  // Update events from socket
  useEffect(() => {
    console.log('use-tiktok-stream - Received socket events:', socketEvents.length, socketEvents);

    // First, set all events
    setEvents(socketEvents);

    // Find the latest connection state event
    const connectionEvents = socketEvents.filter(event => event.type === 'connection');
    if (connectionEvents.length > 0) {
      const latestConnectionEvent = connectionEvents[connectionEvents.length - 1];

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

    // Handle poll events
    const pollEvents = socketEvents.filter(event => event.type === 'poll');
    if (pollEvents.length > 0) {
      const latestPollEvents = pollEvents.slice(-5); // Only process recent polls
      latestPollEvents.forEach(event => {
        const poll = event.data as Poll;
        setActivePolls(prev => {
          // If poll already exists, update it, otherwise add it
          const existingIndex = prev.findIndex(p => p.id === poll.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = poll;
            return updated;
          } else {
            return [...prev, poll];
          }
        });
      });
    }

    // Handle question events
    const questionEvents = socketEvents.filter(event => event.type === 'question');
    if (questionEvents.length > 0) {
      const latestQuestionEvents = questionEvents.slice(-5); // Only process recent questions
      latestQuestionEvents.forEach(event => {
        const question = event.data as Question;
        setQuestions(prev => {
          // If question already exists, update it, otherwise add it
          const existingIndex = prev.findIndex(q => q.id === question.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = question;
            return updated;
          } else {
            return [...prev, question];
          }
        });
      });
    }
  }, [socketEvents]);

  return {
    events,
    connectionState,
    viewerCount,
    aiConfig,
    streamSettings,
    activePolls,
    questions,
    milestones,
    virtualAvatar,
    updateAIConfig,
    updateStreamSettings,
    connect,
    disconnect,
    isConnected: connectionState.state === 'CONNECTED',
    uniqueId,
    error:
      socketError ||
      (connectionState.state === 'FAILED'
        ? connectionState.serverError || 'Connection failed'
        : null),
    createPoll,
    endPoll,
    addQuestion,
    answerQuestion,
    setVirtualAvatar,
    updateVirtualAvatar,
    sendAnnouncement,
    pinComment,
    toggleMute,
  };
}
