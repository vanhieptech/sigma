'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Volume2,
  VolumeX,
  Send,
  Mic,
  Play,
  Pause,
  Trash,
  RepeatIcon,
  Settings,
  Wand2,
  RefreshCw,
  Music,
  Gauge,
} from 'lucide-react';
import { AIConfig, VoiceSettings, TikTokEvent, TikTokEventType } from '@/types/tiktok';

interface VoiceResponseProps {
  aiConfig: AIConfig;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  isConnected: boolean;
  events: TikTokEvent[];
  sendAnnouncement?: (text: string, level?: 'normal' | 'highlight' | 'super') => Promise<void>;
}

// Define voice options
const VOICE_OPTIONS = [
  { id: 'nova', name: 'Nova (Female)', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer (Female)', gender: 'female' },
  { id: 'alloy', name: 'Alloy (Male)', gender: 'male' },
  { id: 'echo', name: 'Echo (Male)', gender: 'male' },
  { id: 'fable', name: 'Fable (Female)', gender: 'female' },
  { id: 'onyx', name: 'Onyx (Male)', gender: 'male' },
];

// Define TTS models
const TTS_MODELS = [
  { id: 'tts-1', name: 'Standard' },
  { id: 'tts-1-hd', name: 'High Definition' },
];

// Define speech styles
const SPEECH_STYLES = [
  { id: 'cheerful', name: 'Cheerful' },
  { id: 'excited', name: 'Excited' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'hopeful', name: 'Hopeful' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'sad', name: 'Sad' },
  { id: 'serious', name: 'Serious' },
  { id: 'empathetic', name: 'Empathetic' },
];

// Define languages
const LANGUAGES = [
  { id: 'en-US', name: 'English (US)' },
  { id: 'en-GB', name: 'English (UK)' },
  { id: 'es-ES', name: 'Spanish' },
  { id: 'fr-FR', name: 'French' },
  { id: 'de-DE', name: 'German' },
  { id: 'it-IT', name: 'Italian' },
  { id: 'ja-JP', name: 'Japanese' },
  { id: 'ko-KR', name: 'Korean' },
  { id: 'pt-BR', name: 'Portuguese (Brazil)' },
  { id: 'zh-CN', name: 'Chinese (Simplified)' },
];

// Sample response templates
const RESPONSE_TEMPLATES = [
  {
    id: 'greeting',
    name: 'Greeting',
    text: 'Hey everyone! Welcome to the stream! So excited to have you all here today!',
  },
  {
    id: 'thanks',
    name: 'Thank for Gift',
    text: 'Wow! Thank you so much for the amazing gift! I really appreciate your support!',
  },
  {
    id: 'question',
    name: 'Common Question',
    text: 'Great question! Let me explain how this works...',
  },
  {
    id: 'milestone',
    name: 'Milestone',
    text: 'OMG! We just reached 500 viewers! Thank you all so much for being here!',
  },
  {
    id: 'goodbye',
    name: 'Goodbye',
    text: 'Thanks for watching everyone! Hope you enjoyed the stream. See you next time!',
  },
];

export function VoiceResponse({
  aiConfig,
  updateAIConfig,
  isConnected,
  events,
  sendAnnouncement,
}: VoiceResponseProps) {
  const [customText, setCustomText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [responseHistory, setResponseHistory] = useState<{ text: string; timestamp: number }[]>([]);
  const [currentResponseTemplate, setCurrentResponseTemplate] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get voice settings from AI config
  const voiceSettings = aiConfig.voiceSettings;

  // Update voice settings
  const updateVoiceSettings = useCallback(
    (settings: Partial<VoiceSettings>) => {
      updateAIConfig({
        voiceSettings: {
          ...voiceSettings,
          ...settings,
        },
      });
    },
    [updateAIConfig, voiceSettings]
  );

  // Handle audio end
  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [handleAudioEnd]);

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update audio source when URL changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  // Track AI responses in events
  useEffect(() => {
    const aiResponses = events.filter(event => event.type === 'aiResponse');
    if (aiResponses.length === 0) return;

    // Get newest AI response that isn't already in our history
    const latestResponse = aiResponses[aiResponses.length - 1];
    const responseData = latestResponse.data as any;

    // Check if this response is already in our history
    const existingResponse = responseHistory.find(
      r => r.timestamp === responseData.timestamp && r.text === responseData.text
    );

    if (!existingResponse) {
      setResponseHistory(prev => [
        ...prev,
        {
          text: responseData.text,
          timestamp: responseData.timestamp,
        },
      ]);

      // If audio URL is provided, play it
      if (responseData.audioUrl) {
        setAudioUrl(responseData.audioUrl);
        playAudio(responseData.audioUrl);
      }
    }
  }, [events, responseHistory]);

  // Play audio from URL
  const playAudio = (url: string) => {
    if (!audioRef.current) return;

    audioRef.current.src = url;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Generate speech from text
  const generateSpeech = async (text: string = customText) => {
    if (!text.trim()) return;

    setIsGenerating(true);

    try {
      // In a real implementation, this would call an API to generate speech
      // For demo purposes, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock generated audio URL
      const mockAudioUrl = `data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV`;

      setAudioUrl(mockAudioUrl);
      playAudio(mockAudioUrl);

      // Add to response history
      setResponseHistory(prev => [
        ...prev,
        {
          text,
          timestamp: Date.now(),
        },
      ]);

      // Clear custom text
      setCustomText('');

      // Send as announcement if connected and function provided
      if (isConnected && sendAnnouncement) {
        await sendAnnouncement(text);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle response template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = RESPONSE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCustomText(template.text);
      setCurrentResponseTemplate(templateId);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Response System</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} disabled={!audioUrl}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              className="w-24"
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={val => setVolume(val[0])}
            />
          </div>
        </CardTitle>
        <CardDescription>Generate voice responses for your live stream</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="custom">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="custom">Custom Message</TabsTrigger>
            <TabsTrigger value="settings">Voice Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="messageText">Message Text</Label>
                <Select value={currentResponseTemplate || ''} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue placeholder="Templates" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSE_TEMPLATES.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                id="messageText"
                placeholder="Type your message here..."
                className="min-h-[100px]"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomText('')}
                  disabled={!customText.trim()}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => generateSpeech()}
                  disabled={!customText.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Speech
                    </>
                  )}
                </Button>
              </div>
            </div>

            {audioUrl && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Preview</h4>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                          if (!isPlaying) {
                            audioRef.current
                              .play()
                              .then(() => setIsPlaying(true))
                              .catch(console.error);
                          }
                        }
                      }}
                    >
                      <RepeatIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground border-l-2 pl-3 italic">
                  {responseHistory.length > 0 && responseHistory[responseHistory.length - 1].text}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Response History</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResponseHistory([])}
                  disabled={responseHistory.length === 0}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              <ScrollArea className="h-[200px] rounded-md border">
                {responseHistory.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No responses yet
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {responseHistory
                      .slice()
                      .reverse()
                      .map((response, index) => (
                        <div key={index} className="border rounded-md p-2 space-y-1">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="h-5 px-1 text-xs">
                              {formatTimestamp(response.timestamp)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setCustomText(response.text)}
                            >
                              <RepeatIcon className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs truncate">{response.text}</p>
                        </div>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voice">Voice</Label>
                  <Select
                    value={voiceSettings.voice}
                    onValueChange={value => updateVoiceSettings({ voice: value })}
                  >
                    <SelectTrigger id="voice">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_OPTIONS.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">TTS Model</Label>
                  <Select
                    value={voiceSettings.model}
                    onValueChange={value => updateVoiceSettings({ model: value })}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {TTS_MODELS.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={voiceSettings.language}
                    onValueChange={value => updateVoiceSettings({ language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(language => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="speed">Speed</Label>
                    <span className="text-xs text-muted-foreground">
                      {voiceSettings.speed.toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    id="speed"
                    min={0.25}
                    max={2.0}
                    step={0.05}
                    value={[voiceSettings.speed]}
                    onValueChange={values => updateVoiceSettings({ speed: values[0] })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pitch">Pitch</Label>
                    <span className="text-xs text-muted-foreground">
                      {voiceSettings.pitch.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="pitch"
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    value={[voiceSettings.pitch]}
                    onValueChange={values => updateVoiceSettings({ pitch: values[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stability" className="flex items-center">
                      <Gauge className="h-4 w-4 mr-1" />
                      Stability
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {voiceSettings.stability.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="stability"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[voiceSettings.stability]}
                    onValueChange={values => updateVoiceSettings({ stability: values[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="style" className="flex items-center">
                      <Music className="h-4 w-4 mr-1" />
                      Style Factor
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {voiceSettings.style.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="style"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[voiceSettings.style]}
                    onValueChange={values => updateVoiceSettings({ style: values[0] })}
                  />
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Voice Response Settings</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAI" className="cursor-pointer">
                      Enable AI Responses
                    </Label>
                    <Switch
                      id="enableAI"
                      checked={aiConfig.enableAIResponses}
                      onCheckedChange={checked => updateAIConfig({ enableAIResponses: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoTranslation" className="cursor-pointer">
                      Auto-Translate Comments
                    </Label>
                    <Switch
                      id="autoTranslation"
                      checked={aiConfig.autoTranslation}
                      onCheckedChange={checked => updateAIConfig({ autoTranslation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sentimentAnalysis" className="cursor-pointer">
                      Sentiment Analysis
                    </Label>
                    <Switch
                      id="sentimentAnalysis"
                      checked={aiConfig.sentimentAnalysis}
                      onCheckedChange={checked => updateAIConfig({ sentimentAnalysis: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="space-y-2 w-full">
          <h3 className="text-sm font-medium">Quick Response</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSpeech('Thank you for the gift! I really appreciate it!')}
            >
              Thank for Gift
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSpeech('Thank you all for the likes! Keep them coming!')}
            >
              Thank for Likes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                generateSpeech('Welcome to the stream! So glad you could join us today!')
              }
            >
              Welcome Viewer
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
