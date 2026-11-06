'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  isLoading: boolean;
}

export default function DateRangeSelector({
  startDate,
  endDate,
  onDateRangeChange,
  isLoading,
}: DateRangeSelectorProps) {
  const [localStartDate, setLocalStartDate] = useState(format(startDate, 'yyyy-MM-dd'));
  const [localEndDate, setLocalEndDate] = useState(format(endDate, 'yyyy-MM-dd'));

  const handleSearch = () => {
    const newStartDate = new Date(localStartDate);
    const newEndDate = new Date(localEndDate);

    if (newStartDate > newEndDate) {
      alert('Start date must be before end date');
      return;
    }

    if (
      format(newStartDate, 'yyyy-MM-dd') ===
        format(startDate, 'yyyy-MM-dd') &&
      format(newEndDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')
    ) {
      return;
    }

    onDateRangeChange(newStartDate, newEndDate);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Select Date Range</h2>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="start-date" className="block text-sm font-medium text-foreground mb-2">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              id="start-date"
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-md border border-border bg-secondary/50 py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex-1">
          <label htmlFor="end-date" className="block text-sm font-medium text-foreground mb-2">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              id="end-date"
              type="date"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-md border border-border bg-secondary/50 py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground disabled:opacity-50"
            />
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Note: NASA API can fetch data for up to 7 days at a time.
      </p>
    </div>
  );
}
