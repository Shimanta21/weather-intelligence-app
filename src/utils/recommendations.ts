import { ForecastResponse, WeatherRecommendation, ActivitySuitability } from '../types';
import { getWeatherCondition } from './wmoCodes';

export function generateRecommendations(forecast: ForecastResponse): WeatherRecommendation {
  const current = forecast.current_weather;
  const temp = current.temperature;
  const wind = current.windspeed;
  const code = current.weathercode;
  const condition = getWeatherCondition(code, current.is_day);

  // Daily metrics
  const maxPrecip = forecast.daily.precipitation_probability_max[0] ?? 0;
  const maxTemp = forecast.daily.temperature_2m_max[0] ?? temp;
  const minTemp = forecast.daily.temperature_2m_min[0] ?? temp;
  const uvMax = forecast.daily.uv_index_max?.[0] ?? (current.is_day ? 5 : 0);

  const umbrellaNeeded = maxPrecip >= 35 || ['drizzle', 'rain', 'thunderstorm'].includes(condition.category);
  const sunProtectionNeeded = current.is_day === 1 && (uvMax >= 5 || condition.category === 'clear');
  const jacketNeeded = minTemp < 14 || temp < 15 || wind > 25;

  let outdoorRating: 'Excellent' | 'Moderate' | 'Poor' = 'Excellent';
  if (umbrellaNeeded || wind > 35 || temp > 36 || temp < 0) {
    outdoorRating = 'Poor';
  } else if (maxPrecip > 20 || wind > 20 || temp < 10 || temp > 30 || condition.category === 'cloudy') {
    outdoorRating = 'Moderate';
  }

  // Construct headline & summary
  let headline = "Great day outdoors!";
  let summary = "Mild temperatures and clear conditions make it an ideal time for outdoor plans.";
  const recList: string[] = [];

  if (umbrellaNeeded) {
    if (maxPrecip >= 70 || condition.category === 'rain' || condition.category === 'thunderstorm') {
      headline = "Rain likely — Carry an umbrella!";
      summary = `High chance of precipitation (${maxPrecip}%). Keep waterproof gear handy and plan indoor backups if needed.`;
      recList.push("Pack a sturdy umbrella or waterproof rain coat.");
      recList.push("Drive cautiously; wet road conditions expected.");
    } else {
      headline = "Chance of showers — Pack an umbrella";
      summary = `Moderate chance of rain (${maxPrecip}%). Scattered showers may occur during the day.`;
      recList.push("Keep a compact umbrella in your bag.");
    }
  } else if (temp > 32) {
    headline = "Hot weather — Stay hydrated!";
    summary = `High temperatures reaching ${Math.round(maxTemp)}°C. Seek shade and avoid intense midday sun.`;
    recList.push("Drink plenty of water throughout the day.");
    recList.push("Wear lightweight, light-colored clothing.");
  } else if (temp < 5) {
    headline = "Freezing temperatures — Dress warmly!";
    summary = `Chilly conditions dipping to ${Math.round(minTemp)}°C. Thermal insulation and warm accessories recommended.`;
    recList.push("Layer up with a thermal jacket, gloves, and a beanie.");
    recList.push("Watch for slippery or icy patches outdoors.");
  } else if (wind > 30) {
    headline = "Breezy conditions — Secure light items";
    summary = `Strong wind gusts up to ${Math.round(wind)} km/h. Take care during outdoor activities.`;
    recList.push("Secure loose outdoor furniture or light items.");
    recList.push("Windbreakers recommended if spending time outside.");
  } else if (condition.category === 'clear') {
    headline = "Clear skies — Great day for outdoor plans!";
    summary = "Pleasant, sunny conditions with low rain risk. Excellent weather for walks, sports, and dining out.";
    recList.push("Ideal conditions for outdoor exercise or dining.");
  } else if (condition.category === 'cloudy') {
    headline = "Overcast day — Comfortable for light activities";
    summary = "Cloud cover keeps direct sun low with mild temperatures. Good for walks and errands.";
    recList.push("Comfortable light clothing is sufficient.");
  }

  if (sunProtectionNeeded) {
    recList.push(`UV Index is elevated (${Math.round(uvMax)}). Apply SPF 30+ sunscreen and wear sunglasses.`);
  }

  if (jacketNeeded && !recList.some(r => r.includes('jacket') || r.includes('warmly'))) {
    recList.push("A light jacket or sweater is recommended for cooler hours.");
  }

  if (recList.length === 0) {
    recList.push("Conditions are calm and balanced — enjoy your day!");
  }

  // Activity suitability scores
  const activities: ActivitySuitability[] = [
    evaluateRunning(temp, wind, maxPrecip, condition.category),
    evaluateCycling(wind, maxPrecip, condition.category),
    evaluatePicnic(maxPrecip, wind, temp, condition.category),
    evaluateHiking(maxPrecip, temp, condition.category),
    evaluateStargazing(condition.category, maxPrecip, current.is_day),
    evaluateOutdoorDining(temp, maxPrecip, wind, condition.category),
  ];

  return {
    headline,
    summary,
    umbrellaNeeded,
    sunProtectionNeeded,
    jacketNeeded,
    outdoorRating,
    recommendations: recList,
    activities,
  };
}

function evaluateRunning(temp: number, wind: number, rainProb: number, cat: string): ActivitySuitability {
  let score = 95;
  let reason = "Ideal temperature and calm breeze for a run.";

  if (rainProb > 50 || cat === 'rain' || cat === 'thunderstorm') {
    score -= 45;
    reason = "Wet roads and high precipitation risk.";
  } else if (rainProb > 25) {
    score -= 15;
    reason = "Slight chance of rain showers during your run.";
  }

  if (temp > 28) {
    score -= 30;
    reason = "Warm temperatures — run in early morning or evening.";
  } else if (temp < 2) {
    score -= 25;
    reason = "Cold air; dress in thermal layers and warm up well.";
  }

  if (wind > 30) {
    score -= 20;
    reason = "Strong wind resistance expected.";
  }

  return getSuitability('Running / Jogging', 'Footprints', score, reason);
}

function evaluateCycling(wind: number, rainProb: number, cat: string): ActivitySuitability {
  let score = 90;
  let reason = "Smooth cycling conditions with good traction.";

  if (wind > 35) {
    score -= 50;
    reason = "Dangerous wind gusts for road cycling.";
  } else if (wind > 20) {
    score -= 20;
    reason = "Headwinds present; moderate effort required.";
  }

  if (rainProb > 40 || cat === 'rain') {
    score -= 40;
    reason = "Slippery roads and reduced braking efficiency.";
  }

  return getSuitability('Cycling & Biking', 'Bike', score, reason);
}

function evaluatePicnic(rainProb: number, wind: number, temp: number, cat: string): ActivitySuitability {
  let score = 90;
  let reason = "Pleasant atmosphere for an outdoor gathering.";

  if (rainProb > 30 || cat === 'rain') {
    score -= 55;
    reason = "Rain risk makes grass wet and seating damp.";
  }

  if (wind > 25) {
    score -= 30;
    reason = "Windy gusts may disturb light setups.";
  }

  if (temp < 15 || temp > 33) {
    score -= 30;
    reason = "Temperature is outside optimal comfort range.";
  }

  return getSuitability('Picnic & Parks', 'TreePine', score, reason);
}

function evaluateHiking(rainProb: number, temp: number, cat: string): ActivitySuitability {
  let score = 85;
  let reason = "Great visibility and firm trail conditions.";

  if (cat === 'thunderstorm') {
    score = 10;
    reason = "Severe risk! Lightning danger on exposed trails.";
  } else if (rainProb > 50 || cat === 'rain') {
    score -= 45;
    reason = "Muddy trails and reduced footholds.";
  } else if (temp > 32) {
    score -= 25;
    reason = "Heat risk on unshaded trails.";
  }

  return getSuitability('Hiking & Trails', 'Compass', score, reason);
}

function evaluateStargazing(cat: string, rainProb: number, isDay: number): ActivitySuitability {
  let score = 90;
  let reason = "Clear sky optics expected tonight.";

  if (isDay === 1) {
    reason = "Nighttime viewing will depend on clear sky holding.";
  }

  if (cat === 'cloudy' || cat === 'overcast') {
    score -= 60;
    reason = "Dense cloud layer obscuring stars.";
  } else if (cat === 'rain' || rainProb > 30) {
    score -= 70;
    reason = "Precipitation and cloud cover block night sky.";
  }

  return getSuitability('Stargazing', 'Sparkles', score, reason);
}

function evaluateOutdoorDining(temp: number, rainProb: number, wind: number, cat: string): ActivitySuitability {
  let score = 90;
  let reason = "Comfortable patio weather.";

  if (rainProb > 30 || cat === 'rain') {
    score -= 50;
    reason = "Covered or indoor dining strongly recommended.";
  } else if (wind > 25) {
    score -= 25;
    reason = "Drafty wind gusts outdoors.";
  } else if (temp < 16) {
    score -= 20;
    reason = "Patio heaters or warm layers recommended.";
  }

  return getSuitability('Outdoor Dining', 'Utensils', score, reason);
}

function getSuitability(name: string, icon: string, score: number, reason: string): ActivitySuitability {
  const clampedScore = Math.max(0, Math.min(100, score));
  let status: 'Ideal' | 'Good' | 'Fair' | 'Not Recommended' = 'Ideal';

  if (clampedScore < 40) {
    status = 'Not Recommended';
  } else if (clampedScore < 65) {
    status = 'Fair';
  } else if (clampedScore < 85) {
    status = 'Good';
  }

  return {
    name,
    icon,
    score: clampedScore,
    status,
    reason,
  };
}
