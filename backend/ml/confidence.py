def interpret_confidence(confidence_percent: float, lower: float, upper: float):
    spread = round(upper - lower, 2)

    if confidence_percent >= 80:
        level = "High"
        message = f"Price is likely between ₱{lower} and ₱{upper} next week"
    elif confidence_percent >= 60:
        level = "Moderate"
        message = f"Price may range between ₱{lower} and ₱{upper} next week"
    else:
        level = "Low"
        message = f"Price is uncertain, could be anywhere from ₱{lower} to ₱{upper}"

    return {
        "level": level,
        "message": message,
        "spread": spread
    }

def build_prediction_response(raw: dict):
    if not raw or "error" in raw:
        return {
            "available": False,
            "reason": raw.get("error", "Not enough data yet") if raw else "Not enough data yet"
        }

    confidence = interpret_confidence(
        raw["confidence_percent"],
        raw["lower_bound"],
        raw["upper_bound"]
    )

    return {
        "available": True,
        "company": raw["company"],
        "fuel_type": raw["fuel_type"],
        "predicted_price": raw["predicted_price"],
        "predicted_for": raw["predicted_for"],
        "confidence": {
            "percent": raw["confidence_percent"],
            "level": confidence["level"],
            "message": confidence["message"],
            "spread": confidence["spread"]
        }
    }