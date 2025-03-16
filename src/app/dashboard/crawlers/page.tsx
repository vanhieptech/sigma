import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Facebook, MessageSquare, Twitter, Linkedin } from 'lucide-react';

export default function CrawlersDashboard() {
  const platforms = [
    {
      name: 'Facebook',
      description: 'Extract comments, likes, and user engagement from Facebook posts',
      icon: <Facebook className="h-8 w-8 text-blue-600" />,
      link: '/dashboard/crawlers/facebook',
      badge: 'Ready',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      name: 'TikTok',
      description: 'Crawl comments and user interactions from TikTok videos',
      icon: <MessageSquare className="h-8 w-8 text-black" />,
      link: '/dashboard/crawlers/tiktok',
      badge: 'Coming Soon',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      name: 'Twitter',
      description: 'Analyze tweets, replies, and engagement metrics',
      icon: <Twitter className="h-8 w-8 text-blue-400" />,
      link: '/dashboard/crawlers/twitter',
      badge: 'Coming Soon',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      name: 'LinkedIn',
      description: 'Extract comments and engagement from LinkedIn posts',
      icon: <Linkedin className="h-8 w-8 text-blue-800" />,
      link: '/dashboard/crawlers/linkedin',
      badge: 'Coming Soon',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Social Media Crawlers</h1>
        <p className="text-gray-500 mt-2">
          Extract and analyze comments and engagement metrics from various social media platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map(platform => (
          <Card key={platform.name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                {platform.icon}
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${platform.badgeColor}`}
                >
                  {platform.badge}
                </div>
              </div>
              <CardTitle className="text-xl mt-4">{platform.name}</CardTitle>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li>Extract comments and replies</li>
                <li>Analyze user engagement</li>
                <li>Track hashtags and mentions</li>
                <li>Export data to CSV</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={platform.link} className="w-full">
                <Button
                  className="w-full"
                  variant={platform.badge === 'Ready' ? 'default' : 'outline'}
                  disabled={platform.badge !== 'Ready'}
                >
                  {platform.badge === 'Ready' ? 'Get Started' : 'Coming Soon'}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
