'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { VirtualAvatar } from '@/types/tiktok';
import { Palette, Sliders, User, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface VirtualAvatarSelectorProps {
  virtualAvatar: VirtualAvatar | null;
  setVirtualAvatar: (avatar: VirtualAvatar | null) => void;
  updateVirtualAvatar: (updates: Partial<VirtualAvatar>) => void;
}

// Sample avatar presets
const AVATAR_PRESETS: VirtualAvatar[] = [
  {
    id: 'avatar-1',
    name: 'Basic Avatar',
    imageUrl: 'https://placekitten.com/300/300',
    model: 'basic-model',
    animations: ['talk', 'smile', 'surprise', 'nod'],
    expressions: ['happy', 'neutral', 'surprised', 'thinking'],
    isActive: false,
    style: 'realistic',
    expressiveness: 50,
    voiceSyncAccuracy: 80,
  },
  {
    id: 'avatar-2',
    name: 'Anime Style',
    imageUrl: 'https://placekitten.com/301/301',
    model: 'anime-model',
    animations: ['talk', 'smile', 'surprise', 'nod', 'wave', 'dance'],
    expressions: ['happy', 'neutral', 'surprised', 'thinking', 'excited', 'laughing'],
    isActive: false,
    style: 'anime',
    expressiveness: 70,
    voiceSyncAccuracy: 85,
  },
  {
    id: 'avatar-3',
    name: 'Realistic',
    imageUrl: 'https://placekitten.com/302/302',
    model: 'realistic-model',
    animations: ['talk', 'smile', 'surprise', 'nod', 'wave', 'dance', 'wink'],
    expressions: ['happy', 'neutral', 'surprised', 'thinking', 'excited', 'laughing', 'confused'],
    isActive: false,
    style: 'realistic',
    expressiveness: 90,
    voiceSyncAccuracy: 95,
  },
];

// Sample backgrounds
const VIRTUAL_BACKGROUNDS = [
  { id: 'bg-1', name: 'Studio Setup', url: 'https://placekitten.com/1920/1080' },
  { id: 'bg-2', name: 'Living Room', url: 'https://placekitten.com/1921/1080' },
  { id: 'bg-3', name: 'Office Space', url: 'https://placekitten.com/1922/1080' },
  { id: 'bg-4', name: 'Outdoor Garden', url: 'https://placekitten.com/1923/1080' },
  { id: 'bg-5', name: 'Abstract Pattern', url: 'https://placekitten.com/1924/1080' },
];

const AVATAR_STYLES = [
  { id: 'realistic', name: 'Realistic', description: 'Photorealistic appearance' },
  { id: 'anime', name: 'Anime', description: 'Japanese anime style' },
  { id: 'cartoon', name: 'Cartoon', description: 'Stylized cartoon look' },
  { id: 'pixel', name: 'Pixel Art', description: 'Retro pixel art style' },
  { id: '3d', name: '3D Rendered', description: 'Three-dimensional look' },
];

export function VirtualAvatarSelector({
  virtualAvatar,
  setVirtualAvatar,
  updateVirtualAvatar,
}: VirtualAvatarSelectorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [isWebcamAvailable, setIsWebcamAvailable] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check webcam availability
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setIsWebcamAvailable(true))
      .catch(() => setIsWebcamAvailable(false));

    return () => {
      // Stop webcam when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle avatar activation
  const toggleAvatarActive = () => {
    if (virtualAvatar) {
      updateVirtualAvatar({ isActive: !virtualAvatar.isActive });
    }
  };

  // Handle preset selection
  const handlePresetSelect = (avatarId: string) => {
    const selectedAvatar = AVATAR_PRESETS.find(avatar => avatar.id === avatarId);
    if (selectedAvatar) {
      setVirtualAvatar({ ...selectedAvatar, isActive: true });
      setSelectedPreset(avatarId);
    }
  };

  // Handle background selection
  const handleBackgroundSelect = (bgId: string) => {
    const selectedBg = VIRTUAL_BACKGROUNDS.find(bg => bg.id === bgId);
    if (selectedBg && virtualAvatar) {
      updateVirtualAvatar({
        model: `${virtualAvatar.model}-${bgId}`, // Update model to include background
      });
      setSelectedBackground(bgId);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          setPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Process uploaded image to create an avatar
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // In a real implementation, this would upload the image to a server
      // and process it to create a 3D avatar model

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a new avatar from the uploaded image
      const newAvatar: VirtualAvatar = {
        id: `avatar-custom-${Date.now()}`,
        name: 'Custom Avatar',
        imageUrl: preview || 'https://placekitten.com/310/310',
        model: 'custom-model',
        animations: ['talk', 'smile', 'nod'],
        expressions: ['happy', 'neutral', 'surprised'],
        isActive: true,
        style: 'realistic',
        expressiveness: 50,
        voiceSyncAccuracy: 80,
      };

      setVirtualAvatar(newAvatar);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error creating avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Start webcam
  const startWebcam = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCapturing(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setIsWebcamAvailable(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsCapturing(false);
  };

  // Capture still image from webcam
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL and create file
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'avatar-capture.png', { type: 'image/png' });
          setFile(file);
          setPreview(canvas.toDataURL('image/png'));
          stopWebcam();
        }
      }, 'image/png');
    }
  };

  const handleStyleChange = (style: string) => {
    if (virtualAvatar) {
      updateVirtualAvatar({ style });
    }
  };

  const handleGenerateAvatar = () => {
    setIsGenerating(true);
    // Simulate avatar generation
    setTimeout(() => {
      if (virtualAvatar) {
        updateVirtualAvatar({
          lastGenerated: new Date().toISOString(),
        });
      }
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Virtual Avatar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              id="avatar-enabled"
              checked={virtualAvatar?.isActive}
              onCheckedChange={toggleAvatarActive}
            />
            <Label htmlFor="avatar-enabled">Enabled</Label>
          </div>
        </div>
        <CardDescription>Customize your virtual avatar for live streams</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="presets" className="flex gap-2 items-center">
              <Wand2 className="h-4 w-4" />
              <span>Presets</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="flex gap-2 items-center">
              <Palette className="h-4 w-4" />
              <span>Style</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex gap-2 items-center">
              <Sliders className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AVATAR_PRESETS.map(preset => (
                <div
                  key={preset.id}
                  className={cn(
                    'border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors',
                    virtualAvatar?.id === preset.id && 'border-primary bg-primary/5'
                  )}
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-2">
                    <Image
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                    />
                  </div>
                  <p className="text-sm font-medium text-center">{preset.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <RadioGroup
              value={virtualAvatar?.style}
              onValueChange={handleStyleChange}
              className="space-y-3"
            >
              {AVATAR_STYLES.map(style => (
                <div key={style.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={style.id} id={`style-${style.id}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`style-${style.id}`} className="font-medium">
                      {style.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom Prompt</Label>
                <Input
                  id="custom-prompt"
                  placeholder="Describe your avatar in detail..."
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Describe specific details for your avatar like clothing, accessories, background,
                  etc.
                </p>
              </div>

              <Button
                onClick={handleGenerateAvatar}
                disabled={!customPrompt.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Avatar'}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="expressiveness">Expressiveness</Label>
                  <span className="text-sm text-muted-foreground">
                    {virtualAvatar?.expressiveness ?? 0}%
                  </span>
                </div>
                <Slider
                  id="expressiveness"
                  min={0}
                  max={100}
                  step={5}
                  value={[virtualAvatar?.expressiveness ?? 0]}
                  onValueChange={value => updateVirtualAvatar({ expressiveness: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls how expressive your avatar&apos;s facial animations will be
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="voice-sync">Voice Sync Accuracy</Label>
                  <span className="text-sm text-muted-foreground">
                    {virtualAvatar?.voiceSyncAccuracy ?? 0}%
                  </span>
                </div>
                <Slider
                  id="voice-sync"
                  min={0}
                  max={100}
                  step={5}
                  value={[virtualAvatar?.voiceSyncAccuracy ?? 0]}
                  onValueChange={value => updateVirtualAvatar({ voiceSyncAccuracy: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls how accurately your avatar&apos;s mouth movements match your voice
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Preview</h3>
            <p className="text-xs text-muted-foreground">
              Last updated:{' '}
              {virtualAvatar?.lastGenerated
                ? new Date(virtualAvatar.lastGenerated).toLocaleString()
                : 'Never'}
            </p>
          </div>

          <div className="mt-4 aspect-video bg-muted rounded-lg flex items-center justify-center">
            {virtualAvatar?.imageUrl ? (
              <Image
                src={virtualAvatar.imageUrl}
                alt="Virtual Avatar Preview"
                className="max-h-full rounded-lg"
                width={300}
                height={300}
              />
            ) : (
              <div className="text-center p-4">
                <User className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {isGenerating ? 'Generating preview...' : 'No avatar generated yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
