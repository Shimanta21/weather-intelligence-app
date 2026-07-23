import React from 'react';
import { GeocodingLocation, ForecastResponse, TemperatureUnit } from '../types';
import { Wind, Droplets, Sun, Sunrise, Sunset, Compass, MapPin, Gauge } from 'lucide-react';

interface WeatherDetailsGridProps {
  location: GeocodingLocation;
  forecast: ForecastResponse;
  unit: TemperatureUnit;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  location,
  forecast,
}) => {
  const current = forecast.current_weather;
  const hourly = forecast.hourly;
  const daily = forecast.daily;

  const humidity = hourly?.relative_humidity_2m?.[0] ?? 65;
  const uvMax = daily?.uv_index_max?.[0] ?? 4;
  const windDir = current.winddirection ?? 0;

  const sunrise = daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '6:15 AM';

  const sunset = daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '7:45 PM';

  const getWindDirectionText = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  const getUVStatus = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    return { text: 'Extreme', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
  };

  const uvStatus = getUVStatus(uvMax);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Wind Card */}
      <div className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800/80 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-zinc-400 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider">Wind & Gusts</span>
          <Wind className="w-5 h-5 text-sky-400" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-zinc-100 font-display">
            {Math.round(current.windspeed)} <span className="text-sm font-normal text-zinc-500">km/h</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
            <Compass className="w-4 h-4 text-sky-400" style={{ transform: `rotate(${windDir}deg)` }} />
            <span>Direction: {getWindDirectionText(windDir)} ({windDir}°)</span>
          </div>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800/80 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-zinc-400 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
          <Droplets className="w-5 h-5 text-sky-400" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-zinc-100 font-display">
            {Math.round(humidity)}<span className="text-sm font-normal text-zinc-500">%</span>
          </div>
          <p className="text-xs text-zinc-400">
            {humidity > 70 ? 'High moisture in air' : humidity < 30 ? 'Dry air conditions' : 'Comfortable humidity level'}
          </p>
        </div>
      </div>

      {/* UV Index Card */}
      <div className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800/80 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-zinc-400 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider">UV Index Max</span>
          <Sun className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-zinc-100 font-display">
              {Math.round(uvMax)}
            </span>
            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${uvStatus.color}`}>
              {uvStatus.text}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {uvMax >= 5 ? 'Sun protection required near midday' : 'Minimal sun protection needed'}
          </p>
        </div>
      </div>

      {/* Sunrise & Sunset Card */}
      <div className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800/80 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-zinc-400 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider">Sun Schedule</span>
          <Gauge className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
            <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-500 font-medium">Sunrise</div>
              <div className="font-bold text-zinc-200">{sunrise}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
            <Sunset className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-500 font-medium">Sunset</div>
              <div className="font-bold text-zinc-200">{sunset}</div>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
          <MapPin className="w-3 h-3 text-zinc-500" />
          <span>{location.latitude.toFixed(2)}° N, {location.longitude.toFixed(2)}° E</span>
        </div>
      </div>
    </div>
  );
};
