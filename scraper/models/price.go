package models

import "time"

type FuelPrice struct {
    Company   string    `json:"company"`
    FuelType  string    `json:"fuel_type"`
    Price     float64   `json:"price"`
    Unit      string    `json:"unit"`
    ScrapedAt time.Time `json:"scraped_at"`
}