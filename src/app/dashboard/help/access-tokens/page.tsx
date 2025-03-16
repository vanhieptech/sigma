'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AccessTokensGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Token Guide</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to obtain access tokens for different social media platforms
          </p>
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Access tokens are sensitive credentials. Never share them publicly or commit them to
            version control.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="facebook" className="space-y-4">
          <TabsList>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          </TabsList>

          <TabsContent value="facebook">
            <Card>
              <CardHeader>
                <CardTitle>Facebook Access Token</CardTitle>
                <CardDescription>
                  How to create and use Facebook Graph API access tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Create a Facebook Developer Account</h3>
                <p>
                  If you don&apos;t already have one, create a Facebook Developer account at{' '}
                  <a
                    href="https://developers.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    developers.facebook.com
                  </a>
                  .
                </p>

                <h3 className="text-lg font-medium">Step 2: Create a Facebook App</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to the{' '}
                    <a
                      href="https://developers.facebook.com/apps/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Facebook Apps page
                    </a>
                    .
                  </li>
                  <li>
                    Click &quot;Create App&quot; and select &quot;Business&quot; as the app type.
                  </li>
                  <li>Fill in the required information and create your app.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 3: Add the Graph API Product</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>In your app dashboard, click &quot;Add Product&quot; in the left sidebar.</li>
                  <li>Find &quot;Graph API&quot; and click &quot;Set Up&quot;.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 4: Generate an Access Token</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to &quot;Tools&quot; → &quot;Graph API Explorer&quot; in the left sidebar.
                  </li>
                  <li>Select your app from the dropdown at the top.</li>
                  <li>Click &quot;Generate Access Token&quot;.</li>
                  <li>
                    Grant the necessary permissions:
                    <ul className="list-disc pl-5 mt-2">
                      <li>pages_read_engagement</li>
                      <li>pages_read_user_content</li>
                      <li>public_profile</li>
                    </ul>
                  </li>
                  <li>Click &quot;Generate Access Token&quot; again.</li>
                </ol>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important Note About Facebook API v2.4+ Changes</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">{`Facebook has deprecated the &quot;singular statuses API&quot; in API versions 2.4 and higher. This means you cannot directly access posts using the /{post-id} endpoint.`}</p>
                    <p>Instead, you need to use one of these approaches:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>{`For page posts: /{page-id}/feed or /{page-id}/posts`}</li>
                      <li>{`For user posts: /{user-id}/feed`}</li>
                    </ul>
                    <p className="mt-2">
                      Our application handles this automatically, but you need to make sure your
                      access token has the correct permissions.
                    </p>
                  </AlertDescription>
                </Alert>

                <h3 className="text-lg font-medium">Step 5: Get a Long-Lived Access Token</h3>
                <p>User access tokens expire after a short time. To get a long-lived token:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to &quot;Tools&quot; → &quot;Access Token Debugger&quot;.</li>
                  <li>Paste your short-lived token and click &quot;Debug&quot;.</li>
                  <li>Click &quot;Extend Access Token&quot;.</li>
                  <li>Copy the new token, which will be valid for about 60 days.</li>
                </ol>

                <h3 className="text-lg font-medium">
                  Step 6: Get a Page Access Token (for Page content)
                </h3>
                <p>If you need to access Page content:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to &quot;Tools&quot; → &quot;Graph API Explorer&quot;.</li>
                  <li>Make sure your user access token is selected.</li>
                  <li>Make a GET request to &quot;/me/accounts&quot;.</li>
                  <li>
                    Find the page you want to access in the response and copy its access token.
                  </li>
                </ol>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium">Testing Your Token</h3>
                <p>You can test your token using the Graph API Explorer:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to{' '}
                    <a
                      href="https://developers.facebook.com/tools/explorer/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Tools → Graph API Explorer
                    </a>
                    .
                  </li>
                  <li>Paste your access token in the token field.</li>
                  <li>{`Try a test query like &quot;/me&quot; or &quot;/{page-id}/feed&quot;.`}</li>
                  <li>If you see data returned, your token is working correctly.</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twitter">
            <Card>
              <CardHeader>
                <CardTitle>Twitter API Access Token</CardTitle>
                <CardDescription>How to create and use Twitter API access tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">
                  Step 1: Apply for a Twitter Developer Account
                </h3>
                <p>
                  Apply for a Twitter Developer account at{' '}
                  <a
                    href="https://developer.twitter.com/en/apply-for-access"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    developer.twitter.com
                  </a>
                  .
                </p>

                <h3 className="text-lg font-medium">Step 2: Create a Twitter Project and App</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Once approved, go to the{' '}
                    <a
                      href="https://developer.twitter.com/en/portal/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Developer Portal
                    </a>
                    .
                  </li>
                  <li>Create a new Project and then create an App within that Project.</li>
                  <li>Fill in the required details for your app.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 3: Set Up App Permissions</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>In your app settings, go to the &quot;App permissions&quot; section.</li>
                  <li>
                    Select &quot;Read&quot; or &quot;Read and Write&quot; depending on your needs.
                  </li>
                  <li>Save your changes.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 4: Generate Access Tokens</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to the &quot;Keys and tokens&quot; tab.</li>
                  <li>
                    Under &quot;Authentication Tokens&quot;, click &quot;Generate&quot; for
                    &quot;Access Token and Secret&quot;.
                  </li>
                  <li>Save both the Access Token and Access Token Secret.</li>
                </ol>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Important Note About Twitter API v2</AlertTitle>
                  <AlertDescription>
                    <p>
                      Twitter has moved to API v2, which uses OAuth 2.0. For newer applications, you
                      should:
                    </p>
                    <ol className="list-decimal pl-5 mt-2">
                      <li>
                        Generate a Bearer Token instead of using the older Access Token/Secret pair.
                      </li>
                      <li>Use the OAuth 2.0 authorization flow for user-context requests.</li>
                    </ol>
                    <p className="mt-2">Our application supports both authentication methods.</p>
                  </AlertDescription>
                </Alert>

                <h3 className="text-lg font-medium">Step 5: OAuth 2.0 Setup (Recommended)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    In your app settings, go to the &quot;User authentication settings&quot; section
                    and click &quot;Set up&quot;.
                  </li>
                  <li>Enable &quot;OAuth 2.0&quot;.</li>
                  <li>Set the redirect URL to your application&apos;s callback URL.</li>
                  <li>
                    Select the required scopes (e.g., &quot;tweet.read&quot;,
                    &quot;users.read&quot;).
                  </li>
                  <li>Save your changes.</li>
                </ol>

                <h3 className="text-lg font-medium">Testing Your Token</h3>
                <p>You can test your token using a tool like Postman or curl:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  curl -X GET
                  &quot;https://api.twitter.com/2/tweets/search/recent?query=from:twitterdev&quot; \
                  -H &quot;Authorization: Bearer YOUR_BEARER_TOKEN&quot;
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instagram">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Access Token</CardTitle>
                <CardDescription>
                  How to create and use Instagram Graph API access tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Create a Facebook Developer Account</h3>
                <p>
                  Instagram API access is managed through Facebook. Create a Facebook Developer
                  account at{' '}
                  <a
                    href="https://developers.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    developers.facebook.com
                  </a>
                  .
                </p>

                <h3 className="text-lg font-medium">Step 2: Create a Facebook App</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to the{' '}
                    <a
                      href="https://developers.facebook.com/apps/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Facebook Apps page
                    </a>
                    .
                  </li>
                  <li>
                    Click &quot;Create App&quot; and select &quot;Business&quot; as the app type.
                  </li>
                  <li>Fill in the required information and create your app.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 3: Add Instagram Basic Display</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>In your app dashboard, click &quot;Add Product&quot; in the left sidebar.</li>
                  <li>Find &quot;Instagram Basic Display&quot; and click &quot;Set Up&quot;.</li>
                  <li>Add your app&apos;s privacy policy URL and website URL.</li>
                  <li>Add a Valid OAuth Redirect URI (your application&apos;s callback URL).</li>
                  <li>Save your changes.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 4: Add Instagram Graph API</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>In your app dashboard, click &quot;Add Product&quot; again.</li>
                  <li>Find &quot;Instagram Graph API&quot; and click &quot;Set Up&quot;.</li>
                </ol>

                <h3 className="text-lg font-medium">
                  Step 5: Connect an Instagram Business Account
                </h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Make sure your Instagram account is converted to a Business or Creator account.
                  </li>
                  <li>
                    Link your Instagram account to a Facebook Page (in Instagram app settings).
                  </li>
                  <li>
                    In your Facebook App, go to &quot;Instagram Graph API&quot; → &quot;Basic
                    Display&quot;.
                  </li>
                  <li>Click &quot;Add or Remove Instagram Testers&quot;.</li>
                  <li>
                    Add your Instagram account as a tester and accept the invitation from your
                    Instagram account.
                  </li>
                </ol>

                <h3 className="text-lg font-medium">Step 6: Generate an Access Token</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    In your app, go to &quot;Instagram Graph API&quot; → &quot;Basic Display&quot; →
                    &quot;User Token Generator&quot;.
                  </li>
                  <li>Click &quot;Generate Token&quot; for your Instagram account.</li>
                  <li>Authorize your app when prompted.</li>
                  <li>Copy the generated access token.</li>
                </ol>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Token Expiration</AlertTitle>
                  <AlertDescription>
                    <p>
                      Instagram access tokens are valid for 60 days. For long-term access,
                      you&apos;ll need to implement a token refresh mechanism.
                    </p>
                  </AlertDescription>
                </Alert>

                <h3 className="text-lg font-medium">Testing Your Token</h3>
                <p>You can test your token using the Graph API Explorer or a tool like Postman:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  curl -X GET
                  &quot;https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN&quot;
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiktok">
            <Card>
              <CardHeader>
                <CardTitle>TikTok Access Token</CardTitle>
                <CardDescription>How to create and use TikTok API access tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">
                  Step 1: Join the TikTok for Developers Program
                </h3>
                <p>
                  Register for a TikTok for Developers account at{' '}
                  <a
                    href="https://developers.tiktok.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    developers.tiktok.com
                  </a>
                  .
                </p>

                <h3 className="text-lg font-medium">Step 2: Create a TikTok App</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Log in to the{' '}
                    <a
                      href="https://developers.tiktok.com/app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      TikTok Developer Portal
                    </a>
                    .
                  </li>
                  <li>Click &quot;Create App&quot; and fill in the required information.</li>
                  <li>Select the appropriate app type and category.</li>
                  <li>Submit your app for review.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 3: Configure Your App</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Once your app is approved, go to your app&apos;s dashboard.</li>
                  <li>Add a redirect URI in the &quot;App Information&quot; section.</li>
                  <li>Enable the required scopes under &quot;Permissions&quot;.</li>
                  <li>Save your changes.</li>
                </ol>

                <h3 className="text-lg font-medium">Step 4: Implement OAuth 2.0 Flow</h3>
                <p>TikTok uses OAuth 2.0 for authentication. You&apos;ll need to:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Redirect users to the TikTok authorization URL:
                    <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                      https://open-api.tiktok.com/platform/oauth/connect?client_key=YOUR_CLIENT_KEY&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user.info.basic
                    </pre>
                  </li>
                  <li>
                    After the user authorizes your app, TikTok will redirect to your redirect URI
                    with an authorization code.
                  </li>
                  <li>
                    Exchange this code for an access token by making a POST request to:
                    <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                      https://open-api.tiktok.com/oauth/access_token/
                    </pre>
                  </li>
                </ol>

                <h3 className="text-lg font-medium">Step 5: Store Your Credentials</h3>
                <p>Save these credentials securely:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Client Key</strong>: Found in your app&apos;s dashboard
                  </li>
                  <li>
                    <strong>Client Secret</strong>: Found in your app&apos;s dashboard
                  </li>
                  <li>
                    <strong>Access Token</strong>: Obtained through the OAuth flow
                  </li>
                </ul>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>TikTok API Limitations</AlertTitle>
                  <AlertDescription>
                    <p>The TikTok API has several limitations:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Access to certain endpoints may require additional approval.</li>
                      <li>Rate limits are strictly enforced.</li>
                      <li>Access tokens expire after a certain period and need to be refreshed.</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <h3 className="text-lg font-medium">Testing Your Token</h3>
                <p>You can test your token using a tool like Postman or curl:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  curl -X GET &quot;https://open-api.tiktok.com/v2/user/info/&quot; \ -H
                  &quot;Authorization: Bearer YOUR_ACCESS_TOKEN&quot;
                </pre>

                <h3 className="text-lg font-medium">Alternative: TikTok Live API</h3>
                <p>
                  For TikTok Live streaming data, you can use the unofficial TikTok Live Client:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Install the TikTok Live Client library:
                    <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                      npm install tiktok-live-connector
                    </pre>
                  </li>
                  <li>
                    Use the library to connect to TikTok Live streams without needing an official
                    API token:
                    <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                      {`const { WebcastPushConnection } = require(&apos;tiktok-live-connector&apos;);
                      const tiktokLiveConnection = new WebcastPushConnection(&apos;@username&apos;);`}
                    </pre>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
