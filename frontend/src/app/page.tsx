"use client";

import { useEffect, useState } from "react";
import { FuelPrice, Prediction } from "@/types/price";
import {
  getPricesByFuelType,
  getPricesByCompany,
  getPrediction,
} from "@/lib/api";
import FuelTypeToggle from "@/components/FuelTypeToggle";
import CompanySelector from "@/components/CompanySelector";
import PriceChart from "@/components/PriceChart";
import PredictionCard from "@/components/PredictionCard";

export default function Home() {
  const [selectedFuel, setSelectedFuel] = useState("unleaded-91");
  const [selectedCompany, setSelectedCompany] = useState("Shell");
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [companyPrices, setCompanyPrices] = useState<FuelPrice[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      setLoadingPrices(true);
      try {
        const data = await getPricesByFuelType(selectedFuel);
        setPrices(data);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
      } finally {
        setLoadingPrices(false);
      }
    }
    fetchPrices();
  }, [selectedFuel]);

  useEffect(() => {
    async function fetchCompanyData() {
      setLoadingPrediction(true);
      try {
        const [history, pred] = await Promise.all([
          getPricesByCompany(selectedCompany),
          getPrediction(selectedCompany, selectedFuel),
        ]);
        setCompanyPrices(history);
        setPrediction(pred);
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setPrediction(null);
      } finally {
        setLoadingPrediction(false);
      }
    }
    fetchCompanyData();
  }, [selectedCompany, selectedFuel]);

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#1E2A3A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF94]"></div>
          <span className="font-medium tracking-wide">FuelWatch PH</span>
        </div>
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search country, fuel type, brand..."
            className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2 text-sm text-gray-400 focus:outline-none focus:border-[#00FF94]"
          />
        </div>
        <div className="text-xs text-gray-500">
          Philippines · Next update: Jun 10
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-600 border-b border-[#1E2A3A]">
        <span>World</span>
        <span>›</span>
        <span>Asia</span>
        <span>›</span>
        <span>Southeast Asia</span>
        <span>›</span>
        <span className="text-[#00FF94]">Philippines</span>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-100px)]">
        {/* Left — Map Panel */}
        <div className="w-72 border-r border-[#1E2A3A] p-4 flex flex-col gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Selected Region
          </p>

          {/* Philippines Map Placeholder */}
          <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl flex items-center justify-center h-48">
            <svg width="80" height="120" viewBox="0 0 120 160">
              <g fill="none" stroke="#00FF94" strokeWidth="0.8" opacity="0.7">
                <path d="M55,10 L60,8 L65,12 L63,18 L58,20 L54,16 Z" />
                <path d="M60,22 L65,20 L70,25 L68,32 L62,34 L58,30 L57,25 Z" />
                <path d="M50,28 L55,25 L57,30 L54,36 L49,35 Z" />
                <path d="M62,35 L70,33 L75,40 L72,48 L65,50 L60,45 L58,38 Z" />
                <path d="M65,52 L73,50 L78,58 L74,66 L66,68 L61,62 L60,55 Z" />
                <path d="M68,70 L75,68 L80,76 L76,84 L68,86 L63,80 L62,73 Z" />
                <path d="M70,88 L77,86 L82,94 L78,102 L70,104 L65,98 L64,91 Z" />
                <path d="M72,106 L78,104 L82,112 L77,120 L70,118 L67,112 Z" />
                <path d="M74,122 L79,120 L82,128 L77,135 L71,132 L69,126 Z" />
              </g>
              <circle cx="65" cy="60" r="3" fill="#00FF94" opacity="0.9" />
            </svg>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Quick Stats
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Brands tracked</span>
              <span className="text-white font-medium">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last updated</span>
              <span className="text-white font-medium">Jun 3, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Next update</span>
              <span className="text-[#00FF94] font-medium">Jun 10, 2026</span>
            </div>
          </div>
        </div>

        {/* Right — Data Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Fuel Type Tabs */}
          <FuelTypeToggle selected={selectedFuel} onChange={setSelectedFuel} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Company List — 1/3 width */}
            <div className="col-span-1">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                Brands
              </p>
              {loadingPrices ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-[#0D1520] border border-[#1E2A3A] rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <CompanySelector
                  prices={prices}
                  selected={selectedCompany}
                  onChange={setSelectedCompany}
                />
              )}
            </div>

            {/* Chart + Prediction — 2/3 width */}
            <div className="col-span-2 space-y-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                {selectedCompany} · {selectedFuel}
              </p>
              <PriceChart
                prices={companyPrices.filter(
                  (p) => p.fuel_type === selectedFuel,
                )}
                company={selectedCompany}
              />
              <PredictionCard
                prediction={prediction}
                loading={loadingPrediction}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
