import React, { useState, useEffect, useCallback } from 'react';
import { GeocodingLocation, ForecastResponse, TemperatureUnit } from './types';
import { getForecast, reverseGeocodeLocation } from './services/weatherApi';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningCard } from './components/PlanningCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { FavoriteCitiesModal } from './components/FavoriteCitiesModal';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { motion, AnimatePresence } from 'motion/react';
import { CloudSun, RefreshCw } from 'lucide-react';

const DEFAULT_CITY: GeocodingLocation = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  admin1: 'England',
  latitude: 51.50853,
  longitude: -0.12574,
};

export default function App() {
  const [location, setLocation] = useState<GeocodingLocation>(() => {
    try {
      const saved = localStorage.getItem('wi_last_location');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const savedUnit = localStorage.getItem('wi_unit');
      return (savedUnit === 'F' ? 'F' : 'C') as TemperatureUnit;
    } catch {
      return 'C';
    }
  });

  const [recentSearches, setRecentSearches] = useState<GeocodingLocation[]>(() => {
    try {
      const saved = localStorage.getItem('wi_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<GeocodingLocation[]>(() => {
    try {
      const saved = localStorage.getItem('wi_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Save state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wi_unit', unit);
    } catch {
      // ignore
    }
  }, [unit]);

  useEffect(() => {
    try {
      localStorage.setItem('wi_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('wi_recent_searches', JSON.stringify(recentSearches));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  // Fetch forecast handler
  const fetchWeatherForLocation = useCallback(async (loc: GeocodingLocation) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getForecast(loc.latitude, loc.longitude);
      setForecast(data);
      setLocation(loc);

      try {
        localStorage.setItem('wi_last_location', JSON.stringify(loc));
      } catch {
        // ignore
      }

      // Add to recent searches (deduped)
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.id !== loc.id && item.name.toLowerCase() !== loc.name.toLowerCase());
        return [loc, ...filtered].slice(0, 10);
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load forecast data. Please check connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchWeatherForLocation(location);
  }, [fetchWeatherForLocation, location]);

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocodeLocation(latitude, longitude);
          fetchWeatherForLocation(loc);
        } catch {
          const fallbackLoc: GeocodingLocation = {
            id: Math.round(latitude * 1000 + longitude),
            name: 'Current Location',
            latitude,
            longitude,
          };
          fetchWeatherForLocation(fallbackLoc);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location access was denied. Please search for your city in the search bar.');
        } else {
          setError('Unable to retrieve your location coordinates. Please search for a city.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle favorite
  const isFavorite = favorites.some((f) => f.id === location.id || f.name.toLowerCase() === location.name.toLowerCase());

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites((prev) => prev.filter((f) => f.id !== location.id && f.name.toLowerCase() !== location.name.toLowerCase()));
    } else {
      setFavorites((prev) => [location, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased flex flex-col selection:bg-sky-500 selection:text-zinc-950 weather-gradient">
      {/* Navbar Header */}
      <Navbar
        unit={unit}
        onToggleUnit={() => setUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        onRefresh={() => fetchWeatherForLocation(location)}
        savedCitiesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        isLoading={isLoading}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Bar Section */}
        <SearchBar
          onSelectCity={fetchWeatherForLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          recentSearches={recentSearches}
          onClearHistory={() => setRecentSearches([])}
        />

        {/* Content View Modes */}
        {isLoading && !forecast ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorAlert
            message={error}
            onRetry={() => fetchWeatherForLocation(location)}
            onSelectPopularCity={fetchWeatherForLocation}
          />
        ) : forecast ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${location.id}-${location.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Current Weather Hero */}
              <CurrentWeatherCard
                location={location}
                forecast={forecast}
                unit={unit}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />

              {/* Planning & Outdoor Activity Recommendations */}
              <PlanningCard forecast={forecast} />

              {/* Weather Metrics Grid */}
              <WeatherDetailsGrid
                location={location}
                forecast={forecast}
                unit={unit}
              />

              {/* 24-Hour Hourly Timeline */}
              <HourlyForecast forecast={forecast} unit={unit} />

              {/* 7-Day Forecast Outlook */}
              <DailyForecast forecast={forecast} unit={unit} />
            </motion.div>
          </AnimatePresence>
        ) : null}
      </main>

      {/* Saved Cities Modal */}
      <FavoriteCitiesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectCity={fetchWeatherForLocation}
        onRemoveFavorite={(id) => setFavorites((prev) => prev.filter((f) => f.id !== id))}
        onClearAll={() => setFavorites([])}
      />

      {/* Footer */}
      <footer className="bg-zinc-950/80 border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500 mt-auto backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-zinc-300">Weather Intelligence</span>
            <span>— Powered by Open-Meteo Weather API</span>
          </div>
          <div className="text-zinc-500">
            Real-time geocoding, current observations, and 7-day planning
          </div>
        </div>
      </footer>
    </div>
  );
}
