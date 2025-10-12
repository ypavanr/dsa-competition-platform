from fastapi import FastAPI, Request, HTTPException, status
from pydantic import BaseModel
from confluent_kafka import Producer
from contextlib import asynccontextmanager
from jose import jwt
from datetime import datetime, timedelta
import json, uuid, socket, logging
from connect_db import preload_usernames_async, redis_client  
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
ADMIN_PASSWORD = "secureadminpass"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GatewayService")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await preload_usernames_async()

    producer = Producer({
        "bootstrap.servers": KAFKA_BOOTSTRAP_SERVERS,
        "client.id": socket.gethostname(),
    })
    app.state.producer = producer
    logger.info(" Kafka producer initialized.")

    yield

    logger.info(" Flushing Kafka producer before shutdown.")
    producer.flush()
    logger.info(" Kafka producer closed.")

app = FastAPI(lifespan=lifespan, title="Gateway API")

# Models
class StudentLogin(BaseModel):
    username: str

class AdminLogin(BaseModel):
    password: str

# JWT helper
def create_jwt_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# Redis helpers
async def student_exists(username: str) -> bool:
    return bool(await redis_client.exists(username))

async def cache_student(username: str):
    await redis_client.set(username, 1)

# Kafka callback
def kafka_callback(err, msg):
    if err:
        logger.error(f" Kafka delivery failed: {err}")
    else:
        logger.info(f" Kafka message delivered to {msg.topic()} offset {msg.offset()}")

# Routes
@app.post("/student-login", status_code=status.HTTP_200_OK)
async def login_student(user_data: StudentLogin, request: Request):
    username = user_data.username.strip().lower()
    client_ip = request.client.host if request.client else "unknown"
    producer = app.state.producer

    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    if await student_exists(username):
        logger.info(f"👤 Returning cached student login for '{username}'.")
    else:
        event = {
            "event_id": str(uuid.uuid4()),
            "event_type": "student_login",
            "username": username,
            "ip_address": client_ip,
        }
        try:
            producer.produce(
                topic="student-logins",
                key=username.encode("utf-8"),
                value=json.dumps(event).encode("utf-8"),
                callback=kafka_callback,
            )
            producer.poll(0)
            await cache_student(username)
            logger.info(f" New student '{username}' cached and Kafka event published.")
        except Exception as e:
            logger.error(f" Kafka produce error: {e}")
            raise HTTPException(status_code=503, detail="Failed to publish login event")

    token = create_jwt_token({"sub": username, "role": "student"})
    return {
        "message": "Login successful",
        "username": username,
        "access_token": token,
        "token_type": "bearer",
    }

@app.post("/admin-login", status_code=status.HTTP_200_OK)
async def login_admin(admin_data: AdminLogin):
    password = admin_data.password
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    token = create_jwt_token({"sub": "admin", "role": "admin"})
    return {
        "message": "Admin login successful",
        "access_token": token,
        "token_type": "bearer",
    }
