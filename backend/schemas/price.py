from pydantic import BaseModel
from datetime import datetime

class FuelPrice(BaseModel):
    company: str
    fuel_type: str
    price: float
    unit: str
    scraped_at: datetime