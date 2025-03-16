'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from './scroll-area';

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon?: ReactNode;
  }[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <nav className={cn('flex flex-col space-y-1', className)}>
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-transparent hover:underline',
              'justify-start gap-2 px-2'
            )}
          >
            {item.icon}
            {item.title}
            {pathname === item.href && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
}
