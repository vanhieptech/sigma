import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Video, BarChart2, Settings, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="container py-10">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">TikTok Stream Manager</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Manage your TikTok live streams with AI-powered tools for better engagement and growth
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Video className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Live Stream Dashboard</CardTitle>
              <CardDescription>
                Manage your live streams with real-time analytics and AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect to TikTok, manage comments, create polls, and use AI-powered tools to boost
                engagement
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/live" className="w-full">
                <Button className="w-full">
                  Go to Live Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <BarChart2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track performance metrics and audience insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed analytics about your streams, audience demographics, and content
                performance
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/analytics" className="w-full">
                <Button variant="outline" className="w-full">
                  View Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Automation</CardTitle>
              <CardDescription>Automate your streams with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automate your streams with AI to boost engagement and growth
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/automation" className="w-full">
                <Button className="w-full" variant="outline">
                  Go to Automation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your account and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your TikTok account connections, notification settings, and AI preferences
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/settings" className="w-full">
                <Button variant="outline" className="w-full">
                  Manage Settings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
