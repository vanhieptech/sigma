import { NextRequest, NextResponse } from 'next/server';
import { HistoricalComparison, AnalyticsMetrics, TimeInterval } from '@/types/analytics';

// Define time interval types
type TimeRangeType = '24h' | '7d' | '30d' | 'custom';

// In-memory storage for demo purposes
// In a real app, this would be stored in a database
const analyticsStore: Record<string, Record<string, AnalyticsMetrics>> = {};

// Generate random metrics for demo purposes
function generateRandomMetrics(baseValue: number = 1000, variance: number = 0.2): AnalyticsMetrics {
  // Generate a random value within variance percentage of the base value
  const randomize = (base: number) => {
    const min = base * (1 - variance);
    const max = base * (1 + variance);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Calculate engagement rate based on other metrics
  const calculateEngagementRate = (
    views: number,
    likes: number,
    comments: number,
    shares: number
  ) => {
    return (likes + comments + shares) / (views || 1);
  };

  const views = randomize(baseValue);
  const likes = randomize(baseValue * 0.4);
  const comments = randomize(baseValue * 0.05);
  const shares = randomize(baseValue * 0.02);
  const followers = randomize(baseValue * 0.01);
  const diamonds = randomize(baseValue * 0.005);

  // Create time interval
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);

  return {
    views,
    likes,
    comments,
    shares,
    followers,
    diamonds,
    engagement: calculateEngagementRate(views, likes, comments, shares),
    timeInterval: {
      start: start.toISOString(),
      end: now.toISOString(),
      duration: 7,
      label: 'Last 7 days',
    },
  };
}

// Get date range for a time interval
function getDateRange(
  timeRange: TimeRangeType,
  isPrevious: boolean = false
): { startDate: string; endDate: string } {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date(now);

  // Set the time ranges based on the interval
  switch (timeRange) {
    case '24h':
      startDate.setHours(now.getHours() - (isPrevious ? 48 : 24));
      if (isPrevious) endDate.setHours(now.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(now.getDate() - (isPrevious ? 14 : 7));
      if (isPrevious) endDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - (isPrevious ? 60 : 30));
      if (isPrevious) endDate.setDate(now.getDate() - 30);
      break;
    case 'custom':
      // For custom, we'll just use 30 days as default
      startDate.setDate(now.getDate() - (isPrevious ? 60 : 30));
      if (isPrevious) endDate.setDate(now.getDate() - 30);
      break;
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

// Calculate percentage change between current and previous metrics
function calculateChanges(current: AnalyticsMetrics, previous: AnalyticsMetrics) {
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    views: calculatePercentageChange(current.views, previous.views),
    likes: calculatePercentageChange(current.likes, previous.likes),
    comments: calculatePercentageChange(current.comments, previous.comments),
    shares: calculatePercentageChange(current.shares, previous.shares),
    followers: calculatePercentageChange(current.followers, previous.followers),
    diamonds:
      current.diamonds !== undefined && previous.diamonds !== undefined
        ? calculatePercentageChange(current.diamonds, previous.diamonds)
        : undefined,
    engagementRate: calculatePercentageChange(current.engagement, previous.engagement),
  };
}

// GET - Fetch historical comparison data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'demo-user';
    const timeRangeParam = searchParams.get('timeRange') || '24h';
    const timeRange = timeRangeParam as TimeRangeType;

    // Get date ranges for current and previous periods
    const currentPeriodDates = getDateRange(timeRange);
    const previousPeriodDates = getDateRange(timeRange, true);

    // Check if we have stored data for this user and time range
    const userStore = analyticsStore[userId] || {};

    // Generate or retrieve metrics for current period
    let currentMetrics: AnalyticsMetrics;
    const currentKey = `${timeRange}-current`;

    if (userStore[currentKey]) {
      currentMetrics = userStore[currentKey];
    } else {
      // Generate random metrics based on time range
      const baseValue = timeRange === '24h' ? 1000 : timeRange === '7d' ? 7000 : 30000;
      currentMetrics = generateRandomMetrics(baseValue);

      // Store for future use
      if (!analyticsStore[userId]) analyticsStore[userId] = {};
      analyticsStore[userId][currentKey] = currentMetrics;
    }

    // Generate or retrieve metrics for previous period
    let previousMetrics: AnalyticsMetrics;
    const previousKey = `${timeRange}-previous`;

    if (userStore[previousKey]) {
      previousMetrics = userStore[previousKey];
    } else {
      // Generate previous metrics with slightly lower base value
      const baseValue = timeRange === '24h' ? 900 : timeRange === '7d' ? 6300 : 27000;
      previousMetrics = generateRandomMetrics(baseValue);

      // Store for future use
      if (!analyticsStore[userId]) analyticsStore[userId] = {};
      analyticsStore[userId][previousKey] = previousMetrics;
    }

    // Calculate percentage changes
    const changes = calculateChanges(currentMetrics, previousMetrics);

    // Create the historical comparison response
    const comparison: HistoricalComparison = {
      metrics: {
        current: {
          views: currentMetrics.views,
          likes: currentMetrics.likes,
          comments: currentMetrics.comments,
          shares: currentMetrics.shares,
          followers: currentMetrics.followers,
          engagement: currentMetrics.engagement,
        },
        previous: {
          views: previousMetrics.views,
          likes: previousMetrics.likes,
          comments: previousMetrics.comments,
          shares: previousMetrics.shares,
          followers: previousMetrics.followers,
          engagement: previousMetrics.engagement,
        },
        growth: {
          views: changes.views,
          likes: changes.likes,
          comments: changes.comments,
          shares: changes.shares,
          followers: changes.followers,
          engagement: changes.engagementRate,
        },
        timeInterval: currentMetrics.timeInterval,
      },
      topPerforming: {
        videos: [],
        hashtags: [],
        sounds: [],
      },
      growthTrend: generateGrowthTrend(timeRange, currentMetrics, previousMetrics),
    };

    return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    console.error('Error fetching historical analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch historical analytics data' },
      { status: 500 }
    );
  }
}

// Generate growth trend data for the response
function generateGrowthTrend(
  timeRange: TimeRangeType,
  current: AnalyticsMetrics,
  previous: AnalyticsMetrics
) {
  const trendData = [];
  const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Calculate a value that progresses from previous to current
    const progress = (days - i) / days;
    const viewDiff = current.views - previous.views;
    const followerDiff = current.followers - previous.followers;
    const engagementDiff = current.engagement - previous.engagement;

    trendData.push({
      date: date.toISOString().split('T')[0],
      views: Math.round(previous.views + viewDiff * progress),
      followers: Math.round(previous.followers + followerDiff * progress),
      engagement: Number((previous.engagement + engagementDiff * progress).toFixed(4)),
    });
  }

  return trendData;
}

// POST - Store analytics data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, timeRange, metrics } = body;

    if (!userId || !timeRange || !metrics) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, timeRange, metrics' },
        { status: 400 }
      );
    }

    // Store the metrics
    if (!analyticsStore[userId]) analyticsStore[userId] = {};
    analyticsStore[userId][`${timeRange}-current`] = metrics;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing analytics data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to store analytics data' },
      { status: 500 }
    );
  }
}
