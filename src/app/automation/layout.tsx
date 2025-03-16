import { ReactNode } from 'react';
import {
  CheckSquare,
  Code,
  MessageSquare,
  Play,
  RotateCw,
  ScrollText,
  Settings,
  SlidersHorizontal,
  Timer,
  Users,
  Zap,
} from 'lucide-react';
import { SidebarNav } from '@/components/ui/sidebar-nav';

interface AutomationLayoutProps {
  children: ReactNode;
}

const sidebarNavItems = [
  {
    title: 'All Workflows',
    href: '/automation',
    icon: <SlidersHorizontal className="h-4 w-4" />,
  },
  {
    title: 'Pre-Stream Checklist',
    href: '/automation/pre-stream',
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    title: 'Content Transitions',
    href: '/automation/transitions',
    icon: <Play className="h-4 w-4" />,
  },
  {
    title: 'Scene Switching',
    href: '/automation/scenes',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: 'Timed Reminders',
    href: '/automation/reminders',
    icon: <Timer className="h-4 w-4" />,
  },
  {
    title: 'Auto-Responses',
    href: '/automation/responses',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: 'Engagement Rules',
    href: '/automation/engagement',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: 'Post-Stream Highlights',
    href: '/automation/highlights',
    icon: <ScrollText className="h-4 w-4" />,
  },
  {
    title: 'Custom Workflows',
    href: '/automation/custom',
    icon: <Code className="h-4 w-4" />,
  },
];

export default function AutomationLayout({ children }: AutomationLayoutProps) {
  return (
    <div className="container mx-auto space-y-6 py-6 lg:space-y-0 lg:px-8">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
