from fastapi import APIRouter

from app.schemas.health import (
    AIChatRequest,
    AIChatResponse,
    AIImageAnalysisResponse,
    HealthReportRequest,
    HealthReportResponse,
)
from app.services.ai_service import analyze_disease, chat_with_ai, generate_health_report

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(payload: AIChatRequest) -> AIChatResponse:
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]
    return chat_with_ai(messages, context=payload.context)


@router.post("/analyze-image", response_model=AIImageAnalysisResponse)
async def ai_analyze_image() -> AIImageAnalysisResponse:
    """Image-based disease detection (mock). In production, the client would upload an image."""
    return analyze_disease()


@router.post("/generate-report", response_model=HealthReportResponse)
async def ai_generate_report(payload: HealthReportRequest) -> HealthReportResponse:
    report = generate_health_report(payload.user_data, payload.record_ids)
    return HealthReportResponse(report=report)


@router.get("/suggestions")
async def health_suggestions() -> dict:
    suggestions = [
        "Stay hydrated - drink at least 8 glasses of water daily",
        "Get 7-9 hours of sleep each night for optimal recovery",
        "Take a 30-minute walk to boost your immune system",
        "Include more fruits and vegetables in your diet",
        "Practice deep breathing exercises for stress relief",
        "Schedule your annual health checkup if overdue",
        "Keep your emergency contacts updated in your profile",
        "Review and organize your health records regularly",
    ]
    return {"suggestions": suggestions}
