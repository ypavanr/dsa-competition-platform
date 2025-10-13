from fastapi import FastAPI, HTTPException
from confluent_kafka import Consumer, KafkaException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
import threading, json, logging, time



KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
KAFKA_GROUP_ID = "login-service-group"
STUDENT_TOPIC = "student-logins"
POSTGRES_URL = "postgresql+psycopg2://postgres:5436@localhost:5432/dsa"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("LoginService")



engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Ensure table exists
with engine.begin() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            ip_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
logger.info(" PostgreSQL initialized and students table ensured.")



running = threading.Event()

def handle_student_event(event_data: dict):
    username = event_data.get("username")
    ip_address = event_data.get("ip_address")

    if not username:
        logger.warning("--WARNING-- Missing username in event. Skipping.")
        return

    db = SessionLocal()
    try:
        existing = db.execute(
            text("SELECT username FROM students WHERE username = :u"), {"u": username}
        ).scalar()

        if existing:
            db.execute(
                text("""
                    UPDATE students
                    SET ip_address = :ip, created_at = CURRENT_TIMESTAMP
                    WHERE username = :u
                """),
                {"ip": ip_address, "u": username},
            )
            logger.info(f" Updated existing student '{username}' with IP {ip_address}")
        else:
            db.execute(
                text("""
                    INSERT INTO students (username, ip_address)
                    VALUES (:u, :ip)
                """),
                {"u": username, "ip": ip_address},
            )
            logger.info(f" Inserted new student '{username}' with IP {ip_address}")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f" DB error while processing {username}: {e}")
    finally:
        db.close()

def kafka_consumer_loop(stop_event: threading.Event):
    consumer = Consumer({
        "bootstrap.servers": KAFKA_BOOTSTRAP_SERVERS,
        "group.id": KAFKA_GROUP_ID,
        "auto.offset.reset": "earliest",
        "enable.auto.commit": True,
    })

    consumer.subscribe([STUDENT_TOPIC])
    logger.info(f"--LISTENING-- Listening to Kafka topic: {STUDENT_TOPIC}")

    while not stop_event.is_set():
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().fatal():
                logger.error(f" Fatal Kafka error: {msg.error()}")
                break
            continue

        try:
            event = json.loads(msg.value().decode("utf-8"))
            handle_student_event(event)
        except Exception as e:
            logger.error(f" Error processing message: {e}")

    consumer.close()
    logger.info(" Kafka consumer stopped.")



@asynccontextmanager
async def lifespan(app: FastAPI):
    running.clear()
    thread = threading.Thread(target=kafka_consumer_loop, args=(running,), daemon=True)
    thread.start()
    logger.info("--STARTED-- Kafka consumer thread started.")

    yield  

    logger.info(" --SHUTDOWN-- Shutting down Kafka consumer...")
    running.set()
    thread.join(timeout=5)
    logger.info(" --SHUTDOWN-- Login microservice shutdown complete.")

app = FastAPI(lifespan=lifespan, title="Login Microservice")



@app.get("/health", status_code=200)
async def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    healthy = db_ok and not running.is_set()
    if not healthy:
        raise HTTPException(status_code=503, detail="Service not healthy")

    return {"status": "ok", "db": db_ok, "consumer": "running"}


