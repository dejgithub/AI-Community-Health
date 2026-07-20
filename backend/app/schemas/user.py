from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: str
    name: str
    phone: str | None = None
    role: str = "patient"
    password: str
    blood_group: str | None = None
    date_of_birth: str | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    blood_group: str | None = None
    date_of_birth: str | None = None
    avatar_url: str | None = None


class UserRead(BaseModel):
    id: int
    email: str
    name: str
    phone: str | None = None
    role: str
    blood_group: str | None = None
    date_of_birth: str | None = None
    avatar_url: str | None = None
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


# --- Medical Profile ---

class MedicalProfileCreate(BaseModel):
    allergies: list[str] = []
    medical_history: list[dict] = []
    insurance_details: dict = {}
    emergency_contacts: list[dict] = []


class MedicalProfileUpdate(BaseModel):
    allergies: list[str] | None = None
    medical_history: list[dict] | None = None
    insurance_details: dict | None = None
    emergency_contacts: list[dict] | None = None


class MedicalProfileRead(BaseModel):
    id: int
    user_id: int
    allergies: list | None = []
    medical_history: list | None = []
    insurance_details: dict | None = {}
    emergency_contacts: list | None = []

    model_config = {"from_attributes": True}


# --- Medication ---

class MedicationCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    times: list[str] = []
    start_date: str | None = None
    end_date: str | None = None
    notes: str | None = None


class MedicationUpdate(BaseModel):
    name: str | None = None
    dosage: str | None = None
    frequency: str | None = None
    times: list[str] | None = None
    start_date: str | None = None
    end_date: str | None = None
    notes: str | None = None
    is_active: bool | None = None


class MedicationRead(BaseModel):
    id: int
    user_id: int
    name: str
    dosage: str
    frequency: str
    times: list | None = []
    start_date: str | None = None
    end_date: str | None = None
    notes: str | None = None
    is_active: bool

    model_config = {"from_attributes": True}


# --- Health Record ---

class HealthRecordCreate(BaseModel):
    type: str
    title: str
    content: str | None = None
    date: str | None = None
    attachments: list[dict] = []


class HealthRecordUpdate(BaseModel):
    type: str | None = None
    title: str | None = None
    content: str | None = None
    date: str | None = None
    attachments: list[dict] | None = None


class HealthRecordRead(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    content: str | None = None
    date: str | None = None
    attachments: list | None = []

    model_config = {"from_attributes": True}


# --- Appointment ---

class AppointmentCreate(BaseModel):
    doctor_id: int | None = None
    date: str
    time: str
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    doctor_id: int | None = None
    date: str | None = None
    time: str | None = None
    status: str | None = None
    notes: str | None = None


class AppointmentRead(BaseModel):
    id: int
    user_id: int
    doctor_id: int | None = None
    date: str
    time: str
    status: str
    notes: str | None = None

    model_config = {"from_attributes": True}
