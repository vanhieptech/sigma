import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TikTok Live Stream Dashboard',
  description: 'Manage your TikTok live streams with AI-powered tools',
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto">{children}</div>;
}
