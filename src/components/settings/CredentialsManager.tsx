'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/auth';
import {
  PlatformCredential,
  getCredentialsByUser,
  saveCredential,
  updateCredential,
  deleteCredential,
} from '@/lib/credentials-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Facebook,
  Twitter,
  Instagram,
  Trash2,
  Edit,
  Plus,
  Key,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export function CredentialsManager() {
  const { user } = useUser();
  const [credentials, setCredentials] = useState<PlatformCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<PlatformCredential | null>(null);
  const [formData, setFormData] = useState({
    platform: 'facebook' as PlatformCredential['platform'],
    name: '',
    token: '',
    tokenSecret: '',
  });

  // Load credentials on component mount
  useEffect(() => {
    if (!user) return;

    const loadCredentials = async () => {
      setLoading(true);
      setError(null);

      try {
        const userCredentials = await getCredentialsByUser(user.id);
        setCredentials(userCredentials);
      } catch (err) {
        console.error('Error loading credentials:', err);
        setError('Failed to load your saved credentials');
      } finally {
        setLoading(false);
      }
    };

    loadCredentials();
  }, [user]);

  const handleOpenForm = (credential?: PlatformCredential) => {
    if (credential) {
      // Edit mode
      setIsEditing(true);
      setCurrentCredential(credential);
      setFormData({
        platform: credential.platform,
        name: credential.name,
        token: credential.token,
        tokenSecret: credential.tokenSecret || '',
      });
    } else {
      // Add mode
      setIsEditing(false);
      setCurrentCredential(null);
      setFormData({
        platform: 'facebook',
        name: '',
        token: '',
        tokenSecret: '',
      });
    }

    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, platform: value as PlatformCredential['platform'] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      if (isEditing && currentCredential) {
        // Update existing credential
        const updated = await updateCredential(currentCredential.id, {
          name: formData.name,
          token: formData.token,
          tokenSecret: formData.tokenSecret || undefined,
        });

        setCredentials(prev => prev.map(cred => (cred.id === updated?.id ? updated : cred)));

        toast({
          title: 'Credential updated',
          description: `Your ${formData.platform} credential "${formData.name}" has been updated.`,
        });
      } else {
        // Create new credential
        const newCredential = await saveCredential({
          userId: user.id,
          platform: formData.platform,
          name: formData.name,
          token: formData.token,
          tokenSecret: formData.tokenSecret || undefined,
        });

        setCredentials(prev => [...prev, newCredential]);

        toast({
          title: 'Credential saved',
          description: `Your ${formData.platform} credential "${formData.name}" has been saved.`,
        });
      }

      handleCloseForm();
    } catch (err) {
      console.error('Error saving credential:', err);
      toast({
        variant: 'destructive',
        title: 'Error saving credential',
        description: 'There was a problem saving your credential. Please try again.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;

    try {
      await deleteCredential(id);
      setCredentials(prev => prev.filter(cred => cred.id !== id));

      toast({
        title: 'Credential deleted',
        description: 'Your credential has been deleted.',
      });
    } catch (err) {
      console.error('Error deleting credential:', err);
      toast({
        variant: 'destructive',
        title: 'Error deleting credential',
        description: 'There was a problem deleting your credential. Please try again.',
      });
    }
  };

  const getPlatformIcon = (platform: PlatformCredential['platform']) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-sky-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      default:
        return <Key className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>Manage your social media API credentials</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>Manage your social media API credentials</CardDescription>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Credential
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {credentials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>You don&apos;t have any saved credentials yet.</p>
            <p className="text-sm mt-1">Add your first credential to get started.</p>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {credentials.map(credential => (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      {getPlatformIcon(credential.platform)}
                      <div className="ml-4">
                        <div className="font-medium">{credential.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Added {new Date(credential.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>{credential.platform}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(credential)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(credential.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {['facebook', 'twitter', 'instagram'].map(platform => (
              <TabsContent key={platform} value={platform}>
                <div className="space-y-4">
                  {credentials
                    .filter(cred => cred.platform === platform)
                    .map(credential => (
                      <div
                        key={credential.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          {getPlatformIcon(credential.platform)}
                          <div className="ml-4">
                            <div className="font-medium">{credential.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Added {new Date(credential.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenForm(credential)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(credential.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                  {credentials.filter(cred => cred.platform === platform).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No {platform} credentials found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Credential' : 'Add New Credential'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update your API credential details below.'
                : 'Enter your API credential details to save for future use.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {!isEditing && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Platform
                  </Label>
                  <Select
                    value={formData.platform}
                    onValueChange={handleSelectChange}
                    disabled={isEditing}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My Facebook Token"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accessToken" className="text-right">
                  Access Token
                </Label>
                <Input
                  id="token"
                  name="token"
                  type="password"
                  placeholder="Enter access token"
                  value={formData.token}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="refreshToken" className="text-right">
                  Refresh Token
                </Label>
                <Input
                  id="tokenSecret"
                  name="tokenSecret"
                  type="password"
                  placeholder="Enter refresh token (optional)"
                  value={formData.tokenSecret}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
