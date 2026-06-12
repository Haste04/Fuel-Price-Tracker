import axios from "axios";
import { FuelPrice, Prediction, ApiResponse } from "@/types/price";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export async function getAllPrices(): Promise<FuelPrice[]> {
  const response = await api.get<ApiResponse<FuelPrice[]>>("/prices");
  return response.data.data;
}

export async function getPricesByCompany(
  company: string,
): Promise<FuelPrice[]> {
  const response = await api.get<ApiResponse<FuelPrice[]>>(
    `/prices/company/${company}`,
  );
  return response.data.data;
}

export async function getPricesByFuelType(
  fuelType: string,
): Promise<FuelPrice[]> {
  const response = await api.get<ApiResponse<FuelPrice[]>>(
    `/prices/fuel/${fuelType}`,
  );
  return response.data.data;
}

export async function getPrediction(
  company: string,
  fuelType: string,
): Promise<Prediction> {
  const response = await api.get<ApiResponse<Prediction>>(
    `/predict/${company}/${fuelType}`,
  );
  return response.data.data;
}

export async function getAllPredictions(
  fuelType: string,
): Promise<Prediction[]> {
  const response = await api.get<ApiResponse<Prediction[]>>(
    `/predict/all/${fuelType}`,
  );
  return response.data.data;
}
