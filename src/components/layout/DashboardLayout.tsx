import React from 'react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Link from 'next/link';
import {
  LayoutDashboard,
  Facebook,
  Twitter,
  Instagram,
  Settings,
  HelpCircle,
  Menu,
  X,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Facebook Crawler', href: '/dashboard/crawlers/facebook', icon: Facebook },
    { name: 'Twitter Crawler', href: '/dashboard/crawlers/twitter', icon: Twitter },
    { name: 'Instagram Crawler', href: '/dashboard/crawlers/instagram', icon: Instagram },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
    {
      name: 'API Access Tokens',
      href: '/dashboard/help/access-tokens',
      icon: Key,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Social Crawler</h2>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center p-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 border-r bg-card">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <h1 className="text-xl font-bold">Social Crawler</h1>
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">© 2023 Social Crawler</span>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
