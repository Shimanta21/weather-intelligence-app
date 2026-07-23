import React, { useState, useEffect, useRef } from 'react';
import { GeocodingLocation } from '../types';
import { searchCities } from '../services/weatherApi';
import { Search, MapPin, Navigation, Loader2, History, X } from 'lucide-react';

interface SearchBarProps {
  onSelectCity: (location: GeocodingLocation) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  recentSearches: GeocodingLocation[];
  onClearHistory: () => void;
}

const POPULAR_CITIES: GeocodingLocation[] = [
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.71427, longitude: -74.00597 },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.50853, longitude: -0.12574 },
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.69171 },
  { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.85341, longitude: 2.3488 },
  { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.86785, longitude: 151.20732 },
  { id: 5391959, name: 'San Francisco', country: 'United States', admin1: 'California', latitude: 37.77493, longitude: -122.41942 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
  recentSearches,
  onClearHistory,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search effect
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeocodingLocation) => {
    onSelectCity(loc);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (query.trim()) {
      // Fallback search trigger
      searchCities(query).then((results) => {
        if (results.length > 0) {
          handleSelect(results[0]);
        }
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={dropdownRef}>
      {/* Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5 text-zinc-500" />
            )}
          </div>
          <input
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city (e.g. Reykjavik, IS, Tokyo, New York)..."
            className="w-full pl-11 pr-10 py-3.5 bg-zinc-900/90 border border-zinc-800 rounded-full text-zinc-100 text-sm md:text-base placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 shadow-lg transition-all"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              id="clear-search-query-btn"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          id="locate-me-btn"
          title="Detect weather at your current location"
          className="flex items-center gap-2 px-4 py-3.5 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-zinc-950 font-bold text-sm rounded-full shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all disabled:opacity-60 whitespace-nowrap cursor-pointer"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Current Location</span>
        </button>

        {/* Autocomplete Suggestions Dropdown */}
        {isOpen && (suggestions.length > 0 || (query.length >= 2 && !isSearching)) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden z-50 divide-y divide-zinc-800/60 max-h-80 overflow-y-auto backdrop-blur-xl">
            {suggestions.length > 0 ? (
              suggestions.map((loc) => (
                <button
                  key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-xl bg-zinc-800 group-hover:bg-sky-500/20 text-zinc-400 group-hover:text-sky-400 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-100 text-sm group-hover:text-sky-400">
                      {loc.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500">
                No matching cities found for &ldquo;{query}&rdquo;. Check spelling or try a larger city.
              </div>
            )}
          </div>
        )}
      </form>

      {/* Popular Quick Pick Cities */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-zinc-500 font-medium">Popular:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className="px-2.5 py-1 bg-zinc-900/80 hover:bg-zinc-800 hover:text-sky-400 text-zinc-300 font-medium rounded-lg border border-zinc-800 transition-colors cursor-pointer"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Recent Search History Chips */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-zinc-800/50">
          <div className="flex items-center gap-1 text-zinc-500 font-medium">
            <History className="w-3.5 h-3.5" />
            <span>Recent:</span>
          </div>
          {recentSearches.slice(0, 5).map((city) => (
            <button
              key={`recent-${city.id}`}
              onClick={() => onSelectCity(city)}
              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium rounded-lg border border-zinc-800/90 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{city.name}</span>
              <span className="text-[10px] text-zinc-500">{city.country}</span>
            </button>
          ))}
          <button
            onClick={onClearHistory}
            className="text-zinc-500 hover:text-zinc-300 underline text-[11px] ml-auto cursor-pointer"
          >
            Clear history
          </button>
        </div>
      )}
    </div>
  );
};
