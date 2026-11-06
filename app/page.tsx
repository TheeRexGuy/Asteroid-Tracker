import AsteroidTracker from '@/components/asteroid-tracker';

export const metadata = {
  title: 'Asteroid Tracker - NASA NeoWs',
  description: 'Track near-Earth asteroids with real-time data from NASA\'s NeoWs API',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <AsteroidTracker />
    </main>
  );
}
