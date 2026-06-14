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

	"github.com/robfig/cron/v3"
)

type BrandEntry struct {
	Name   string `json:"n"`
	Price  string `json:"price"`
	Change string `json:"chg"`
	Dir    string `json:"dir"`
	Status string `json:"status"`
	Date   string `json:"date"`
}

var targetCompanies = map[string]bool{
	"Shell":   true,
	"Petron":  true,
	"Caltex":  true,
	"Phoenix": true,
	"Seaoil":  true,
}

func scrape() {
	fmt.Println("Starting scrape at", time.Now().Format("2006-01-02 15:04:05"))

	resp, err := http.Get("https://www.fuelprice.ph")
	if err != nil {
		log.Println("Failed to fetch page:", err)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Failed to read body:", err)
		return
	}
	body := string(bodyBytes)

	re := regexp.MustCompile(`const brandData\s*=\s*(\{.*?\});`)
	matches := re.FindStringSubmatch(body)
	if len(matches) < 2 {
		log.Println("Could not find brandData in page")
		return
	}
	jsonStr := matches[1]

	var brandData map[string][]BrandEntry
	if err := json.Unmarshal([]byte(jsonStr), &brandData); err != nil {
		log.Println("Failed to parse brandData JSON:", err)
		return
	}

	for fuelType, brands := range brandData {
		for _, brand := range brands {
			if !targetCompanies[brand.Name] {
				continue
			}

			cleanPrice := strings.ReplaceAll(brand.Price, "\u20b1", "")
			cleanPrice = strings.TrimSpace(cleanPrice)

			price := models.FuelPrice{
				Company:   brand.Name,
				FuelType:  fuelType,
				Price:     parsePrice(cleanPrice),
				Unit:      "per liter",
				ScrapedAt: time.Now(),
			}

			fmt.Printf("Found: %s | %s | ₱%s\n", price.Company, price.FuelType, cleanPrice)

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
	// Run once immediately on startup
	scrape()

	// Schedule every Tuesday at 12:00 PM Philippine time
	ph, err := time.LoadLocation("Asia/Manila")
	if err != nil {
		log.Println("Could not load timezone, using UTC:", err)
		ph = time.UTC
	}

	c := cron.New(cron.WithLocation(ph))

	c.AddFunc("0 12 * * 2", func() {
		fmt.Println("Tuesday scheduler triggered!")
		scrape()
	})

	c.Start()
	fmt.Println("Scheduler running — will scrape every Tuesday at 12:00 PM Philippine time")
	fmt.Println("Press Ctrl+C to stop")

	select {}
}