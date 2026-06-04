import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "../../database/fuel_tracker.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS fuel_prices (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            company     TEXT NOT NULL,
            fuel_type   TEXT NOT NULL,
            price       REAL NOT NULL,
            unit        TEXT NOT NULL,
            scraped_at  TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()