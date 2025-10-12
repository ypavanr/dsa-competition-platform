from database import Base, engine
from models import Student, Problem, Submission, StudentStats

print(" Initializing database...")

try:
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully in PostgreSQL")
except Exception as e:
    print(f"Database initialization failed:\n{e}")
