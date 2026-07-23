import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Loading Banner */}
      <div className="flex items-center justify-center gap-3 p-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-2xl text-sm font-semibold backdrop-blur-md">
        <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
        <span>Fetching live Open-Meteo weather intelligence & forecast data...</span>
      </div>

      {/* Hero Weather Card Skeleton */}
      <div className="h-80 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 w-full" />

      {/* Planning Card Skeleton */}
      <div className="h-64 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 w-full" />

      {/* Hourly Skeleton */}
      <div className="h-44 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 w-full" />

      {/* Daily Skeleton */}
      <div className="h-96 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 w-full" />
    </div>
  );
};
