'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTikTokStream } from '@/hooks/use-tiktok-stream';
import { Activity, Lightbulb, MessageSquare, Mic2, PanelTopOpen, User, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CommentManager } from './comment-manager';
import { ContentSuggestions } from './content-suggestions';
import { PollCreator } from './poll-creator';
import { VirtualAvatarSelector } from './virtual-avatar';
import { VoiceResponse } from './voice-response';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, XCircle, CheckCircle } from 'lucide-react';

interface LiveStreamDashboardProps {
  userId?: string;
}

export function LiveStreamDashboard({ userId = 'demo-user' }: LiveStreamDashboardProps) {
  const [username, setUsername] = useState<string>('');
  const [connectionLog, setConnectionLog] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  const {
    events,
    connectionState,
    viewerCount,
    aiConfig,
    streamSettings,
    activePolls,
    questions,
    milestones,
    virtualAvatar,
    updateAIConfig,
    updateStreamSettings,
    connect,
    disconnect,
    isConnected,
    error: connectionError,
    uniqueId,
    createPoll,
    endPoll,
    addQuestion,
    answerQuestion,
    setVirtualAvatar,
    updateVirtualAvatar,
    sendAnnouncement,
    pinComment,
    toggleMute,
  } = useTikTokStream();

  // Add connection state and error logging
  useEffect(() => {
    const timestamp = new Date().toISOString().slice(11, 19);
    let logMessage = '';

    // Log connection state changes
    if (connectionState.state === 'CONNECTING') {
      logMessage = `[${timestamp}] Connecting to TikTok username: @${connectionState.targetUniqueId}`;
    } else if (connectionState.state === 'CONNECTED') {
      logMessage = `[${timestamp}] Successfully connected to @${connectionState.targetUniqueId}`;
    } else if (connectionState.state === 'DISCONNECTED') {
      logMessage = `[${timestamp}] Disconnected from TikTok`;
      if (connectionState.serverError) {
        logMessage += ` - Error: ${connectionState.serverError}`;
      }
    }

    if (logMessage) {
      console.log(logMessage); // Browser console logging
      setConnectionLog(prev => [logMessage, ...prev].slice(0, 50)); // Keep last 50 logs
    }
  }, [connectionState]);

  // Log when we receive connection errors
  useEffect(() => {
    if (connectionError) {
      const timestamp = new Date().toISOString().slice(11, 19);
      const logMessage = `[${timestamp}] Error: ${connectionError}`;
      console.error(logMessage); // Browser console error logging
      setConnectionLog(prev => [logMessage, ...prev].slice(0, 50));
    }
  }, [connectionError]);

  // Log when we receive events
  useEffect(() => {
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      const timestamp = new Date().toISOString().slice(11, 19);
      const logMessage = `[${timestamp}] Received event: ${lastEvent.type}`;
      console.log(`Event received:`, lastEvent); // Detailed logging
      setConnectionLog(prev => [logMessage, ...prev].slice(0, 50));
    }
  }, [events.length]);

  // Extract comment keywords for content suggestions (simplified implementation)
  const commentKeywords = events
    .filter(event => event.type === 'comment')
    .map(event => (event.data as any).comment)
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4)
    .filter((word, i, arr) => arr.indexOf(word) === i)
    .slice(0, 10);

  const handleConnect = () => {
    if (!username.trim()) {
      return;
    }

    // Clean up username - remove @ if present
    const cleanUsername = username.trim().replace(/^@/, '');

    // Add verbose logging
    console.log(`Attempting to connect to TikTok username: @${cleanUsername}`);
    setConnectionLog(prev => [
      `[${new Date().toISOString().slice(11, 19)}] Attempting to connect to @${cleanUsername}`,
      ...prev,
    ]);

    try {
      connect(cleanUsername);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Connection error: ${errorMessage}`, err);
      setConnectionLog(prev => [
        `[${new Date().toISOString().slice(11, 19)}] Connection error: ${errorMessage}`,
        ...prev,
      ]);
    }
  };

  const handleDisconnect = () => {
    console.log(`Disconnecting from TikTok`);
    setConnectionLog(prev => [
      `[${new Date().toISOString().slice(11, 19)}] User initiated disconnect`,
      ...prev,
    ]);
    disconnect();
  };

  // Add a function to provide a test connection option
  const handleTestConnection = () => {
    // Use a known public TikTok account that's likely to be live streaming
    const testUsername = 'tiktok';

    console.log(`Testing connection with @${testUsername}`);
    setConnectionLog(prev => [
      `[${new Date().toISOString().slice(11, 19)}] Testing connection with @${testUsername}`,
      ...prev,
    ]);

    try {
      setUsername(testUsername);
      connect(testUsername);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Test connection error: ${errorMessage}`, err);
      setConnectionLog(prev => [
        `[${new Date().toISOString().slice(11, 19)}] Test connection error: ${errorMessage}`,
        ...prev,
      ]);
    }
  };

  return (
    <div className="container mx-auto space-y-6 pb-10">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <CardTitle>TikTok Live Stream Dashboard</CardTitle>

            {!isConnected ? (
              <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row">
                <Input
                  type="text"
                  placeholder="TikTok username (e.g. tiktok)"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full max-w-xs"
                  onKeyDown={e => e.key === 'Enter' && handleConnect()}
                />
                <div className="flex gap-2">
                  <Button
                    disabled={!username.trim() || connectionState.state === 'CONNECTING'}
                    onClick={handleConnect}
                  >
                    {connectionState.state === 'CONNECTING' ? 'Connecting...' : 'Connect'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={connectionState.state === 'CONNECTING'}
                  >
                    Test Connection
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-primary/10">
                    <User className="h-3 w-3 mr-1" />
                    {connectionState.targetUniqueId}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    <Users className="h-3 w-3 mr-1" />
                    {viewerCount}
                  </Badge>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            Manage your live stream, engage with viewers, and grow your audience
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Connection Status Alert */}
      {connectionState.state === 'CONNECTING' && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>Connecting...</AlertTitle>
          <AlertDescription>
            Attempting to connect to @{connectionState.targetUniqueId}. This may take a few moments.
          </AlertDescription>
        </Alert>
      )}

      {connectionError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {connectionError}
            {connectionState.serverError && (
              <div className="mt-2">Server message: {connectionState.serverError}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Connected</AlertTitle>
          <AlertDescription>
            Successfully connected to @{connectionState.targetUniqueId}
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Diagnostics */}
      <Card className="border-dashed">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Connection Diagnostics</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowLogs(!showLogs)}>
              {showLogs ? 'Hide Logs' : 'Show Logs'}
            </Button>
          </div>
        </CardHeader>
        {showLogs && (
          <CardContent className="text-xs font-mono bg-slate-50 p-4 max-h-60 overflow-y-auto">
            {connectionLog.length > 0 ? (
              <div className="space-y-1">
                {connectionLog.map((log, i) => (
                  <div key={i} className={log.includes('Error') ? 'text-red-600' : ''}>
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No connection logs yet</div>
            )}
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
          <TabsTrigger value="overview" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex gap-2 items-center">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Comments</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex gap-2 items-center">
            <Mic2 className="h-4 w-4" />
            <span className="hidden md:inline">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Avatar</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex gap-2 items-center">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden md:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="stream" className="flex gap-2 items-center">
            <PanelTopOpen className="h-4 w-4" />
            <span className="hidden md:inline">Stream</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Viewers</CardTitle>
                <CardDescription>{viewerCount} viewers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{viewerCount}</div>
                <p className="text-xs text-muted-foreground">
                  {isConnected
                    ? `Connected to @${connectionState.targetUniqueId}`
                    : 'Not connected'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Comments</CardTitle>
                <CardDescription>Engagement rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.filter(event => event.type === 'comment').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {viewerCount > 0
                    ? `${((events.filter(event => event.type === 'comment').length / viewerCount) * 100).toFixed(1)}% engagement rate`
                    : 'No viewers yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Polls</CardTitle>
                <CardDescription>Interactive elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activePolls.filter(poll => poll.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activePolls.filter(poll => poll.isActive).length > 0
                    ? `${activePolls.filter(poll => poll.isActive).length} polls running`
                    : 'No active polls'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stream Status</CardTitle>
                <CardDescription>Current state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isConnected ? 'Live' : 'Offline'}</div>
                <p className="text-xs text-muted-foreground">
                  {isConnected
                    ? `Stream quality: ${connectionState.connectionQuality || 'good'}`
                    : 'Not streaming'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CommentManager
              events={events}
              aiConfig={aiConfig}
              updateAIConfig={updateAIConfig}
              isConnected={isConnected}
              pinComment={pinComment}
              toggleMute={toggleMute}
              addQuestion={addQuestion}
            />

            <div className="grid gap-6">
              <PollCreator createPoll={createPoll} endPoll={endPoll} activePolls={activePolls} />

              <VoiceResponse
                aiConfig={aiConfig}
                updateAIConfig={updateAIConfig}
                isConnected={isConnected}
                events={events}
                sendAnnouncement={sendAnnouncement}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <CommentManager
            events={events}
            aiConfig={aiConfig}
            updateAIConfig={updateAIConfig}
            isConnected={isConnected}
            pinComment={pinComment}
            toggleMute={toggleMute}
            addQuestion={addQuestion}
          />
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <VoiceResponse
            aiConfig={aiConfig}
            updateAIConfig={updateAIConfig}
            isConnected={isConnected}
            events={events}
            sendAnnouncement={sendAnnouncement}
          />
        </TabsContent>

        <TabsContent value="avatar" className="space-y-6">
          <VirtualAvatarSelector
            virtualAvatar={virtualAvatar}
            setVirtualAvatar={setVirtualAvatar}
            updateVirtualAvatar={updateVirtualAvatar}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ContentSuggestions
              isLiveActive={isConnected}
              currentTopic={connectionState.targetUniqueId}
              commentKeywords={commentKeywords}
            />

            <PollCreator createPoll={createPoll} endPoll={endPoll} activePolls={activePolls} />
          </div>
        </TabsContent>

        <TabsContent value="stream" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
              <CardDescription>Configure your live stream settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">
                  Stream configuration panel will be added in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
