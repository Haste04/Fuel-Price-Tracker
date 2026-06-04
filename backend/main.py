from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import init_db
from routers import ingest, prices

app = FastAPI(
    title="Fuel Tracker API",
    description="Tracks Philippine fuel prices and predictions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(ingest.router)
app.include_router(prices.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Fuel Tracker API is running"}