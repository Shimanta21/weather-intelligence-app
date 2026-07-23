import React from 'react';
import { ForecastResponse, TemperatureUnit } from '../types';
import { getWeatherCondition, formatTemperature } from '../utils/wmoCodes';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Clock,
  Droplets,
} from 'lucide-react';

interface HourlyForecastProps {
  forecast: ForecastResponse;
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, unit }) => {
  const hourly = forecast.hourly;
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Filter next 24 hours starting from current hour
  const nowISO = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.slice(0, 13) >= nowISO);
  if (startIndex === -1) startIndex = 0;

  const next24 = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    const tempC = hourly.temperature_2m[actualIdx];
    const precipProb = hourly.precipitation_probability?.[actualIdx] ?? 0;
    const code = hourly.weather_code?.[actualIdx] ?? 0;

    const dateObj = new Date(timeStr);
    const hourNum = dateObj.getHours();
    const isDay = hourNum >= 6 && hourNum < 20 ? 1 : 0;
    const timeFormatted = idx === 0 ? 'Now' : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

    return {
      timeStr,
      timeFormatted,
      tempC,
      precipProb,
      code,
      isDay,
    };
  });

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Sun': return <Sun className="w-6 h-6 text-amber-500" />;
      case 'Moon': return <Moon className="w-6 h-6 text-indigo-400" />;
      case 'CloudSun': return <CloudSun className="w-6 h-6 text-amber-400" />;
      case 'CloudMoon': return <CloudMoon className="w-6 h-6 text-indigo-300" />;
      case 'CloudDrizzle': return <CloudDrizzle className="w-6 h-6 text-sky-500" />;
      case 'CloudRain': return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'CloudSnow': return <CloudSnow className="w-6 h-6 text-sky-300" />;
      case 'CloudLightning': return <CloudLightning className="w-6 h-6 text-amber-500" />;
      default: return <Cloud className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="bg-zinc-900/60 rounded-3xl p-6 shadow-xl border border-zinc-800/80 space-y-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 font-display">Hourly Forecast</h3>
            <p className="text-xs text-zinc-400">Next 24-hour temperature & precipitation outlook</p>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {next24.map((item, index) => {
          const condition = getWeatherCondition(item.code, item.isDay);
          return (
            <div
              key={`${item.timeStr}-${index}`}
              className={`flex-none w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                index === 0
                  ? 'bg-sky-500 text-zinc-950 font-bold shadow-lg shadow-sky-500/20'
                  : 'bg-zinc-950/60 hover:bg-zinc-800/60 border border-zinc-800 text-zinc-200'
              }`}
            >
              <span className={`text-xs font-semibold ${index === 0 ? 'text-zinc-950' : 'text-zinc-400'}`}>
                {item.timeFormatted}
              </span>

              <div className="my-3 flex items-center justify-center">
                {index === 0 ? (
                  <Sun className="w-6 h-6 text-zinc-950" />
                ) : (
                  renderIcon(condition.iconName)
                )}
              </div>

              <div className={`text-base font-extrabold ${index === 0 ? 'text-zinc-950' : 'text-zinc-100'}`}>
                {formatTemperature(item.tempC, unit)}
              </div>

              {item.precipProb > 10 ? (
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full ${
                    index === 0 ? 'bg-zinc-950 text-sky-400' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}
                >
                  <Droplets className="w-3 h-3 shrink-0" />
                  <span>{item.precipProb}%</span>
                </div>
              ) : (
                <div className={`text-[10px] mt-2 ${index === 0 ? 'text-zinc-950/70' : 'text-zinc-500'}`}>
                  0% rain
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
