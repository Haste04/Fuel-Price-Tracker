"use client";

interface FuelTypeToggleProps {
  selected: string;
  onChange: (fuelType: string) => void;
}

const FUEL_TYPES = [
  { key: "unleaded-91", label: "Unleaded 91" },
  { key: "premium-95", label: "Premium 95" },
  { key: "diesel", label: "Diesel" },
  { key: "diesel-plus", label: "Diesel Plus" },
  { key: "kerosene", label: "Kerosene" },
  { key: "lpg", label: "LPG" },
];

export default function FuelTypeToggle({
  selected,
  onChange,
}: FuelTypeToggleProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FUEL_TYPES.map((fuel) => (
        <button
          key={fuel.key}
          onClick={() => onChange(fuel.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selected === fuel.key
              ? "bg-[#00FF94] text-[#0A0F1E]"
              : "bg-[#111827] text-gray-400 border border-[#1E2A3A] hover:border-[#00FF94] hover:text-[#00FF94]"
          }`}
        >
          {fuel.label}
        </button>
      ))}
    </div>
  );
}
