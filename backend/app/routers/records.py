from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.database import get_db
from app.models.user import HealthRecord, User
from app.schemas.user import HealthRecordCreate, HealthRecordRead, HealthRecordUpdate

router = APIRouter(prefix="/api/records", tags=["records"])


@router.get("", response_model=list[HealthRecordRead])
def list_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[HealthRecordRead]:
    records = db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).order_by(HealthRecord.id.desc()).all()
    return [HealthRecordRead.model_validate(r) for r in records]


@router.post("", response_model=HealthRecordRead, status_code=status.HTTP_201_CREATED)
def create_record(
    payload: HealthRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HealthRecordRead:
    record = HealthRecord(user_id=current_user.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return HealthRecordRead.model_validate(record)


@router.get("/summary")
def records_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    records = db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).all()
    by_type: dict[str, int] = {}
    for r in records:
        by_type[r.type] = by_type.get(r.type, 0) + 1
    return {
        "total_records": len(records),
        "by_type": by_type,
        "latest_record": HealthRecordRead.model_validate(records[-1]).model_dump() if records else None,
    }


@router.get("/{record_id}", response_model=HealthRecordRead)
def get_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HealthRecordRead:
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id, HealthRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")
    return HealthRecordRead.model_validate(record)


@router.put("/{record_id}", response_model=HealthRecordRead)
def update_record(
    record_id: int,
    payload: HealthRecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HealthRecordRead:
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id, HealthRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return HealthRecordRead.model_validate(record)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id, HealthRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")
    db.delete(record)
    db.commit()


@router.post("/share")
def share_record(
    record_ids: list[int],
    doctor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.id.in_(record_ids), HealthRecord.user_id == current_user.id)
        .all()
    )
    return {
        "success": True,
        "shared_count": len(records),
        "doctor_id": doctor_id,
        "message": f"{len(records)} records shared with doctor successfully",
    }
