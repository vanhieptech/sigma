'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TikTokAuthButton } from '@/components/tiktok-auth-button';
import { getUserInfo, getUserVideos } from '@/lib/tiktok-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function ApiTestPage() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract token from URL if present
  useEffect(() => {
    const token = searchParams.get('access_token');
    if (token) {
      setAccessToken(token);
      // For security in production, store token in httpOnly cookie instead
      localStorage.setItem('tiktok_access_token', token);
    } else {
      // Try to get from localStorage if not in URL
      const storedToken = localStorage.getItem('tiktok_access_token');
      if (storedToken) setAccessToken(storedToken);
    }
  }, [searchParams]);

  const fetchUserInfo = async () => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }

    try {
      setIsLoadingUser(true);
      setError(null);
      const data = await getUserInfo(accessToken);
      setUserData(data);
    } catch (err: any) {
      setError(`Error fetching user info: ${err.message}`);
      console.error('Error fetching user info:', err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchUserVideos = async () => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }

    try {
      setIsLoadingVideos(true);
      setError(null);
      const data = await getUserVideos(accessToken);
      setUserVideos(data.videos || []);
    } catch (err: any) {
      setError(`Error fetching videos: ${err.message}`);
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const clearToken = () => {
    setAccessToken(null);
    setUserData(null);
    setUserVideos([]);
    localStorage.removeItem('tiktok_access_token');
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">TikTok API Test Page</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              {accessToken
                ? "You're connected to TikTok"
                : 'Connect your TikTok account to test the API'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {accessToken ? (
              <div className="flex flex-col gap-2">
                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  ✓ Successfully authenticated with TikTok
                </div>
                <div className="p-3 bg-gray-50 rounded-md text-xs font-mono overflow-x-auto">
                  <p className="truncate">{accessToken}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-700 rounded-md text-sm">
                Not connected to TikTok
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {accessToken ? (
              <Button variant="outline" onClick={clearToken}>
                Disconnect
              </Button>
            ) : (
              <TikTokAuthButton redirectPath="/api-test" />
            )}
          </CardFooter>
        </Card>

        {accessToken && (
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Fetch your TikTok profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  {userData ? (
                    <div className="grid gap-3">
                      <div className="flex items-center gap-4">
                        {userData.avatar_url && (
                          <img
                            src={userData.avatar_url}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium">{userData.display_name}</h3>
                          <p className="text-gray-500">@{userData.username}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="text-lg font-medium">{userData.follower_count || 0}</div>
                          <div className="text-sm text-gray-500">Followers</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="text-lg font-medium">{userData.following_count || 0}</div>
                          <div className="text-sm text-gray-500">Following</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="text-lg font-medium">{userData.video_count || 0}</div>
                          <div className="text-sm text-gray-500">Videos</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="text-gray-500 mb-4">No profile data loaded yet</p>
                      <Button onClick={fetchUserInfo} disabled={isLoadingUser}>
                        {isLoadingUser ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Fetch Profile'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle>Your Videos</CardTitle>
                  <CardDescription>Fetch your TikTok videos</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  {userVideos.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {userVideos.map(video => (
                        <div key={video.id} className="border rounded-md overflow-hidden">
                          {video.cover_image_url && (
                            <img
                              src={video.cover_image_url}
                              alt={video.title || 'Video cover'}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-3">
                            <h4 className="font-medium line-clamp-1">
                              {video.title || 'Untitled'}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {video.view_count || 0} views • {video.like_count || 0} likes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="text-gray-500 mb-4">No videos loaded yet</p>
                      <Button onClick={fetchUserVideos} disabled={isLoadingVideos}>
                        {isLoadingVideos ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Fetch Videos'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
