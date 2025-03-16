'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FacebookUrlForm } from '@/components/crawlers/facebook/FacebookUrlForm';
import { FacebookPageCommentsForm } from '@/components/crawlers/facebook/FacebookPageCommentsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';

export default function FacebookCrawlerPage() {
  const [jobId, setJobId] = useState<string | null>(null);

  const handleStartCrawl = (id: string) => {
    setJobId(id);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Facebook Crawler</h1>
        <p className="text-muted-foreground">
          Fetch posts and comments from Facebook using different methods
        </p>
        <div className="flex items-center mt-2 text-sm text-primary">
          <InfoIcon className="h-4 w-4 mr-1" />
          <Link href="/dashboard/help/facebook-setup" className="hover:underline">
            Need help setting up Facebook authentication?
          </Link>
        </div>
      </div>

      <Tabs defaultValue="crawler" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="crawler">Full Crawler</TabsTrigger>
          <TabsTrigger value="page-comments">Page Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="crawler">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Post Crawler</CardTitle>
              <CardDescription>
                Crawl a Facebook post and its comments using deep crawling techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FacebookUrlForm onStartCrawl={handleStartCrawl} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-comments">
          <FacebookPageCommentsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
