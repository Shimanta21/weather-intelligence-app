import { WeatherConditionInfo } from '../types';

export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: isDay ? 'Bright and clear sunshine' : 'Clear starry night sky',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        gradient: isDay 
          ? 'from-amber-400 via-orange-400 to-sky-500' 
          : 'from-slate-900 via-indigo-950 to-slate-900',
        bgClass: isDay ? 'bg-amber-500/10 text-amber-700' : 'bg-indigo-950/20 text-indigo-300',
        textClass: 'text-amber-500',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly sunny with a few wispy clouds',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        category: 'clear',
        gradient: 'from-sky-400 via-blue-500 to-indigo-600',
        bgClass: 'bg-sky-500/10 text-sky-700',
        textClass: 'text-sky-500',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Sun intermittently peaking through clouds',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
        gradient: 'from-blue-400 via-slate-400 to-slate-600',
        bgClass: 'bg-blue-500/10 text-blue-700',
        textClass: 'text-blue-500',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense cloud cover blocking direct sunlight',
        iconName: 'Cloud',
        category: 'cloudy',
        gradient: 'from-slate-500 via-gray-600 to-slate-800',
        bgClass: 'bg-slate-500/10 text-slate-700',
        textClass: 'text-slate-500',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to mist and atmospheric fog',
        iconName: 'CloudFog',
        category: 'fog',
        gradient: 'from-slate-400 via-zinc-500 to-slate-700',
        bgClass: 'bg-zinc-500/10 text-zinc-700',
        textClass: 'text-zinc-500',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light misty rain falling continuously',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
        gradient: 'from-sky-500 via-blue-600 to-slate-700',
        bgClass: 'bg-sky-500/10 text-sky-700',
        textClass: 'text-sky-500',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Icy precipitation creating slick surfaces',
        iconName: 'CloudSnow',
        category: 'snow',
        gradient: 'from-cyan-500 via-sky-600 to-slate-800',
        bgClass: 'bg-cyan-500/10 text-cyan-700',
        textClass: 'text-cyan-500',
      };
    case 61:
      return {
        label: 'Light Rain',
        description: 'Gentle rainfall across the region',
        iconName: 'CloudRain',
        category: 'rain',
        gradient: 'from-blue-500 via-cyan-600 to-slate-800',
        bgClass: 'bg-blue-500/10 text-blue-700',
        textClass: 'text-blue-500',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady steady rainfall, wet roads ahead',
        iconName: 'CloudRain',
        category: 'rain',
        gradient: 'from-blue-600 via-indigo-700 to-slate-900',
        bgClass: 'bg-blue-600/10 text-blue-800',
        textClass: 'text-blue-600',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Torrential downpour with standing water',
        iconName: 'CloudRainWind',
        category: 'rain',
        gradient: 'from-indigo-700 via-slate-800 to-blue-950',
        bgClass: 'bg-indigo-600/10 text-indigo-800',
        textClass: 'text-indigo-600',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Rain freezing instantly on cold outdoor impact',
        iconName: 'CloudHail',
        category: 'rain',
        gradient: 'from-cyan-600 via-blue-800 to-slate-900',
        bgClass: 'bg-cyan-600/10 text-cyan-800',
        textClass: 'text-cyan-600',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowfall',
        description: 'Snow flakes accumulating on surfaces',
        iconName: 'Snowflake',
        category: 'snow',
        gradient: 'from-sky-300 via-blue-400 to-indigo-600',
        bgClass: 'bg-sky-400/10 text-sky-800',
        textClass: 'text-sky-600',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Passing rain bursts mixed with clearer intervals',
        iconName: 'CloudRain',
        category: 'rain',
        gradient: 'from-blue-500 via-indigo-600 to-slate-800',
        bgClass: 'bg-blue-500/10 text-blue-700',
        textClass: 'text-blue-500',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Intermittent snow flurries and gusty breeze',
        iconName: 'CloudSnow',
        category: 'snow',
        gradient: 'from-indigo-400 via-slate-600 to-slate-900',
        bgClass: 'bg-indigo-500/10 text-indigo-800',
        textClass: 'text-indigo-600',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        description: 'Electrical activity with lightning and heavy gusts',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
        gradient: 'from-purple-800 via-slate-900 to-blue-950',
        bgClass: 'bg-purple-600/10 text-purple-800',
        textClass: 'text-purple-600',
      };
    default:
      return {
        label: 'Variable Conditions',
        description: 'Mixed atmospheric weather conditions',
        iconName: 'Cloud',
        category: 'cloudy',
        gradient: 'from-slate-600 via-gray-700 to-slate-900',
        bgClass: 'bg-slate-500/10 text-slate-700',
        textClass: 'text-slate-500',
      };
  }
}

export function formatTemperature(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function convertCelsiusToUnit(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}
