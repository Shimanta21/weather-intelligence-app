export type TemperatureUnit = 'C' | 'F';

export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m?: number[];
  apparent_temperature?: number[];
  precipitation_probability?: number[];
  weather_code?: number[];
  wind_speed_10m?: number[];
  uv_index?: number[];
}

export interface DailyForecastData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  weather_code: number[];
  sunrise?: string[];
  sunset?: string[];
  uv_index_max?: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  hourly?: HourlyForecastData;
  daily: DailyForecastData;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  gradient: string;
  bgClass: string;
  textClass: string;
}

export interface ActivitySuitability {
  name: string;
  icon: string;
  score: number; // 0 to 100
  status: 'Ideal' | 'Good' | 'Fair' | 'Not Recommended';
  reason: string;
}

export interface WeatherRecommendation {
  headline: string;
  summary: string;
  umbrellaNeeded: boolean;
  sunProtectionNeeded: boolean;
  jacketNeeded: boolean;
  outdoorRating: 'Excellent' | 'Moderate' | 'Poor';
  recommendations: string[];
  activities: ActivitySuitability[];
}

export interface FavoriteCity {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
