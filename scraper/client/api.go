package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"fuel-tracker/scraper/models"
)

func SendPrice(price models.FuelPrice) error {
    jsonData, err := json.Marshal(price)
    if err != nil {
        return fmt.Errorf("failed to convert price to JSON: %w", err)
    }

    resp, err := http.Post(
        "http://localhost:8000/ingest",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        return fmt.Errorf("failed to send price to API: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("API returned unexpected status: %d", resp.StatusCode)
    }

    return nil
}