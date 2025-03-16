import { useState, useEffect } from 'react';

// Basic user type
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Simple auth hook that would normally connect to your auth provider
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      try {
        // In a real implementation, this would fetch from your auth provider
        // For now, we'll just simulate a logged-in user
        setUser({
          id: 'user-1',
          email: 'user@example.com',
          name: 'Demo User',
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
