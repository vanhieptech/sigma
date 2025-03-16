'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getTikTokAuthUrl } from '@/lib/tiktok-api';
import { LogIn } from 'lucide-react';

interface TikTokAuthButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  redirectPath?: string;
  onSuccess?: () => void;
}

export function TikTokAuthButton({
  variant = 'default',
  size = 'default',
  className = '',
  redirectPath = '/dashboard',
  onSuccess,
}: TikTokAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = () => {
    try {
      setIsLoading(true);

      // Generate a random state for CSRF protection
      const state = Math.random().toString(36).substring(2);

      // Store state in session storage for verification later
      sessionStorage.setItem('tiktok_auth_state', state);

      // Store the redirect path for after successful authentication
      sessionStorage.setItem('tiktok_auth_redirect', redirectPath);

      // Get the authorization URL and redirect the user
      const authUrl = getTikTokAuthUrl(state);
      window.location.href = authUrl;

      // Note: We won't reach this point due to redirect
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('TikTok authentication error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`font-medium ${className}`}
      onClick={handleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span>Connect TikTok</span>
        </div>
      )}
    </Button>
  );
}
