from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    role: Mapped[str] = mapped_column(String(20), default="patient")  # patient / doctor / admin
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    blood_group: Mapped[str | None] = mapped_column(String(10))
    date_of_birth: Mapped[str | None] = mapped_column(String(20))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    medical_profile: Mapped["MedicalProfile | None"] = relationship(back_populates="user", uselist=False)
    medications: Mapped[list["Medication"]] = relationship(back_populates="user")
    health_records: Mapped[list["HealthRecord"]] = relationship(back_populates="user")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="user", foreign_keys="Appointment.user_id")
    doctor_appointments: Mapped[list["Appointment"]] = relationship(back_populates="doctor", foreign_keys="Appointment.doctor_id")


class MedicalProfile(Base):
    __tablename__ = "medical_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    allergies: Mapped[dict | None] = mapped_column(JSON, default=list)
    medical_history: Mapped[dict | None] = mapped_column(JSON, default=list)
    insurance_details: Mapped[dict | None] = mapped_column(JSON, default=dict)
    emergency_contacts: Mapped[dict | None] = mapped_column(JSON, default=list)

    user: Mapped["User"] = relationship(back_populates="medical_profile")


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    dosage: Mapped[str] = mapped_column(String(100), nullable=False)
    frequency: Mapped[str] = mapped_column(String(100), nullable=False)
    times: Mapped[dict | None] = mapped_column(JSON, default=list)
    start_date: Mapped[str | None] = mapped_column(String(20))
    end_date: Mapped[str | None] = mapped_column(String(20))
    notes: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    user: Mapped["User"] = relationship(back_populates="medications")


class HealthRecord(Base):
    __tablename__ = "health_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)  # lab_result, diagnosis, prescription, etc.
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    date: Mapped[str | None] = mapped_column(String(20))
    attachments: Mapped[dict | None] = mapped_column(JSON, default=list)

    user: Mapped["User"] = relationship(back_populates="health_records")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    doctor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    date: Mapped[str] = mapped_column(String(20), nullable=False)
    time: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="scheduled")  # scheduled, completed, cancelled
    notes: Mapped[str | None] = mapped_column(Text)

    user: Mapped["User"] = relationship(back_populates="appointments", foreign_keys=[user_id])
    doctor: Mapped["User | None"] = relationship(back_populates="doctor_appointments", foreign_keys=[doctor_id])
