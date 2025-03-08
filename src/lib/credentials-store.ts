import { User } from './auth';

// Define the credential interface
export interface PlatformCredential {
  id: string;
  userId: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'tiktok';
  name: string;
  token: string;
  tokenSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for demo purposes
// In a real app, this would use a database
const credentialsStore: PlatformCredential[] = [
  {
    id: 'cred-1',
    userId: 'user-1',
    platform: 'facebook',
    name: 'Demo Facebook Token',
    token: 'EAABwzLixnjYBO...', // Truncated for demo
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get credentials for a specific user
export async function getCredentialsByUser(userId: string): Promise<PlatformCredential[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return credentialsStore.filter(cred => cred.userId === userId);
}

// Get a specific credential by ID
export async function getCredentialById(id: string): Promise<PlatformCredential | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return credentialsStore.find(cred => cred.id === id) || null;
}

// Save a new credential
export async function saveCredential(credential: Omit<PlatformCredential, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlatformCredential> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newCredential: PlatformCredential = {
    ...credential,
    id: `cred-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  credentialsStore.push(newCredential);
  return newCredential;
}

// Update an existing credential
export async function updateCredential(id: string, updates: Partial<Omit<PlatformCredential, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<PlatformCredential | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = credentialsStore.findIndex(cred => cred.id === id);
  if (index === -1) return null;
  
  credentialsStore[index] = {
    ...credentialsStore[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return credentialsStore[index];
}

// Delete a credential
export async function deleteCredential(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = credentialsStore.findIndex(cred => cred.id === id);
  if (index === -1) return false;
  
  credentialsStore.splice(index, 1);
  return true;
} 