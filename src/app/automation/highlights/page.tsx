import { Metadata } from 'next';
import { PostStreamHighlights } from '@/components/automation/post-stream-highlights';

export const metadata: Metadata = {
  title: 'Post-Stream Highlights - TikTok Streaming',
  description: 'Automatically generate and manage highlight clips from your streams',
};

export default function HighlightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Post-Stream Highlights</h2>
        <p className="text-muted-foreground">
          Automatically generate and manage highlight clips from your streams
        </p>
      </div>
      <PostStreamHighlights workflows={[]} />
    </div>
  );
}
