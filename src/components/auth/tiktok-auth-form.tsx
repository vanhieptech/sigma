'use client';

import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApiContext } from '@/providers/tiktok-api-provider';
import { Loader2 } from 'lucide-react';

// Define form schema
const tiktokAuthSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().min(1, 'API Secret is required'),
  accessToken: z.string().min(1, 'Access Token is required'),
});

type TiktokAuthFormValues = z.infer<typeof tiktokAuthSchema>;

export function TiktokAuthForm() {
  const { authenticate, isLoading, error } = useApiContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize form
  const form = useForm<TiktokAuthFormValues>({
    resolver: zodResolver(tiktokAuthSchema),
    defaultValues: {
      apiKey: '',
      apiSecret: '',
      accessToken: '',
    },
  });

  // Handle form submission
  async function onSubmit(values: TiktokAuthFormValues) {
    const success = await authenticate(values.apiKey, values.apiSecret, values.accessToken);
    if (success) {
      setIsAuthenticated(true);
    }
  }

  return (
    <div className="p-6 bg-card border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Connect TikTok Account</h2>

      {isAuthenticated ? (
        <div className="bg-green-50 p-4 rounded-md mb-4">
          <p className="text-green-700 text-sm">
            Successfully connected to TikTok API! You can now use all features.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your TikTok API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok API Secret</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your TikTok API Secret" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok Access Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your TikTok Access Token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="bg-red-50 p-3 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <a
                href="https://developers.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Get TikTok API credentials
              </a>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Account'
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {isAuthenticated && (
        <div className="mt-4">
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Configure Different Account
          </Button>
        </div>
      )}

      <div className="mt-6 text-xs text-muted-foreground">
        <p>
          Your API credentials are stored locally and are only used to communicate with the TikTok
          API. We never store your credentials on our servers.
        </p>
      </div>
    </div>
  );
}
