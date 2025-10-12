from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = "students"
    student_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    ip_address = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    submissions = relationship("Submission", back_populates="student")
    stats = relationship("StudentStats", uselist=False, back_populates="student")

class Problem(Base):
    __tablename__ = "problems"
    problem_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    difficulty = Column(String)
    max_score = Column(Integer, default=100)

class Submission(Base):
    __tablename__ = "submissions"
    submission_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    problem_id = Column(Integer, ForeignKey("problems.problem_id"))
    status = Column(String, CheckConstraint("status IN ('Accepted','Wrong Answer','TLE','Runtime Error')"))
    submitted_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    points_awarded = Column(Integer, default=0)

    student = relationship("Student", back_populates="submissions")

class StudentStats(Base):
    __tablename__ = "student_stats"
    student_id = Column(Integer, ForeignKey("students.student_id"), primary_key=True)
    total_solved = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    student = relationship("Student", back_populates="stats")
