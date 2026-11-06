'use client';

import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import AsteroidTable from './asteroid-table';
import DateRangeSelector from './date-range-selector';

interface Asteroid {
  id: string;
  name: string;
  absoluteMagnitude: number;
  estimatedDiameter: {
    kilometers: { min: number; max: number };
    meters: { min: number; max: number };
  };
  closeApproachData: Array<{
    closeApproachDate: string;
    relativeVelocity: { kilometers_per_hour: string; kilometers_per_second: string };
    missDistance: { kilometers: string; miles: string };
  }>;
}

export default function AsteroidTracker() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));

  const fetchAsteroids = async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
      if (!apiKey) {
        throw new Error('NASA API key is not configured');
      }

      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');

      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${endStr}&api_key=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch asteroid data');
      }

      const data = await response.json();
      const allAsteroids: Asteroid[] = [];

      Object.values(data.near_earth_objects || {}).forEach((dayAsteroids: any) => {
        allAsteroids.push(...dayAsteroids);
      });

      // Sort by distance
      allAsteroids.sort((a, b) => {
        const distA = parseFloat(
          a.closeApproachData[0]?.missDistance?.kilometers || '999999999',
        );
        const distB = parseFloat(
          b.closeApproachData[0]?.missDistance?.kilometers || '999999999',
        );
        return distA - distB;
      });

      setAsteroids(allAsteroids);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids(startDate, endDate);
  }, []);

  const handleDateRangeChange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    fetchAsteroids(newStartDate, newEndDate);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
            Asteroid Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time near-Earth asteroid data powered by NASA's NeoWs API
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            isLoading={loading}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Error fetching data</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-foreground">Loading asteroid data...</span>
          </div>
        )}

        {/* Data Table */}
        {!loading && asteroids.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {asteroids.length} Asteroids Found
              </h2>
            </div>
            <AsteroidTable asteroids={asteroids} />
          </div>
        )}

        {/* Empty State */}
        {!loading && asteroids.length === 0 && !error && (
          <div className="flex items-center justify-center rounded-lg border border-border bg-card p-12">
            <div className="text-center">
              <p className="text-foreground">No asteroids found for the selected date range.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
