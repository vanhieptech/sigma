'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Facebook, MessageSquare, Twitter, Linkedin, Home } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export function CrawlerNavigation({ className }: NavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard/crawlers',
      icon: <Home className="h-5 w-5" />,
      exact: true
    },
    {
      name: 'Facebook',
      href: '/dashboard/crawlers/facebook',
      icon: <Facebook className="h-5 w-5" />,
      exact: false
    },
    {
      name: 'TikTok',
      href: '/dashboard/crawlers/tiktok',
      icon: <MessageSquare className="h-5 w-5" />,
      exact: false,
      disabled: true
    },
    {
      name: 'Twitter',
      href: '/dashboard/crawlers/twitter',
      icon: <Twitter className="h-5 w-5" />,
      exact: false,
      disabled: true
    },
    {
      name: 'LinkedIn',
      href: '/dashboard/crawlers/linkedin',
      icon: <Linkedin className="h-5 w-5" />,
      exact: false,
      disabled: true
    }
  ];

  const isActiveLink = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={cn('flex overflow-auto border-b', className)}>
      <div className="container flex items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.disabled ? '#' : item.href}
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              isActiveLink(item.href, item.exact)
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-200',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault();
              }
            }}
            aria-disabled={item.disabled}
          >
            <span className="mr-2">{item.icon}</span>
            <span>{item.name}</span>
            {item.disabled && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                Soon
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
} 