"use client";

import { FuelPrice } from "@/types/price";

interface Company {
  name: string;
  code: string;
  color: string;
}

const COMPANIES: Company[] = [
  { name: "Shell", code: "SH", color: "#DD1D21" },
  { name: "Petron", code: "PE", color: "#005BAA" },
  { name: "Caltex", code: "CA", color: "#E31837" },
  { name: "Phoenix", code: "PH", color: "#F47920" },
  { name: "Seaoil", code: "SE", color: "#00843D" },
];

interface CompanySelectorProps {
  prices: FuelPrice[];
  selected: string;
  onChange: (company: string) => void;
}

function getPriceForCompany(
  prices: FuelPrice[],
  company: string,
): FuelPrice | undefined {
  return prices.find((p) => p.company === company);
}

export default function CompanySelector({
  prices,
  selected,
  onChange,
}: CompanySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {COMPANIES.map((company) => {
        const priceData = getPriceForCompany(prices, company.name);

        return (
          <button
            key={company.name}
            onClick={() => onChange(company.name)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
              selected === company.name
                ? "border-[#00FF94] bg-[#0D1F17]"
                : "border-[#1E2A3A] bg-[#0D1520] hover:border-[#00FF94]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: company.color }}
              >
                {company.code}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{company.name}</p>
                <p className="text-xs text-gray-500">
                  {priceData
                    ? "Settled · " +
                      new Date(priceData.scraped_at).toLocaleDateString(
                        "en-PH",
                        { month: "short", day: "numeric" },
                      )
                    : "No data"}
                </p>
              </div>
            </div>

            <div className="text-right">
              {priceData ? (
                <>
                  <p className="text-sm font-semibold text-white">
                    ₱{priceData.price.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-600">—</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
