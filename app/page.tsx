import TikTokLiveStream from '@/components/TikTokLiveStream';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">TikTok Live Comment Stream</h1>
          <p className="text-muted-foreground">Connect to any TikTok live stream and view comments in real-time</p>
        </header>
        
        <TikTokLiveStream />
      </div>
    </main>
  );
}