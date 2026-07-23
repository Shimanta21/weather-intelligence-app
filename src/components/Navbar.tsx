import React from 'react';
import { TemperatureUnit } from '../types';
import { CloudSun, RotateCcw, Bookmark, Sparkles } from 'lucide-react';

interface NavbarProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  savedCitiesCount: number;
  onOpenFavorites: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  savedCitiesCount,
  onOpenFavorites,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-500/10">
            <CloudSun className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-zinc-100 font-display">
                WEATHER <span className="text-sky-400">INTELLIGENCE</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Live
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Open-Meteo forecasts & smart activity planning
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            id="refresh-weather-btn"
            title="Refresh current forecast"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 active:bg-zinc-800 transition-colors disabled:opacity-50 border border-transparent hover:border-zinc-700/50 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Saved Cities Button */}
          <button
            onClick={onOpenFavorites}
            id="open-favorites-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/90 hover:border-zinc-700 transition-all relative cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="hidden sm:inline">Saved Cities</span>
            {savedCitiesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-500 text-zinc-950">
                {savedCitiesCount}
              </span>
            )}
          </button>

          {/* C / F Unit Switcher */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => unit !== 'C' && onToggleUnit()}
              id="unit-toggle-c"
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                unit === 'C'
                  ? 'bg-sky-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'F' && onToggleUnit()}
              id="unit-toggle-f"
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                unit === 'F'
                  ? 'bg-sky-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
