'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from '@/src/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VoiceSettings, AIPersonality } from '@/lib/ai-voice'
import { BrainCircuit, Save, MessageSquare, Gift, Heart, Share, UserPlus, Users } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "AI name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  voiceSettings: z.object({
    voice: z.string(),
    model: z.enum(['tts-1', 'tts-1-hd']),
    speed: z.number().min(0.25).max(4.0),
    responseStyle: z.enum(['casual', 'professional', 'enthusiastic', 'friendly']),
  }),
  productKnowledge: z.string().min(50, {
    message: "Product knowledge must be at least 50 characters.",
  }),
  greetingTemplate: z.string().min(10, {
    message: "Greeting template must be at least 10 characters.",
  }),
  purchaseTemplate: z.string().min(10, {
    message: "Purchase template must be at least 10 characters.",
  }),
  likeTemplate: z.string().min(10, {
    message: "Like template must be at least 10 characters.",
  }),
  giftTemplate: z.string().min(10, {
    message: "Gift template must be at least 10 characters.",
  }),
  joinTemplate: z.string().min(10, {
    message: "Join template must be at least 10 characters.",
  }),
  questionTemplate: z.string().min(10, {
    message: "Question template must be at least 10 characters.",
  }),
});

interface AIPersonalitySettingsProps {
  storeId: string;
  initialPersonality?: AIPersonality;
  onSave?: (personality: AIPersonality) => void;
}

export function AIPersonalitySettings({ storeId, initialPersonality, onSave }: AIPersonalitySettingsProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewText, setPreviewText] = useState("");
  
  const defaultValues: AIPersonality = initialPersonality || {
    name: 'Store Assistant',
    description: 'A helpful and friendly sales assistant for your TikTok live stream',
    voiceSettings: {
      voice: 'nova',
      model: 'tts-1-hd',
      speed: 1.0,
      responseStyle: 'friendly'
    },
    productKnowledge: 'Our store offers high-quality products at competitive prices. We have a wide selection of items including clothing, accessories, and beauty products. We ship worldwide and offer free shipping on orders over $50.',
    greetingTemplate: 'Hello {{username}}, welcome to our live stream! How can I help you today?',
    purchaseTemplate: 'Thank you {{username}} for purchasing {{product}}! Great choice! We appreciate your support.',
    likeTemplate: 'Thanks for the likes {{username}}! Your support means a lot to us!',
    giftTemplate: 'Wow! Thank you {{username}} for the amazing {{giftName}} gift! We really appreciate your generosity!',
    joinTemplate: 'Welcome {{username}} to our live stream! Feel free to ask any questions about our products!',
    questionTemplate: '{{answer}}'
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call to save the personality
      console.log('Saving AI personality:', values);
      
      if (onSave) {
        onSave(values as AIPersonality);
      }
      
      toast({
        title: "AI Personality Saved",
        description: "Your AI personality settings have been updated",
      });
    } catch (error) {
      console.error('Error saving AI personality:', error);
      toast({
        title: "Error",
        description: "Failed to save AI personality settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  const generatePreview = (template: string, eventType: string) => {
    let preview = template;
    
    // Replace placeholders with sample data
    preview = preview.replace(/\{\{username\}\}/g, 'SampleUser');
    preview = preview.replace(/\{\{uniqueId\}\}/g, 'sample_user');
    preview = preview.replace(/\{\{product\}\}/g, 'Premium Widget');
    preview = preview.replace(/\{\{giftName\}\}/g, 'Rose');
    preview = preview.replace(/\{\{giftCount\}\}/g, '5');
    preview = preview.replace(/\{\{likeCount\}\}/g, '10');
    
    // For question template, add a sample answer
    if (eventType === 'question') {
      preview = preview.replace(/\{\{answer\}\}/g, 'Our Premium Widget comes in three colors: red, blue, and green. It costs $29.99 and includes free shipping!');
    }
    
    setPreviewText(preview);
    setPreviewMode(true);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5" />
          AI Personality Settings
        </CardTitle>
        <CardDescription>
          Configure how your AI sales assistant will interact with viewers during live streams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="voice">Voice & Style</TabsTrigger>
                <TabsTrigger value="responses">Response Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Assistant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Store Assistant" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your AI assistant a name that represents your brand.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A helpful and friendly sales assistant for your TikTok live stream"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your AI assistant&apos;s personality and role.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productKnowledge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Knowledge Base</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your products, pricing, shipping, and other important information..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide detailed information about your products and services. This will help the AI answer customer questions accurately.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="voice" className="space-y-4">
                <FormField
                  control={form.control}
                  name="voiceSettings.voice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Balanced)</SelectItem>
                          <SelectItem value="echo">Echo (Calm)</SelectItem>
                          <SelectItem value="fable">Fable (Expressive)</SelectItem>
                          <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Friendly)</SelectItem>
                          <SelectItem value="shimmer">Shimmer (Clear)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a voice that best represents your brand.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="voiceSettings.model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tts-1">Standard</SelectItem>
                          <SelectItem value="tts-1-hd">HD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        HD quality provides more natural and clear audio but uses more credits.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="voiceSettings.speed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speaking Speed: {field.value.toFixed(2)}x</FormLabel>
                      <FormControl>
                        <Slider
                          min={0.25}
                          max={4.0}
                          step={0.05}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Adjust how fast or slow the AI speaks. 1.0 is normal speed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="voiceSettings.responseStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how the AI should communicate with viewers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="responses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Greeting Template */}
                    <FormField
                      control={form.control}
                      name="greetingTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Greeting Template
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Hello {{username}}, welcome to our live stream!"
                                className="min-h-20 pr-20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => generatePreview(field.value, 'greeting')}
                              >
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            {'Use {{username}} for the viewer&apos;s name.'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Join Template */}
                    <FormField
                      control={form.control}
                      name="joinTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Join Template
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Welcome {{username}} to our live stream!"
                                className="min-h-20 pr-20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => generatePreview(field.value, 'join')}
                              >
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Message when someone joins the live stream.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Purchase Template */}
                    <FormField
                      control={form.control}
                      name="purchaseTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Gift className="mr-2 h-4 w-4" />
                            Purchase Template
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Thank you {{username}} for purchasing {{product}}!"
                                className="min-h-20 pr-20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => generatePreview(field.value, 'purchase')}
                              >
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            {'Use {{username}} for the buyer and {{product}} for the product name.'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {/* Gift Template */}
                    <FormField
                      control={form.control}
                      name="giftTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Gift className="mr-2 h-4 w-4" />
                            Gift Template
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Wow! Thank you {{username}} for the {{giftName}} gift!"
                                className="min-h-20 pr-20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => generatePreview(field.value, 'gift')}
                              >
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            {'Use {{username}}, {{giftName}}, and {{giftCount}} variables.'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Like Template */}
                    <FormField
                      control={form.control}
                      name="likeTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Heart className="mr-2 h-4 w-4" />
                            Like Template
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Thanks for the likes {{username}}!"
                                className="min-h-20 pr-20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => generatePreview(field.value, 'like')}
                              >
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            {'Use {{username}} and {{likeCount}} variables.'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Question Template */}
                    <FormField
                      control={form.control}
                      name="questionTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Question Response Template
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="{{answer}}"
                                className="min-h-20 pr-20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => generatePreview(field.value, 'question')}
                              >
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            {'Use {{answer}} to include AI-generated answers. You can add custom text before or after.'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {previewMode && (
                  <Card className="mt-6 bg-muted/50">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Template Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{previewText}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
            
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save AI Personality
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 