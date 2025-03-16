import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Settings Coming Soon</CardTitle>
            </div>
            <CardDescription>This feature is currently under development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20">
              <Settings className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center max-w-md">
                The settings page is coming soon. You&apos;ll be able to configure your TikTok
                account connections, notification preferences, and AI settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
