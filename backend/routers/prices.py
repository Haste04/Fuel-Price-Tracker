from fastapi import APIRouter, HTTPException
from db.queries import get_all_prices, get_prices_by_company, get_prices_by_fuel_type

router = APIRouter()

@router.get("/prices")
def get_prices():
    try:
        prices = get_all_prices()
        return {"status": "ok", "data": prices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/prices/company/{company}")
def get_prices_company(company: str):
    try:
        prices = get_prices_by_company(company)
        if not prices:
            raise HTTPException(status_code=404, detail=f"No prices found for {company}")
        return {"status": "ok", "data": prices}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/prices/fuel/{fuel_type}")
def get_prices_fuel(fuel_type: str):
    try:
        prices = get_prices_by_fuel_type(fuel_type)
        if not prices:
            raise HTTPException(status_code=404, detail=f"No prices found for {fuel_type}")
        return {"status": "ok", "data": prices}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))