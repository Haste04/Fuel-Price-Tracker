"use client";

import { Prediction } from "@/types/price";

interface PredictionCardProps {
  prediction: Prediction | null;
  loading: boolean;
}

export default function PredictionCard({
  prediction,
  loading,
}: PredictionCardProps) {
  if (loading) {
    return (
      <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[#1E2A3A] rounded w-1/3"></div>
          <div className="h-8 bg-[#1E2A3A] rounded w-1/2"></div>
          <div className="h-4 bg-[#1E2A3A] rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!prediction || !prediction.available) {
    return (
      <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl p-4">
        <p className="text-sm text-gray-500">
          Not enough data for prediction yet. Check back after more weekly
          scrapes.
        </p>
      </div>
    );
  }

  const confidenceColor =
    prediction.confidence.level === "High"
      ? "text-[#00FF94] border-[#00FF94] bg-[rgba(0,255,148,0.1)]"
      : prediction.confidence.level === "Moderate"
        ? "text-yellow-400 border-yellow-400 bg-[rgba(255,200,0,0.1)]"
        : "text-red-400 border-red-400 bg-[rgba(255,68,68,0.1)]";

  return (
    <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-400 uppercase tracking-widest">
          Next Week Forecast
        </h3>
        <span className={`text-xs px-2 py-1 rounded border ${confidenceColor}`}>
          {prediction.confidence.level} · {prediction.confidence.percent}%
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-[#00FF94]">
          ₱{prediction.predicted_price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500">/ liter</span>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">Lower bound</p>
          <p className="text-white font-medium">
            ₱{prediction.confidence.spread ?? "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-1">Upper bound</p>
          <p className="text-white font-medium">
            ₱{prediction.confidence.spread ?? "—"}
          </p>
        </div>
      </div>

      <div className="bg-[#111827] rounded-lg p-3">
        <p className="text-xs text-gray-400">{prediction.confidence.message}</p>
      </div>
    </div>
  );
}
