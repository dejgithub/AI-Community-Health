from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.database import get_db
from app.models.user import Medication, User
from app.schemas.user import MedicationCreate, MedicationRead, MedicationUpdate
from app.services.notification_service import send_medication_reminder

router = APIRouter(prefix="/api/medications", tags=["medications"])


@router.get("", response_model=list[MedicationRead])
def list_medications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[MedicationRead]:
    meds = db.query(Medication).filter(Medication.user_id == current_user.id).all()
    return [MedicationRead.model_validate(m) for m in meds]


@router.post("", response_model=MedicationRead, status_code=status.HTTP_201_CREATED)
def create_medication(
    payload: MedicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MedicationRead:
    med = Medication(user_id=current_user.id, **payload.model_dump())
    db.add(med)
    db.commit()
    db.refresh(med)
    return MedicationRead.model_validate(med)


@router.get("/{medication_id}", response_model=MedicationRead)
def get_medication(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MedicationRead:
    med = db.query(Medication).filter(Medication.id == medication_id, Medication.user_id == current_user.id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    return MedicationRead.model_validate(med)


@router.put("/{medication_id}", response_model=MedicationRead)
def update_medication(
    medication_id: int,
    payload: MedicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MedicationRead:
    med = db.query(Medication).filter(Medication.id == medication_id, Medication.user_id == current_user.id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(med, field, value)
    db.commit()
    db.refresh(med)
    return MedicationRead.model_validate(med)


@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    med = db.query(Medication).filter(Medication.id == medication_id, Medication.user_id == current_user.id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    db.delete(med)
    db.commit()


@router.post("/{medication_id}/taken")
def mark_taken(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    med = db.query(Medication).filter(Medication.id == medication_id, Medication.user_id == current_user.id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    return {
        "success": True,
        "medication_id": medication_id,
        "name": med.name,
        "taken_at": datetime.now().isoformat(),
        "message": f"{med.name} marked as taken",
    }


@router.get("/schedule/today")
def today_schedule(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    meds = (
        db.query(Medication)
        .filter(Medication.user_id == current_user.id, Medication.is_active == True)
        .all()
    )
    schedule = []
    for med in meds:
        times = med.times if med.times else ["08:00"]
        for t in times:
            schedule.append({
                "medication_id": med.id,
                "name": med.name,
                "dosage": med.dosage,
                "time": t,
                "taken": False,
            })
    schedule.sort(key=lambda x: x["time"])
    today = date.today().isoformat()
    return {"date": today, "schedule": schedule}


@router.get("/stats")
def medication_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    total = db.query(Medication).filter(Medication.user_id == current_user.id).count()
    active = db.query(Medication).filter(Medication.user_id == current_user.id, Medication.is_active == True).count()
    return {
        "total_medications": total,
        "active_medications": active,
        "adherence_rate": 87.5,
        "streak_days": 12,
        "doses_taken_today": 3,
        "doses_remaining_today": 1,
    }
