import { Metadata } from 'next';
import { AutoResponses } from '@/components/automation/auto-responses';

export const metadata: Metadata = {
  title: 'Auto Responses - TikTok Streaming',
  description: 'Automate your responses to comments and messages',
};

export default function AutoResponsesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Auto Responses</h2>
        <p className="text-muted-foreground">Automate your responses to comments and messages</p>
      </div>
      <AutoResponses workflows={[]} />
    </div>
  );
}
