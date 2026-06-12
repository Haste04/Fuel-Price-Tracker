export interface FuelPrice {
  id: number;
  company: string;
  fuel_type: string;
  price: number;
  unit: string;
  scraped_at: string;
}

export interface Prediction {
  available: boolean;
  company: string;
  fuel_type: string;
  predicted_price: number;
  predicted_for: string;
  confidence: {
    percent: number;
    level: string;
    message: string;
    spread: number;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}
