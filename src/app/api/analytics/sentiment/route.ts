import { NextRequest, NextResponse } from 'next/server';
import { SentimentResult } from '@/types/analytics';

// Simple sentiment analysis function for demo purposes
function analyzeSentiment(text: string): SentimentResult {
  // List of positive and negative words for basic sentiment analysis
  const positiveWords = [
    'good',
    'great',
    'awesome',
    'amazing',
    'excellent',
    'love',
    'like',
    'best',
    'fantastic',
    'wonderful',
    'perfect',
    'beautiful',
    'happy',
    'joy',
    'excited',
    'impressive',
    'helpful',
    'fun',
    'enjoy',
    'nice',
    'cool',
    'brilliant',
    'favorite',
    'positive',
    'recommend',
    'worth',
    'easy',
    'useful',
    'creative',
    'innovative',
  ];

  const negativeWords = [
    'bad',
    'terrible',
    'awful',
    'horrible',
    'hate',
    'dislike',
    'worst',
    'poor',
    'disappointing',
    'useless',
    'boring',
    'difficult',
    'annoying',
    'frustrating',
    'waste',
    'sad',
    'angry',
    'upset',
    'negative',
    'problem',
    'fail',
    'failure',
    'broken',
    'expensive',
    'overrated',
    'avoid',
    'wrong',
    'hard',
    'complicated',
    'confusing',
    'slow',
    'ugly',
    'stupid',
    'ridiculous',
  ];

  // Normalize text for analysis
  const normalizedText = text.toLowerCase();
  const words = normalizedText.match(/\b(\w+)\b/g) || [];

  // Count positive and negative words
  const positive: string[] = [];
  const negative: string[] = [];
  const calculation: Record<string, number> = {};

  words.forEach(word => {
    if (positiveWords.includes(word)) {
      positive.push(word);
      calculation[word] = 1;
    } else if (negativeWords.includes(word)) {
      negative.push(word);
      calculation[word] = -1;
    }
  });

  // Calculate sentiment score
  const positiveCount = positive.length;
  const negativeCount = negative.length;
  const score = (positiveCount - negativeCount) / (words.length || 1);

  // Normalize score to be between -1 and 1
  const normalizedScore = Math.max(-1, Math.min(1, score * 3));

  return {
    score: normalizedScore,
    comparative: normalizedScore / (words.length || 1),
    calculation,
    tokens: words,
    positive,
    negative,
  };
}

// Generate word cloud from comments
function generateWordCloud(comments: string[]): Record<string, number> {
  const wordCloud: Record<string, number> = {};
  const stopWords = [
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'for',
    'nor',
    'on',
    'at',
    'to',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'this',
    'that',
    'these',
    'those',
    'my',
    'your',
    'his',
    'her',
    'its',
    'our',
    'their',
    'in',
    'of',
    'from',
    'with',
    'about',
    'as',
    'if',
    'when',
    'where',
    'why',
    'how',
    'all',
    'any',
    'both',
    'each',
    'few',
    'more',
    'most',
    'some',
    'such',
    'no',
    'not',
    'only',
    'own',
    'same',
    'so',
    'than',
    'too',
    'very',
    'just',
    'can',
    'will',
    'should',
    'now',
    'what',
    'who',
    'whom',
    'which',
    'whose',
  ];

  comments.forEach(comment => {
    const words = comment.toLowerCase().match(/\b(\w+)\b/g) || [];

    words.forEach(word => {
      if (word.length > 2 && !stopWords.includes(word)) {
        wordCloud[word] = (wordCloud[word] || 0) + 1;
      }
    });
  });

  return wordCloud;
}

// Get sentiment label based on score
function getSentimentLabel(score: number): 'positive' | 'neutral' | 'negative' {
  if (score > 0.33) return 'positive';
  if (score < -0.33) return 'negative';
  return 'neutral';
}

// POST - Analyze sentiment of text or comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Single text analysis
    if (body.text) {
      const sentiment = analyzeSentiment(body.text);

      return NextResponse.json({
        success: true,
        data: { sentiment },
      });
    }

    // Multiple comments analysis
    if (body.comments && Array.isArray(body.comments)) {
      const comments = body.comments;
      const includeWordCloud = body.includeWordCloud || false;

      // Analyze each comment
      const commentSentiments = comments.map(comment => {
        const sentiment = analyzeSentiment(comment);
        return {
          text: comment,
          sentiment,
          label: getSentimentLabel(sentiment.score),
        };
      });

      // Calculate overall sentiment
      const totalScore = commentSentiments.reduce((sum, item) => sum + item.sentiment.score, 0);
      const averageScore = totalScore / (commentSentiments.length || 1);

      // Count sentiment distribution
      const positiveCount = commentSentiments.filter(item => item.label === 'positive').length;
      const neutralCount = commentSentiments.filter(item => item.label === 'neutral').length;
      const negativeCount = commentSentiments.filter(item => item.label === 'negative').length;
      const total = commentSentiments.length || 1;

      const result = {
        overallSentiment: {
          score: averageScore,
          label: getSentimentLabel(averageScore),
          distribution: {
            positive: positiveCount / total,
            neutral: neutralCount / total,
            negative: negativeCount / total,
          },
        },
        commentSentiments,
      };

      // Add word cloud if requested
      if (includeWordCloud) {
        result.wordCloud = generateWordCloud(comments);
      }

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request. Provide either text or comments array.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}
