import { Metadata } from 'next';
import { EngagementAutomation } from '@/components/automation/engagement-automation';
import { WorkflowItem } from '@/components/automation/workflow-manager';
import { Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engagement Automation - TikTok Streaming',
  description: 'Configure automated responses based on viewer engagement',
};

// Example engagement workflows
const engagementWorkflows: WorkflowItem[] = [
  {
    id: 'engagement-1',
    title: 'Low Engagement Recovery',
    description: 'Automatically start a poll when engagement drops below threshold',
    trigger: 'Engagement Rate below 5% for 3 minutes',
    status: 'active',
    category: 'engagement',
    lastRun: '2023-10-24T14:30:00Z',
    createdAt: '2023-10-15T10:00:00Z',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: 'engagement-2',
    title: 'Comment Surge Response',
    description: 'Highlight top comments when activity spikes',
    trigger: 'Comment rate exceeds 30 per minute',
    status: 'active',
    category: 'engagement',
    lastRun: '2023-10-24T15:15:00Z',
    createdAt: '2023-10-16T11:20:00Z',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: 'engagement-3',
    title: 'Audience Growth Celebration',
    description: 'Trigger special effects when follower milestones are reached',
    trigger: 'Follower count reaches milestone (x100)',
    status: 'inactive',
    category: 'engagement',
    createdAt: '2023-10-18T09:45:00Z',
    icon: <Zap className="h-5 w-5" />,
  },
];

export default function EngagementAutomationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Engagement Automation</h2>
        <p className="text-muted-foreground">
          Configure automated responses based on viewer engagement metrics
        </p>
      </div>
      <EngagementAutomation workflows={engagementWorkflows} />
    </div>
  );
}
