from fastapi import APIRouter, HTTPException
from ml.model import predict_next_price
from ml.confidence import build_prediction_response

router = APIRouter()

@router.get("/predict/{company}/{fuel_type}")
def get_prediction(company: str, fuel_type: str):
    try:
        raw = predict_next_price(company, fuel_type)
        response = build_prediction_response(raw)
        return {"status": "ok", "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predict/all/{fuel_type}")
def get_all_predictions(fuel_type: str):
    companies = ["Shell", "Petron", "Caltex", "Phoenix", "Seaoil"]
    results = []

    for company in companies:
        try:
            raw = predict_next_price(company, fuel_type)
            response = build_prediction_response(raw)
            results.append(response)
        except Exception as e:
            results.append({
                "available": False,
                "company": company,
                "reason": str(e)
            })

    return {"status": "ok", "data": results}