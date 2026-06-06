import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from db.queries import get_prices_by_company

def prepare_data(company: str, fuel_type: str):
    rows = get_prices_by_company(company)
    filtered = [r for r in rows if r["fuel_type"] == fuel_type]

    if len(filtered) < 2:
        return None

    df = pd.DataFrame(filtered)
    df["scraped_at"] = pd.to_datetime(df["scraped_at"])
    df = df.sort_values("scraped_at")
    df = df.drop_duplicates(subset=["scraped_at"])
    df = df.set_index("scraped_at")

    return df["price"]

def simple_prediction(series: pd.Series, company: str, fuel_type: str):
    predicted = round(float(series.iloc[-1]), 2)
    spread = round(predicted * 0.03, 2)
    lower = round(predicted - spread, 2)
    upper = round(predicted + spread, 2)

    return {
        "company": company,
        "fuel_type": fuel_type,
        "predicted_price": predicted,
        "lower_bound": lower,
        "upper_bound": upper,
        "confidence_percent": 60.0,
        "predicted_for": "next week"
    }

def predict_next_price(company: str, fuel_type: str):
    series = prepare_data(company, fuel_type)

    if series is None:
        return None

    if len(series) < 5:
        return simple_prediction(series, company, fuel_type)

    try:
        model = ARIMA(series, order=(1, 1, 1))
        result = model.fit()

        forecast = result.get_forecast(steps=1)
        predicted = float(forecast.predicted_mean.iloc[0])
        conf_int = forecast.conf_int(alpha=0.05)

        lower = float(conf_int.iloc[0, 0])
        upper = float(conf_int.iloc[0, 1])
        confidence = round((1 - (upper - lower) / predicted) * 100, 2)

        return {
            "company": company,
            "fuel_type": fuel_type,
            "predicted_price": round(predicted, 2),
            "lower_bound": round(lower, 2),
            "upper_bound": round(upper, 2),
            "confidence_percent": max(0, min(100, confidence)),
            "predicted_for": "next week"
        }

    except Exception as e:
        return simple_prediction(series, company, fuel_type)