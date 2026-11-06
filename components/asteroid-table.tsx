'use client';

import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import AsteroidDetailRow from './asteroid-detail-row';

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

interface AsteroidTableProps {
  asteroids: Asteroid[];
}

export default function AsteroidTable({ asteroids }: AsteroidTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatNumber = (num: string | number): string => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return 'N/A';
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-8"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Asteroid Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Approach Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Distance (km)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Velocity (km/s)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Diameter (km)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Magnitude
              </th>
            </tr>
          </thead>
          <tbody>
            {asteroids.map((asteroid) => {
              const closeApproach = asteroid.closeApproachData[0];
              const diameter = asteroid.estimatedDiameter.kilometers;
              const diameterAvg = (diameter.min + diameter.max) / 2;

              return (
                <tbody key={asteroid.id}>
                  <tr
                    className="border-b border-border/50 transition-colors hover:bg-secondary/30 cursor-pointer"
                    onClick={() => toggleExpanded(asteroid.id)}
                  >
                    <td className="px-4 py-3">
                      <ChevronDown
                        className={`h-4 w-4 text-primary transition-transform ${
                          expandedId === asteroid.id ? 'rotate-180' : ''
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {asteroid.name.replace(/[()]/g, '').trim()}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {format(new Date(closeApproach.closeApproachDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {formatNumber(closeApproach.missDistance.kilometers)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {formatNumber(closeApproach.relativeVelocity.kilometers_per_second)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {formatNumber(diameterAvg)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {formatNumber(asteroid.absoluteMagnitude)}
                    </td>
                  </tr>
                  {expandedId === asteroid.id && (
                    <AsteroidDetailRow asteroid={asteroid} />
                  )}
                </tbody>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
