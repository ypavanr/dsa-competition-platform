from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import redis.asyncio as redis
import logging

logger = logging.getLogger("DBLoader")

POSTGRES_URL = "postgresql+asyncpg://postgres:password@localhost:5432/login_db"
REDIS_HOST = "localhost"
REDIS_PORT = 6379

engine = create_async_engine(POSTGRES_URL)
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

async def preload_usernames_async():
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT username FROM students"))
            rows = result.fetchall()

            for (username,) in rows:
                await redis_client.set(username, 1)

            logger.info(f" Preloaded {len(rows)} usernames into Redis.")
    except Exception as e:
        logger.error(f" Failed to preload usernames: {e}")
