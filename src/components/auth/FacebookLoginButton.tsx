"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookLoginButtonProps {
  onAccessTokenReceived: (accessToken: string) => void;
  buttonText?: string;
  className?: string;
  appId?: string;
}

export function FacebookLoginButton({
  onAccessTokenReceived,
  buttonText = "Login with Facebook",
  className = "",
  appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "your-app-id-here"
}: FacebookLoginButtonProps) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v17.0' // Use the latest version
      });
      
      setIsSDKLoaded(true);
      
      // Check if the user is already logged in
      window.FB.getLoginStatus(function(response: any) {
        if (response.status === 'connected') {
          // User is logged in and has authorized your app
          onAccessTokenReceived(response.authResponse.accessToken);
        }
      });
    };
  }, [appId, onAccessTokenReceived]);

  const handleLogin = () => {
    if (!isSDKLoaded) return;
    
    setIsLoggingIn(true);
    
    window.FB.login(function(response: any) {
      setIsLoggingIn(false);
      
      if (response.authResponse) {
        // User successfully logged in and granted permissions
        onAccessTokenReceived(response.authResponse.accessToken);
      } else {
        // User cancelled login or did not grant permissions
        console.log('Facebook login was cancelled or failed');
      }
    }, {
      scope: 'public_profile,email',
      return_scopes: true
    });
  };

  return (
    <>
      <Script 
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.FB) {
            window.fbAsyncInit();
          }
        }}
      />
      
      <Button
        type="button"
        onClick={handleLogin}
        disabled={!isSDKLoaded || isLoggingIn}
        className={`bg-[#1877F2] hover:bg-[#166FE5] text-white ${className}`}
      >
        {isLoggingIn ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center">
            <Facebook className="mr-2 h-4 w-4" />
            {buttonText}
          </span>
        )}
      </Button>
    </>
  );
} 