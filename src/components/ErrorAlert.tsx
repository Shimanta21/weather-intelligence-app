import React from 'react';
import { AlertCircle, RotateCcw, MapPin, Search } from 'lucide-react';
import { GeocodingLocation } from '../types';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onSelectPopularCity: (city: GeocodingLocation) => void;
}

const DEFAULT_POPULAR_CITIES: GeocodingLocation[] = [
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.71427, longitude: -74.00597 },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.50853, longitude: -0.12574 },
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.69171 },
];

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onSelectPopularCity,
}) => {
  return (
    <div className="bg-zinc-900/80 rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl max-w-2xl mx-auto space-y-6 text-center backdrop-blur-xl">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-zinc-100 font-display">
          Unable to Load Weather Data
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          {message || 'An unexpected issue occurred while fetching weather forecasts.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-sm rounded-2xl shadow-md shadow-sky-500/10 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>

      {/* Popular City Suggestions */}
      <div className="pt-4 border-t border-zinc-800 space-y-3">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Or view weather in a featured city:
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {DEFAULT_POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectPopularCity(city)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
