import { Metadata } from 'next';
import { PreStreamChecklist } from '@/components/automation/pre-stream-checklist';

export const metadata: Metadata = {
  title: 'Pre-Stream Checklist - TikTok Streaming',
  description: 'Complete your pre-stream checklist before going live',
};

export default function PreStreamChecklistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pre-Stream Checklist</h2>
        <p className="text-muted-foreground">
          Complete all necessary checks and preparations before going live
        </p>
      </div>
      <PreStreamChecklist
      // onStreamStart={() => {
      //   // Handle stream start logic here
      //   // console.log('Starting stream from pre-stream checklist page');
      // }}
      />
    </div>
  );
}
