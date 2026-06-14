dev:
	start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app"
	start cmd /k "cd scraper && go run main.go"
	start cmd /k "cd frontend && npm run dev"