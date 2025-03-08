import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';

export default function LinkedInCrawlerPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">LinkedIn Comment Crawler</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Linkedin className="h-6 w-6 text-blue-800" />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            LinkedIn comment crawler is under development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The LinkedIn comment crawler will allow you to extract and analyze comments from LinkedIn posts.
            This feature is currently in development and will be available soon.
          </p>
          
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="text-yellow-800">
                <p className="text-sm font-medium">Feature Preview</p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Extract comments from LinkedIn posts</li>
                  <li>Analyze professional engagement</li>
                  <li>Track industry keywords and mentions</li>
                  <li>Generate professional insights</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            disabled
          >
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 