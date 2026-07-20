import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.health import Hospital, Pharmacy
from app.schemas.health import HospitalRead, PharmacyRead

router = APIRouter(prefix="/api", tags=["health-facilities"])


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# --- Hospitals ---

@router.get("/hospitals", response_model=list[HospitalRead])
def list_hospitals(
    lat: float | None = Query(None),
    lng: float | None = Query(None),
    radius: float = Query(50.0, description="Radius in km"),
    specialty: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[HospitalRead]:
    query = db.query(Hospital)
    if specialty:
        query = query.filter(Hospital.specialties.op("LIKE")(f"%{specialty}%"))
    hospitals = query.all()
    if lat is not None and lng is not None:
        hospitals = [h for h in hospitals if _haversine(lat, lng, h.latitude, h.longitude) <= radius]
    return [HospitalRead.model_validate(h) for h in hospitals]


@router.get("/hospitals/{hospital_id}", response_model=HospitalRead)
def get_hospital(hospital_id: int, db: Session = Depends(get_db)) -> HospitalRead:
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return HospitalRead.model_validate(hospital)


# --- Pharmacies ---

@router.get("/pharmacies", response_model=list[PharmacyRead])
def list_pharmacies(
    lat: float | None = Query(None),
    lng: float | None = Query(None),
    radius: float = Query(50.0, description="Radius in km"),
    db: Session = Depends(get_db),
) -> list[PharmacyRead]:
    query = db.query(Pharmacy)
    pharmacies = query.all()
    if lat is not None and lng is not None:
        pharmacies = [p for p in pharmacies if _haversine(lat, lng, p.latitude, p.longitude) <= radius]
    return [PharmacyRead.model_validate(p) for p in pharmacies]


@router.get("/pharmacies/{pharmacy_id}", response_model=PharmacyRead)
def get_pharmacy(pharmacy_id: int, db: Session = Depends(get_db)) -> PharmacyRead:
    pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    return PharmacyRead.model_validate(pharmacy)
