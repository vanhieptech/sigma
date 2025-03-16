import { Comment, SentimentAnalysis } from '@/types/analytics';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

/**
 * Singleton class for analyzing sentiment in TikTok comments
 */
export class SentimentAnalyzer {
  private static instance: SentimentAnalyzer;

  private constructor() {}

  /**
   * Get the singleton instance of SentimentAnalyzer
   */
  public static getInstance(): SentimentAnalyzer {
    if (!SentimentAnalyzer.instance) {
      SentimentAnalyzer.instance = new SentimentAnalyzer();
    }
    return SentimentAnalyzer.instance;
  }

  /**
   * Analyze multiple comments and return sentiment analysis
   */
  public async analyzeComments(comments: string[] | Comment[]): Promise<SentimentAnalysis> {
    if (comments.length === 0) {
      return this.getEmptySentimentAnalysis();
    }

    try {
      // Extract text from comments if they are Comment objects
      const commentTexts = comments.map(comment =>
        typeof comment === 'string' ? comment : comment.text
      );

      // Use OpenAI to analyze sentiment
      const prompt = `
        Analyze the sentiment of the following TikTok comments.
        
        COMMENTS:
        ${commentTexts.join('\n')}
        
        Provide a detailed sentiment analysis with:
        1. Overall sentiment (positive, negative, neutral, or mixed)
        2. Sentiment score (-100 to 100)
        3. Percentage breakdown (positive, negative, neutral)
        4. Key positive themes
        5. Key negative themes
        6. Common phrases
        7. Emotional tone
        8. User engagement level
        
        Return ONLY a JSON object with this structure:
        {
          "overallSentiment": string,
          "sentimentScore": number,
          "breakdown": {
            "positive": number,
            "negative": number,
            "neutral": number
          },
          "themes": {
            "positive": string[],
            "negative": string[]
          },
          "commonPhrases": string[],
          "emotionalTone": string,
          "engagementLevel": string
        }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in social media sentiment analysis. Analyze TikTok comments accurately and return only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing comments:', error);
      return this.getEmptySentimentAnalysis();
    }
  }

  /**
   * Get a default analysis response for error cases
   */
  private getDefaultAnalysis(): SentimentAnalysis {
    return {
      overallSentiment: {
        positive: 33.3,
        neutral: 33.4,
        negative: 33.3,
        score: 0,
      },
      keywordSentiment: [],
      commonPhrases: [],
      topEmotions: [],
      trends: {
        timeline: [],
        changes: [],
      },
    };
  }

  private getEmptySentimentAnalysis(): SentimentAnalysis {
    return {
      overallSentiment: 'neutral',
      sentimentScore: 0,
      breakdown: {
        positive: 0,
        negative: 0,
        neutral: 100,
      },
      themes: {
        positive: [],
        negative: [],
      },
      commonPhrases: [],
      emotionalTone: 'neutral',
      engagementLevel: 'low',
    };
  }
}
