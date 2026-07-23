import { GeocodingLocation, ForecastResponse } from '../types';

export async function searchCities(query: string): Promise<GeocodingLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server error (${response.status})`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to search for city locations.');
  }
}

export async function getForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current_weather: 'true',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,sunrise,sunset,uv_index_max',
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned error HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.current_weather || !data.daily) {
      throw new Error('Invalid weather data structure received from Open-Meteo.');
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to retrieve forecast data.');
  }
}

export async function reverseGeocodeLocation(lat: number, lon: number): Promise<GeocodingLocation> {
  try {
    // Try bigdatacloud free reverse geocode client first for city name
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      return {
        id: Math.round(lat * 10000 + lon),
        name: city,
        latitude: lat,
        longitude: lon,
        country: country,
        admin1: data.principalSubdivision,
      };
    }
  } catch {
    // fallback
  }

  return {
    id: Math.round(lat * 1000 + lon),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
  };
}
