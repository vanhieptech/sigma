import { Metadata } from 'next';
import { WorkflowManager } from '@/components/automation/workflow-manager';

export const metadata: Metadata = {
  title: 'Automation - TikTok Streaming',
  description: 'Manage automated workflows to streamline your TikTok streaming experience',
};

export default function AutomationPage() {
  return (
    <div className="container mx-auto py-6">
      <WorkflowManager />
    </div>
  );
}
