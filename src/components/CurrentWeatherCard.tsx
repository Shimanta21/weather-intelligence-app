import React from 'react';
import { GeocodingLocation, ForecastResponse, TemperatureUnit } from '../types';
import { getWeatherCondition, formatTemperature, convertCelsiusToUnit } from '../utils/wmoCodes';
import {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Bookmark,
  MapPin,
  Calendar,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  location: GeocodingLocation;
  forecast: ForecastResponse;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  forecast,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  const current = forecast.current_weather;
  const condition = getWeatherCondition(current.weathercode, current.is_day);

  // Daily high / low
  const maxTempC = forecast.daily.temperature_2m_max[0] ?? current.temperature;
  const minTempC = forecast.daily.temperature_2m_min[0] ?? current.temperature;

  // Hourly index near current time
  const hourly = forecast.hourly;
  const apparentTempC = hourly?.apparent_temperature?.[0] ?? current.temperature;
  const humidity = hourly?.relative_humidity_2m?.[0] ?? 60;
  const uvIndex = hourly?.uv_index?.[0] ?? 3;

  // Render weather icon based on name
  const renderWeatherIcon = (name: string, className = 'w-16 h-16') => {
    switch (name) {
      case 'Sun': return <Sun className={`${className} text-amber-400`} />;
      case 'Moon': return <Moon className={`${className} text-indigo-200`} />;
      case 'SunMedium': return <SunMedium className={`${className} text-amber-400`} />;
      case 'MoonStar': return <MoonStar className={`${className} text-indigo-300`} />;
      case 'CloudSun': return <CloudSun className={`${className} text-amber-300`} />;
      case 'CloudMoon': return <CloudMoon className={`${className} text-indigo-300`} />;
      case 'CloudFog': return <CloudFog className={`${className} text-slate-300`} />;
      case 'CloudDrizzle': return <CloudDrizzle className={`${className} text-sky-300`} />;
      case 'CloudRain': return <CloudRain className={`${className} text-blue-400`} />;
      case 'CloudRainWind': return <CloudRainWind className={`${className} text-indigo-300`} />;
      case 'CloudSnow': return <CloudSnow className={`${className} text-sky-200`} />;
      case 'CloudHail': return <CloudHail className={`${className} text-cyan-200`} />;
      case 'CloudLightning': return <CloudLightning className={`${className} text-amber-300`} />;
      case 'Snowflake': return <Snowflake className={`${className} text-sky-200`} />;
      default: return <Cloud className={`${className} text-slate-300`} />;
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-900/70 border border-zinc-800/90 text-zinc-100 shadow-2xl p-6 sm:p-8 md:p-10 transition-all duration-500 backdrop-blur-xl">
      {/* Subtle ambient lighting inside the dark card */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Location Header & Bookmark */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-zinc-100">
            {location.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formattedDate}</span>
            <span className="opacity-40">•</span>
            <span>Elevation: {location.elevation ? `${Math.round(location.elevation)}m` : 'Sea level'}</span>
          </div>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={onToggleFavorite}
          id="toggle-favorite-btn"
          title={isFavorite ? 'Remove from saved cities' : 'Save this city'}
          className={`p-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer border ${
            isFavorite
              ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-lg shadow-amber-400/20 scale-105'
              : 'bg-zinc-800/80 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/80 border-zinc-700/60'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-zinc-950' : ''}`} />
        </button>
      </div>

      {/* Hero Temperature & Condition Display */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6 py-6 border-y border-zinc-800/80">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-700/50 shadow-inner shrink-0">
            {renderWeatherIcon(condition.iconName, 'w-16 h-16 sm:w-20 sm:h-20')}
          </div>
          <div>
            <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-zinc-100 leading-none">
              {formatTemperature(current.temperature, unit)}
            </div>
            <div className="text-lg font-bold text-sky-400 mt-2">
              {condition.label}
            </div>
            <div className="text-xs text-zinc-400 max-w-xs mt-1">
              {condition.description}
            </div>
          </div>
        </div>

        {/* High / Low & Quick Stats */}
        <div className="flex flex-col justify-center space-y-3 bg-zinc-950/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400 font-medium">Today&apos;s High / Low</span>
            <span className="font-bold text-zinc-100">
              {formatTemperature(maxTempC, unit)} / {formatTemperature(minTempC, unit)}
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden relative">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, ((current.temperature - minTempC) / Math.max(1, maxTempC - minTempC)) * 100))}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-zinc-800/80 text-xs">
            <div>
              <div className="text-zinc-500 font-medium">Feels Like</div>
              <div className="font-semibold text-zinc-200 mt-0.5">
                {formatTemperature(apparentTempC, unit)}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 font-medium">Humidity</div>
              <div className="font-semibold text-zinc-200 mt-0.5">{Math.round(humidity)}%</div>
            </div>
            <div>
              <div className="text-zinc-500 font-medium">UV Index</div>
              <div className="font-semibold text-zinc-200 mt-0.5">{Math.round(uvIndex)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="flex items-center gap-3 bg-zinc-950/40 backdrop-blur-sm p-3.5 rounded-2xl border border-zinc-800/60">
          <Wind className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">Wind Speed</div>
            <div className="text-sm font-bold text-zinc-100">
              {Math.round(current.windspeed)} km/h
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/40 backdrop-blur-sm p-3.5 rounded-2xl border border-zinc-800/60">
          <Droplets className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">Humidity</div>
            <div className="text-sm font-bold text-zinc-100">{Math.round(humidity)}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/40 backdrop-blur-sm p-3.5 rounded-2xl border border-zinc-800/60">
          <Thermometer className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">Apparent Temp</div>
            <div className="text-sm font-bold text-zinc-100">
              {formatTemperature(apparentTempC, unit)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/40 backdrop-blur-sm p-3.5 rounded-2xl border border-zinc-800/60">
          <Eye className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">Condition</div>
            <div className="text-sm font-bold text-zinc-100">{condition.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
