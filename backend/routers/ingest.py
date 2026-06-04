from fastapi import APIRouter, HTTPException
from schemas.price import FuelPrice
from db.queries import insert_price

router = APIRouter()

@router.post("/ingest")
def ingest_price(price: FuelPrice):
    try:
        insert_price(price)
        return {"status": "ok", "message": f"Saved {price.company} {price.fuel_type}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))