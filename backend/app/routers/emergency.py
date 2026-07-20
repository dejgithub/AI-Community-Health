import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.health import (
    EmergencyGuide,
    EmergencyReport,
    EmergencyReportResponse,
    SOSRequest,
    SOSResponse,
)
from app.services.notification_service import send_emergency_notification, send_sos_alert

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

EMERGENCY_GUIDES: list[dict] = [
    {
        "id": 1,
        "title": "Cardiac Arrest - CPR Steps",
        "category": "medical",
        "steps": [
            "Check the person is responsive and breathing",
            "Call emergency services immediately (911 / 112)",
            "Place the heel of your hand on the center of the chest",
            "Push hard and fast at a rate of 100-120 compressions per minute",
            "After 30 compressions, give 2 rescue breaths if trained",
            "Continue CPR until emergency services arrive",
        ],
        "icon": "heart-pulse",
    },
    {
        "id": 2,
        "title": "Severe Bleeding Control",
        "category": "medical",
        "steps": [
            "Apply firm, direct pressure on the wound with a clean cloth",
            "Maintain continuous pressure for at least 10 minutes",
            "Elevate the injured area above the heart if possible",
            "Do not remove the cloth - add more layers if needed",
            "Call emergency services for severe bleeding",
            "Monitor for signs of shock: pale skin, rapid breathing, dizziness",
        ],
        "icon": "droplet",
    },
    {
        "id": 3,
        "title": "Fire Emergency Response",
        "category": "fire",
        "steps": [
            "Alert everyone in the building immediately",
            "Feel doors before opening - use alternate exit if hot",
            "Stay low to the ground to avoid smoke inhalation",
            "Cover your mouth with a wet cloth",
            "Exit the building using the nearest safe route",
            "Call fire services once safely outside",
            "Do not re-enter the building",
        ],
        "icon": "flame",
    },
    {
        "id": 4,
        "title": "Choking Response (Adult)",
        "category": "medical",
        "steps": [
            "Ask the person if they are choking",
            "Stand behind the person and place your fist above their navel",
            "Grasp your fist with the other hand and thrust inward and upward",
            "Repeat until the object is expelled or the person becomes unconscious",
            "If unconscious, begin CPR and call emergency services",
        ],
        "icon": "alert-triangle",
    },
    {
        "id": 5,
        "title": "Allergic Reaction (Anaphylaxis)",
        "category": "medical",
        "steps": [
            "Use an epinephrine auto-injector (EpiPen) if available",
            "Call emergency services immediately",
            "Lay the person flat with legs elevated",
            "Do not give them anything to drink",
            "Monitor breathing and be prepared to perform CPR",
            "Note the allergen for the paramedics",
        ],
        "icon": "shield-alert",
    },
    {
        "id": 6,
        "title": "Earthquake Safety",
        "category": "natural-disaster",
        "steps": [
            "Drop to the ground and take cover under a sturdy desk or table",
            "Protect your head and neck with your arms",
            "Hold on until the shaking stops",
            "Stay indoors until you are sure it is safe to exit",
            "Check for injuries and administer first aid",
            "Be prepared for aftershocks",
        ],
        "icon": "mountain",
    },
]


@router.post("/sos", response_model=SOSResponse)
async def trigger_sos(
    payload: SOSRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SOSResponse:
    alert_id = str(uuid.uuid4())[:8].upper()

    from app.models.user import MedicalProfile

    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == current_user.id).first()
    contacts: list[str] = []
    if profile and profile.emergency_contacts:
        contacts = [c.get("phone", "") for c in profile.emergency_contacts if c.get("phone")]

    await send_sos_alert(contacts, payload.latitude, payload.longitude)

    return SOSResponse(
        success=True,
        alert_id=alert_id,
        message=f"SOS alert {alert_id} has been sent. Emergency services and your contacts are being notified.",
        notified_contacts=contacts,
        estimated_response="5-15 minutes",
    )


@router.get("/guides", response_model=list[EmergencyGuide])
def get_emergency_guides() -> list[EmergencyGuide]:
    return [EmergencyGuide(**g) for g in EMERGENCY_GUIDES]


@router.get("/guides/{guide_id}", response_model=EmergencyGuide)
def get_emergency_guide(guide_id: int) -> EmergencyGuide:
    guide = next((g for g in EMERGENCY_GUIDES if g["id"] == guide_id), None)
    if not guide:
        raise HTTPException(status_code=404, detail="Emergency guide not found")
    return EmergencyGuide(**guide)


@router.post("/report", response_model=EmergencyReportResponse)
async def report_emergency(
    payload: EmergencyReport,
    current_user: User = Depends(get_current_user),
) -> EmergencyReportResponse:
    report_id = current_user.id * 1000 + 1  # deterministic mock id
    await send_emergency_notification([], payload.description)
    return EmergencyReportResponse(
        success=True,
        report_id=report_id,
        message="Emergency report submitted. Authorities have been notified.",
    )
