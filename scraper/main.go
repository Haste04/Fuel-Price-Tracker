package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"fuel-tracker/scraper/client"
	"fuel-tracker/scraper/models"
)

// This represents one brand entry inside brandData
type BrandEntry struct {
	Name   string `json:"n"`
	Price  string `json:"price"`
	Change string `json:"chg"`
	Dir    string `json:"dir"`
	Status string `json:"status"`
	Date   string `json:"date"`
}

// The companies we care about
var targetCompanies = map[string]bool{
	"Shell":   true,
	"Petron":  true,
	"Caltex":  true,
	"Phoenix": true,
	"Seaoil":  true,
}

func scrape() {
	fmt.Println("Starting scrape...")

	// Step 1: Fetch the page
	resp, err := http.Get("https://www.fuelprice.ph")
	if err != nil {
		log.Println("Failed to fetch page:", err)
		return
	}
	defer resp.Body.Close()

	// Step 2: Read the full HTML body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Failed to read body:", err)
		return
	}
	body := string(bodyBytes)

	// Step 3: Extract the brandData JSON using regex
	re := regexp.MustCompile(`const brandData\s*=\s*(\{.*?\});`)
	matches := re.FindStringSubmatch(body)
	if len(matches) < 2 {
		log.Println("Could not find brandData in page")
		return
	}
	jsonStr := matches[1]

	// Step 4: Parse the JSON into a map
	var brandData map[string][]BrandEntry
	if err := json.Unmarshal([]byte(jsonStr), &brandData); err != nil {
		log.Println("Failed to parse brandData JSON:", err)
		return
	}

	// Step 5: Loop through each fuel type and each brand
	for fuelType, brands := range brandData {
		for _, brand := range brands {

			// Skip companies we don't care about
			if !targetCompanies[brand.Name] {
				continue
			}

			// Clean the price — remove the ₱ unicode symbol
			cleanPrice := strings.ReplaceAll(brand.Price, "\u20b1", "")
			cleanPrice = strings.TrimSpace(cleanPrice)

			// Build our FuelPrice struct
			price := models.FuelPrice{
				Company:   brand.Name,
				FuelType:  fuelType,
				Price:     parsePrice(cleanPrice),
				Unit:      "per liter",
				ScrapedAt: time.Now(),
			}

			fmt.Printf("Found: %s | %s | ₱%s\n", price.Company, price.FuelType, cleanPrice)

			// Step 6: Send to FastAPI
			if err := client.SendPrice(price); err != nil {
				log.Printf("Failed to send %s %s: %v\n", price.Company, price.FuelType, err)
			}
		}
	}

	fmt.Println("Scrape complete!")
}

func parsePrice(s string) float64 {
	var f float64
	fmt.Sscanf(s, "%f", &f)
	return f
}

func main() {
	scrape()
}