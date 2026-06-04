from db.database import get_connection
from schemas.price import FuelPrice

def insert_price(price: FuelPrice):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO fuel_prices (company, fuel_type, price, unit, scraped_at)
        VALUES (?, ?, ?, ?, ?)
    """, (
        price.company,
        price.fuel_type,
        price.price,
        price.unit,
        price.scraped_at.isoformat()
    ))

    conn.commit()
    conn.close()

def get_all_prices():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM fuel_prices
        ORDER BY scraped_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]

def get_prices_by_company(company: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM fuel_prices
        WHERE company = ?
        ORDER BY scraped_at DESC
    """, (company,))

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]

def get_prices_by_fuel_type(fuel_type: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM fuel_prices
        WHERE fuel_type = ?
        ORDER BY scraped_at DESC
    """, (fuel_type,))

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]