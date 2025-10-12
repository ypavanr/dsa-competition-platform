from fastapi import FastAPI, Request, HTTPException, status
from pydantic import BaseModel
from confluent_kafka import Producer
from contextlib import asynccontextmanager
import json, uuid, socket, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    producer = Producer({
        "bootstrap.servers": "localhost:9092",
        "client.id": socket.gethostname(),
    })
    app.state.producer = producer
    logger.info(" Kafka producer initialized.")

    yield  
    logger.info(" Flushing Kafka producer before shutdown...")
    producer.flush()
    logger.info(" Kafka producer closed.")


app = FastAPI(lifespan=lifespan)

class StudentLogin(BaseModel):
    username: str


def kafka_delivery_report_callback(err,msg):
    if err is not None:
        print(f"--KAFKA ERROR-- Delivery failed for record {msg.key()}:{err}")
    else:
        print(f"--KAFKA SUCCESS-- Message delivered to {msg.topic()} [{msg.partition()}] @ offset {msg.offset()}")

STUDENT_DATA_SAVE_SERVICE_URL="http://user-data-service:8001/api/v1/log_user_session"

@app.post("/student-login", status_code=status.HTTP_200_OK)
async def login_student(user_data:StudentLogin, request:Request):
    client_ip = request.client.host if request.client else "unknown"
    producer = app.state.producer 
    event={
        "event_id":str(uuid.uuid4()),
        "event_type":"student_login",
        "username":user_data.username,
        "ip_address":client_ip,
         }
    try:
        producer.produce(
            topic="student-logins",
            key=user_data.username.encode("utf-8"),
            value=json.dumps(event).encode("utf-8"),
            callback=kafka_delivery_report_callback,
        )
        producer.poll(0)

        return {
            "message": "Login successful — event published to Kafka.",
            "username": user_data.username,
            "logged_ip": client_ip,
        }
    
    except Exception as e:
        print(f"--/student-login ROUTE ERROR-- {e}")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to publish login event to Kafka."
        )
    



