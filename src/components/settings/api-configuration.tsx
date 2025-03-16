'use client';

import { useState } from 'react';
import { useApiContext } from '@/providers/tiktok-api-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function ApiConfiguration() {
  const { isConfigured, isLoading, error, configure, logout } = useApiContext();

  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission to configure the API client
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!apiKey.trim() || !apiSecret.trim() || !accessToken.trim()) {
      setFormError('All fields are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      // Configure the API client
      configure(apiKey, apiSecret, accessToken);

      // Clear form
      setApiKey('');
      setApiSecret('');
      setAccessToken('');
    } catch (err) {
      console.error('Error configuring API:', err);
      setFormError('Failed to configure API client');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle logout and clear credentials
   */
  const handleLogout = () => {
    logout();
    setApiKey('');
    setApiSecret('');
    setAccessToken('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>TikTok API Configuration</CardTitle>
        <CardDescription>Set up your TikTok API credentials to enable API features</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConfigured ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircledIcon className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">API Configured</AlertTitle>
              <AlertDescription className="text-green-700">
                Your TikTok API credentials are configured and ready to use.
              </AlertDescription>
            </Alert>

            <Button variant="outline" onClick={handleLogout}>
              Remove Credentials
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your TikTok API key"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                value={apiSecret}
                onChange={e => setApiSecret(e.target.value)}
                placeholder="Enter your TikTok API secret"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                type="password"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
                placeholder="Enter your TikTok access token"
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Configuring...' : 'Configure API'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start">
        <div className="text-sm text-muted-foreground mt-2">
          <p>
            Don&apos;t have TikTok API credentials yet?{' '}
            <Link
              href="https://developers.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Get them from the TikTok Developer Portal
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
