from sqlalchemy import text
from database import engine

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        print(" Connected successfully")
        print("PostgreSQL version:", result.scalar())
except Exception as e:
    print(" Connection failed:", e)
