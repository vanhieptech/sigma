'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { TikTokApiClient } from '@/lib/api/tiktok';

interface ApiContextType {
  client: TikTokApiClient;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authenticate: (apiKey: string, apiSecret: string, accessToken: string) => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const [client] = useState<TikTokApiClient>(() => TikTokApiClient.getInstance());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Authenticate with the TikTok API
   */
  const authenticate = async (
    apiKey: string,
    apiSecret: string,
    accessToken: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize the TikTok client with credentials
      await client.initialize(apiKey, apiSecret, accessToken);

      // Test the connection
      await client.testConnection();

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Failed to authenticate with TikTok API');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    client,
    isAuthenticated,
    isLoading,
    error,
    authenticate,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/**
 * Hook for accessing the API context
 */
export function useApiContext(): ApiContextType {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}
