from datetime import datetime

from pydantic import BaseModel


class HospitalCreate(BaseModel):
    name: str
    address: str
    phone: str | None = None
    latitude: float
    longitude: float
    specialties: list[str] = []
    rating: float = 0.0
    is_open: bool = True
    opening_hours: dict = {}


class HospitalRead(BaseModel):
    id: int
    name: str
    address: str
    phone: str | None = None
    latitude: float
    longitude: float
    specialties: list | None = []
    rating: float
    is_open: bool
    opening_hours: dict | None = {}

    model_config = {"from_attributes": True}


class PharmacyCreate(BaseModel):
    name: str
    address: str
    phone: str | None = None
    latitude: float
    longitude: float
    rating: float = 0.0
    is_open: bool = True
    opening_hours: dict = {}


class PharmacyRead(BaseModel):
    id: int
    name: str
    address: str
    phone: str | None = None
    latitude: float
    longitude: float
    rating: float
    is_open: bool
    opening_hours: dict | None = {}

    model_config = {"from_attributes": True}


class DiseaseReportCreate(BaseModel):
    condition_name: str
    confidence: float = 0.0
    image_url: str | None = None
    analysis_result: dict = {}


class DiseaseReportRead(BaseModel):
    id: int
    user_id: int
    condition_name: str
    confidence: float
    image_url: str | None = None
    analysis_result: dict | None = {}
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class CommunityStatsRead(BaseModel):
    id: int
    region: str
    date: str
    disease_data: dict | None = {}
    vaccination_data: dict | None = {}
    emergency_data: dict | None = {}

    model_config = {"from_attributes": True}


# --- AI ---

class AIChatMessage(BaseModel):
    role: str  # user / assistant
    content: str


class AIChatRequest(BaseModel):
    messages: list[AIChatMessage]
    context: str | None = None


class AIChatResponse(BaseModel):
    response: str
    suggestions: list[str] = []
    confidence: float = 0.85


class ImageAnalysisResult(BaseModel):
    condition: str
    confidence: float
    description: str
    recommendations: list[str]
    severity: str  # low, medium, high, critical


class AIImageAnalysisResponse(BaseModel):
    results: list[ImageAnalysisResult]
    disclaimer: str = "This is an AI-generated analysis and should not replace professional medical advice."


class HealthReport(BaseModel):
    summary: str
    risk_level: str
    recommendations: list[str]
    vitals: dict = {}
    generated_at: str


class HealthReportRequest(BaseModel):
    user_data: dict
    record_ids: list[int] = []


class HealthReportResponse(BaseModel):
    report: HealthReport


# --- Emergency ---

class SOSRequest(BaseModel):
    latitude: float
    longitude: float
    message: str | None = None
    emergency_type: str = "general"  # medical, fire, police, general


class SOSResponse(BaseModel):
    success: bool
    alert_id: str
    message: str
    notified_contacts: list[str] = []
    estimated_response: str | None = None


class EmergencyReport(BaseModel):
    emergency_type: str
    description: str
    latitude: float
    longitude: float
    severity: str = "medium"  # low, medium, high, critical


class EmergencyReportResponse(BaseModel):
    success: bool
    report_id: int
    message: str


class EmergencyGuide(BaseModel):
    id: int
    title: str
    category: str
    steps: list[str]
    icon: str = "info"
