"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FuelPrice } from "@/types/price";

interface PriceChartProps {
  prices: FuelPrice[];
  company: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

export default function PriceChart({ prices, company }: PriceChartProps) {
  if (prices.length === 0) {
    return (
      <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl p-4 h-48 flex items-center justify-center">
        <p className="text-sm text-gray-500">No price history available yet</p>
      </div>
    );
  }

  const chartData = prices
    .sort(
      (a, b) =>
        new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime(),
    )
    .map((p) => ({
      date: formatDate(p.scraped_at),
      price: p.price,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111827] border border-[#1E2A3A] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-semibold text-[#00FF94]">
            ₱{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0D1520] border border-[#1E2A3A] rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
        {company} — Price History
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#4B5563", fontSize: 11 }}
            axisLine={{ stroke: "#1E2A3A" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4B5563", fontSize: 11 }}
            axisLine={{ stroke: "#1E2A3A" }}
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v) => `₱${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00FF94"
            strokeWidth={2}
            dot={{ fill: "#00FF94", r: 3 }}
            activeDot={{ r: 5, fill: "#00FF94" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
