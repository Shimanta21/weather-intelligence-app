import React from 'react';
import { ForecastResponse, TemperatureUnit } from '../types';
import { getWeatherCondition, formatTemperature } from '../utils/wmoCodes';
import {
  Calendar,
  Droplets,
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sunrise,
  Sunset,
} from 'lucide-react';

interface DailyForecastProps {
  forecast: ForecastResponse;
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ forecast, unit }) => {
  const daily = forecast.daily;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Global min/max across the week for relative temperature bar range rendering
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempSpan = Math.max(1, allMax - allMin);

  const renderWeatherIcon = (name: string) => {
    switch (name) {
      case 'Sun': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-6 h-6 text-amber-300" />;
      case 'CloudDrizzle': return <CloudDrizzle className="w-6 h-6 text-sky-400" />;
      case 'CloudRain': return <CloudRain className="w-6 h-6 text-sky-400" />;
      case 'CloudSnow': return <CloudSnow className="w-6 h-6 text-sky-200" />;
      case 'CloudLightning': return <CloudLightning className="w-6 h-6 text-amber-400" />;
      default: return <Cloud className="w-6 h-6 text-zinc-400" />;
    }
  };

  const days = daily.time.slice(0, 7).map((timeStr, idx) => {
    const maxTempC = daily.temperature_2m_max[idx];
    const minTempC = daily.temperature_2m_min[idx];
    const precipMax = daily.precipitation_probability_max[idx] ?? 0;
    const code = daily.weather_code[idx];
    const condition = getWeatherCondition(code, 1);

    const dateObj = new Date(timeStr + 'T00:00:00');
    const isToday = idx === 0;

    const dayName = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const sunrise = daily.sunrise?.[idx]
      ? new Date(daily.sunrise[idx]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : null;

    const sunset = daily.sunset?.[idx]
      ? new Date(daily.sunset[idx]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : null;

    // Relative bar positions
    const leftPercent = ((minTempC - allMin) / tempSpan) * 100;
    const widthPercent = Math.max(8, ((maxTempC - minTempC) / tempSpan) * 100);

    return {
      dayName,
      dateFormatted,
      isToday,
      maxTempC,
      minTempC,
      precipMax,
      condition,
      sunrise,
      sunset,
      leftPercent,
      widthPercent,
    };
  });

  return (
    <div className="bg-zinc-900/60 rounded-3xl p-6 shadow-xl border border-zinc-800/80 space-y-4 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 font-display">7-Day Forecast</h3>
            <p className="text-xs text-zinc-400">Max/min temperatures and rain probability</p>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-medium hidden sm:block">
          Open-Meteo Multi-Day Model
        </div>
      </div>

      {/* Days List */}
      <div className="divide-y divide-zinc-800/60 space-y-1">
        {days.map((d, index) => (
          <div
            key={index}
            className={`py-3 px-2 sm:px-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors ${
              d.isToday ? 'bg-sky-500/10 border border-sky-500/20' : 'hover:bg-zinc-800/40'
            }`}
          >
            {/* Day name & date */}
            <div className="w-full sm:w-36 flex items-center justify-between sm:justify-start gap-3">
              <div>
                <span className={`text-sm font-bold ${d.isToday ? 'text-sky-400' : 'text-zinc-100'}`}>
                  {d.dayName}
                </span>
                <span className="text-xs text-zinc-500 ml-2 font-normal">{d.dateFormatted}</span>
              </div>
              <div className="sm:hidden">
                {renderWeatherIcon(d.condition.iconName)}
              </div>
            </div>

            {/* Weather condition & Icon */}
            <div className="hidden sm:flex items-center gap-3 w-44">
              <div className="p-1 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
                {renderWeatherIcon(d.condition.iconName)}
              </div>
              <span className="text-xs font-semibold text-zinc-300 truncate">{d.condition.label}</span>
            </div>

            {/* Rain Probability Badge */}
            <div className="w-full sm:w-28 flex items-center justify-start sm:justify-center">
              {d.precipMax > 5 ? (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    d.precipMax >= 50
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : d.precipMax >= 25
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <Droplets className="w-3 h-3 text-sky-400" />
                  {d.precipMax}% rain
                </span>
              ) : (
                <span className="text-xs text-zinc-500 font-medium">Dry (0%)</span>
              )}
            </div>

            {/* Temperature range bar */}
            <div className="w-full sm:w-56 flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-400 w-10 text-right">
                {formatTemperature(d.minTempC, unit)}
              </span>

              <div className="flex-1 bg-zinc-800 h-2.5 rounded-full relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    d.isToday ? 'bg-gradient-to-r from-sky-400 to-amber-400' : 'bg-gradient-to-r from-sky-500/80 to-amber-500/80'
                  }`}
                  style={{
                    marginLeft: `${d.leftPercent}%`,
                    width: `${d.widthPercent}%`,
                  }}
                />
              </div>

              <span className="text-xs font-bold text-zinc-100 w-10 text-left">
                {formatTemperature(d.maxTempC, unit)}
              </span>
            </div>

            {/* Sunrise / Sunset if space permits */}
            {d.sunrise && d.sunset && (
              <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-500 w-36 justify-end">
                <span className="flex items-center gap-0.5"><Sunrise className="w-3 h-3 text-amber-400" /> {d.sunrise}</span>
                <span className="flex items-center gap-0.5"><Sunset className="w-3 h-3 text-indigo-400" /> {d.sunset}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
