'use client';

interface Asteroid {
  id: string;
  name: string;
  absoluteMagnitude: number;
  isPotentiallyHazardous: boolean;
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

interface AsteroidDetailRowProps {
  asteroid: Asteroid;
}

export default function AsteroidDetailRow({ asteroid }: AsteroidDetailRowProps) {
  const closeApproach = asteroid.closeApproachData[0];
  const diameter = asteroid.estimatedDiameter.kilometers;

  const formatNumber = (num: string | number): string => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return 'N/A';
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <tr className="border-b border-border/50 bg-secondary/20">
      <td colSpan={7} className="px-4 py-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <DetailItem
            label="Min Diameter"
            value={`${formatNumber(diameter.min)} km`}
          />
          <DetailItem
            label="Max Diameter"
            value={`${formatNumber(diameter.max)} km`}
          />
          <DetailItem
            label="Velocity (km/h)"
            value={formatNumber(closeApproach.relativeVelocity.kilometers_per_hour)}
          />
          <DetailItem
            label="Distance (miles)"
            value={formatNumber(closeApproach.missDistance.miles)}
          />
          <DetailItem
            label="Absolute Magnitude"
            value={formatNumber(asteroid.absoluteMagnitude)}
          />
          <DetailItem
            label="Potentially Hazardous"
            value={asteroid.isPotentiallyHazardous ? 'Yes' : 'No'}
          />
        </div>
      </td>
    </tr>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
