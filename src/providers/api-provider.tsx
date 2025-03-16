'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ApiContextType {
  apiUrl: string;
  isAuthenticated: boolean;
}

const ApiContext = createContext<ApiContextType>({
  apiUrl: '/api',
  isAuthenticated: false,
});

export function ApiProvider({ children }: { children: ReactNode }) {
  // In a real app, you would fetch authentication state and API configuration
  const apiState = {
    apiUrl: '/api',
    isAuthenticated: false,
  };

  return <ApiContext.Provider value={apiState}>{children}</ApiContext.Provider>;
}

export const useApi = () => useContext(ApiContext);
