'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { InfoIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '@/lib/auth';
import { getCredentialsByUser, PlatformCredential } from '@/lib/credentials-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FacebookLoginButton } from '@/components/auth/FacebookLoginButton';

interface FacebookUrlFormProps {
  onStartCrawl: (jobId: string) => void;
}

export function FacebookUrlForm({ onStartCrawl }: FacebookUrlFormProps) {
  const [url, setUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState({
    includeReplies: true,
    includeReactions: true,
    maxComments: 10000,
  });

  // Add progress tracking state
  const [progress, setProgress] = useState({
    total: 0,
    current: 0,
    percentage: 0,
    status: 'pending' as 'pending' | 'processing' | 'completed' | 'failed',
    jobId: '',
  });

  const [savedCredentials, setSavedCredentials] = useState<PlatformCredential[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>('');
  const { user } = useUser();

  // Add a state for tracking if the user is authenticated with Facebook
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadCredentials = async () => {
      try {
        const credentials = await getCredentialsByUser(user.id);
        const facebookCredentials = credentials.filter(cred => cred.platform === 'facebook');
        setSavedCredentials(facebookCredentials);
      } catch (err) {
        console.error('Error loading credentials:', err);
      }
    };

    loadCredentials();
  }, [user]);

  useEffect(() => {
    if (selectedCredentialId) {
      const credential = savedCredentials.find(c => c.id === selectedCredentialId);
      if (credential) {
        setAccessToken(credential.token);
      }
    }
  }, [selectedCredentialId, savedCredentials]);

  const handleAccessTokenReceived = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Start the crawl job
      const response = await fetch('/api/crawlers/facebook/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          options: {
            ...options,
            postUrl: url,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.jobId) {
        // Set the job ID in progress state
        setProgress(prev => ({ ...prev, jobId: data.jobId, status: 'processing' }));
        onStartCrawl(data.jobId);

        // Start polling for progress
        pollForProgress(data.jobId);
      } else {
        setError(data.error || 'Failed to start crawl job');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred while starting the crawl job');
      setLoading(false);
    }
  };

  const pollForProgress = (jobId: string) => {
    // Set up an interval to poll for progress
    const progressInterval = setInterval(async () => {
      try {
        const progressResponse = await fetch(`/api/crawlers/facebook/progress/${jobId}`);
        const progressData = await progressResponse.json();

        if (progressData.success) {
          setProgress({
            total: progressData.total,
            current: progressData.current,
            percentage: progressData.percentage,
            status: progressData.status,
            jobId,
          });

          // If the job is completed or failed, stop polling
          if (progressData.status === 'completed' || progressData.status === 'failed') {
            clearInterval(progressInterval);
            setLoading(false);

            // If the job failed, show the error
            if (progressData.status === 'failed' && progressData.error) {
              setError(progressData.error);
            }
          }
        } else {
          // If there was an error getting progress, stop polling
          clearInterval(progressInterval);
          setLoading(false);
          setError(progressData.error || 'Failed to get job progress');
        }
      } catch (err) {
        // If there was an error polling for progress, stop polling
        clearInterval(progressInterval);
        setLoading(false);
        setError('An error occurred while getting job progress');
      }
    }, 2000); // Poll every 2 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(progressInterval);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Facebook Post Crawler</CardTitle>
        <CardDescription>
          Enter a Facebook post URL to crawl comments and analyze engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url" className="text-sm font-medium">
                Facebook Post URL
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Enter the full URL of a Facebook post you want to analyze
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="url"
              placeholder="https://www.facebook.com/username/posts/123456789"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Facebook Authentication</Label>

            {!isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm mb-4">
                    Connect with Facebook to get an access token automatically. This will allow the
                    crawler to access the post data.
                  </p>
                  <FacebookLoginButton
                    onAccessTokenReceived={handleAccessTokenReceived}
                    buttonText="Connect with Facebook"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter token manually
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Connected to Facebook
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setAccessToken('');
                  }}
                >
                  Disconnect
                </Button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessToken" className="text-sm font-medium">
                    Facebook Access Token
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Enter your Facebook Graph API access token with permissions to read posts
                          and comments
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Enter your Facebook access token"
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  <a href="/dashboard/help/access-tokens" className="text-primary hover:underline">
                    Need help getting an access token?
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Crawl Options</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeReplies"
                  checked={options.includeReplies}
                  onCheckedChange={checked =>
                    setOptions({ ...options, includeReplies: checked === true })
                  }
                />
                <Label htmlFor="includeReplies" className="text-sm">
                  Include comment replies
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeReactions"
                  checked={options.includeReactions}
                  onCheckedChange={checked =>
                    setOptions({ ...options, includeReactions: checked === true })
                  }
                />
                <Label htmlFor="includeReactions" className="text-sm">
                  Include reactions data
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxComments" className="text-sm">
                  Maximum comments to crawl
                </Label>
                <Input
                  id="maxComments"
                  type="number"
                  min="1"
                  max="100000"
                  value={options.maxComments}
                  onChange={e =>
                    setOptions({ ...options, maxComments: parseInt(e.target.value) || 10000 })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {progress.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Crawling in progress...</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          )}

          {progress.status === 'completed' && (
            <Alert
              variant="success"
              className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Crawl completed successfully!</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !url || !accessToken}
          onClick={handleSubmit}
        >
          {loading ? 'Crawling...' : 'Start Crawling'}
        </Button>
      </CardFooter>
    </Card>
  );
}
