import React from 'react';
import { ForecastResponse } from '../types';
import { generateRecommendations } from '../utils/recommendations';
import {
  Umbrella,
  Sun,
  Shirt,
  Sparkles,
  Footprints,
  Bike,
  TreePine,
  Compass,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface PlanningCardProps {
  forecast: ForecastResponse;
}

export const PlanningCard: React.FC<PlanningCardProps> = ({ forecast }) => {
  const rec = generateRecommendations(forecast);

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'Bike': return <Bike className="w-4 h-4 text-sky-400" />;
      case 'TreePine': return <TreePine className="w-4 h-4 text-amber-400" />;
      case 'Compass': return <Compass className="w-4 h-4 text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-rose-400" />;
      default: return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ideal':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Ideal
          </span>
        );
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            Good
          </span>
        );
      case 'Fair':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Fair
          </span>
        );
      case 'Not Recommended':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Not Recommended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-zinc-900/60 rounded-3xl p-6 shadow-xl border border-zinc-800/80 space-y-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100 font-display">
              Planning & Activity Recommendations
            </h3>
            <p className="text-xs text-zinc-400">
              Tailored outdoor planning advice based on live weather condition metrics
            </p>
          </div>
        </div>

        {/* Outdoor Rating Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Outdoor Rating:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
              rec.outdoorRating === 'Excellent'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : rec.outdoorRating === 'Moderate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {rec.outdoorRating}
          </span>
        </div>
      </div>

      {/* Primary Recommendation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/10 border border-sky-500/20 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500 text-zinc-950 font-bold shrink-0 mt-0.5 shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-zinc-100">
              {rec.headline}
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {rec.summary}
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-500/20">
          {rec.umbrellaNeeded && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-300 text-xs font-bold rounded-xl border border-sky-500/20">
              <Umbrella className="w-4 h-4 text-sky-400" />
              Carry an Umbrella
            </span>
          )}
          {rec.sunProtectionNeeded && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/20">
              <Sun className="w-4 h-4 text-amber-400" />
              Sunscreen & Sunglasses
            </span>
          )}
          {rec.jacketNeeded && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/20">
              <Shirt className="w-4 h-4 text-indigo-400" />
              Warm Jacket / Layer Up
            </span>
          )}
        </div>
      </div>

      {/* Key Tips List */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Smart Tips for Today
        </h5>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {rec.recommendations.map((tip, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-zinc-300"
            >
              <span className="h-2 w-2 rounded-full bg-sky-400 mt-2 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity Suitability Matrix */}
      <div className="space-y-3 pt-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Outdoor Activity Planner
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rec.activities.map((act) => (
            <div
              key={act.name}
              className="p-3.5 rounded-2xl bg-zinc-950/60 hover:bg-zinc-800/50 border border-zinc-800 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    {getActivityIcon(act.icon)}
                  </div>
                  <span className="text-xs font-bold text-zinc-200">{act.name}</span>
                </div>
                {getStatusBadge(act.status)}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    act.score >= 80
                      ? 'bg-emerald-400'
                      : act.score >= 60
                      ? 'bg-sky-400'
                      : act.score >= 40
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${act.score}%` }}
                />
              </div>

              <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                {act.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
