import OpenAI from 'openai';
import 'dotenv/config';

export interface VoiceSettings {
  voice: 'alloy' | 'ash' | 'coral' | 'echo' | 'fable' | 'onyx' | 'nova' | 'sage' | 'shimmer';
  model: 'tts-1' | 'tts-1-hd';
  speed: number; // 0.25 to 4.0
  responseStyle: 'casual' | 'professional' | 'enthusiastic' | 'friendly';
}

export interface AIPersonality {
  name: string;
  description: string;
  voiceSettings: VoiceSettings;
  productKnowledge: string;
  greetingTemplate: string;
  purchaseTemplate: string;
  likeTemplate: string;
  giftTemplate: string;
  joinTemplate: string;
  questionTemplate: string;
}

export interface AIResponse {
  text: string;
  audioUrl?: string;
  duration?: number;
}

export class AIVoiceManager {
  private static instance: AIVoiceManager;
  private openai: OpenAI;
  private personalities: Map<string, AIPersonality> = new Map();
  private defaultPersonality: AIPersonality = {
    name: 'Default Assistant',
    description: 'A helpful and friendly sales assistant',
    voiceSettings: {
      voice: 'nova',
      model: 'tts-1-hd',
      speed: 1.0,
      responseStyle: 'friendly'
    },
    productKnowledge: 'I can help customers find products they are looking for and answer questions about our store.',
    greetingTemplate: 'Hello {{username}}, welcome to the stream! How can I help you today?',
    purchaseTemplate: 'Thank you {{username}} for purchasing {{product}}! Great choice!',
    likeTemplate: 'Thanks for the likes {{username}}! Your support means a lot to us!',
    giftTemplate: 'Wow! Thank you {{username}} for the amazing gift! We really appreciate it!',
    joinTemplate: 'Welcome {{username}} to our live stream! Feel free to ask any questions about our products!',
    questionTemplate: '{{answer}}'
  };

  private constructor(apiKey?: string) {
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY in your environment variables.');
    }
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY
    });
  }

  public static getInstance(apiKey?: string): AIVoiceManager {
    if (!AIVoiceManager.instance) {
      AIVoiceManager.instance = new AIVoiceManager(apiKey);
    }
    return AIVoiceManager.instance;
  }

  public async registerPersonality(storeId: string, personality: AIPersonality): Promise<void> {
    this.personalities.set(storeId, personality);
  }

  public getPersonality(storeId: string): AIPersonality {
    return this.personalities.get(storeId) || this.defaultPersonality;
  }

  public async generateTextResponse(storeId: string, event: string, data: any): Promise<string> {
    const personality = this.getPersonality(storeId);
    let template = '';
    
    switch(event) {
      case 'join':
        template = personality.joinTemplate;
        break;
      case 'purchase':
        template = personality.purchaseTemplate;
        break;
      case 'like':
        template = personality.likeTemplate;
        break;
      case 'gift':
        template = personality.giftTemplate;
        break;
      case 'question':
        // Generate AI response for questions
        const answer = await this.generateAIAnswer(storeId, data.question);
        template = personality.questionTemplate.replace('{{answer}}', answer);
        break;
      default:
        template = personality.greetingTemplate;
    }

    // Replace placeholders with actual data
    return this.replaceTemplatePlaceholders(template, data);
  }

  private replaceTemplatePlaceholders(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private async generateAIAnswer(storeId: string, question: string): Promise<string> {
    const personality = this.getPersonality(storeId);
    
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are ${personality.name}, ${personality.description}. ${personality.productKnowledge}
            Your responses should be in a ${personality.voiceSettings.responseStyle} tone.
            Keep answers concise, helpful, and suitable for live stream audience.
            If asked about products, provide enthusiastic but honest answers.
            If you don't know something, suggest asking for specific details.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 150
      });

      return completion.choices[0]?.message?.content || 'I apologize, I couldn\'t process that question.';
    } catch (error) {
      console.error('Error generating AI answer:', error);
      return 'I apologize, I\'m having trouble processing that question right now.';
    }
  }

  public async textToSpeech(storeId: string, text: string): Promise<AIResponse> {
    const personality = this.getPersonality(storeId);
    const { voice, model, speed } = personality.voiceSettings;
    
    try {
      const mp3 = await this.openai.audio.speech.create({
        model: model,
        voice: voice,
        input: text,
        speed: speed,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      // In a real implementation, you would save this buffer to a file or stream it
      // For now, we're just returning a mock URL
      
      return {
        text,
        audioUrl: 'mock-audio-url.mp3', // This would be a real URL in production
        duration: buffer.length / 16000 // Rough estimate of audio duration in seconds
      };
    } catch (error) {
      console.error('Error generating TTS:', error);
      return { text };
    }
  }
} 