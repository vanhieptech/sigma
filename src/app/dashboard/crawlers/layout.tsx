import { CrawlerNavigation } from '@/components/CrawlerNavigation';

export default function CrawlersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CrawlerNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 