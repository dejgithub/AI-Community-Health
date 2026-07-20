from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.database import Base, SessionLocal, engine
from app.routers import ai, community, emergency, family, health, medications, records


def _seed_data() -> None:
    from app.models.health import Hospital, Pharmacy

    db = SessionLocal()
    try:
        if db.query(Hospital).count() == 0:
            hospitals = [
                Hospital(name="Black Lion General Hospital", address="Arat Kilo, Addis Ababa, Ethiopia", phone="+251-11-123-4567", latitude=9.0369, longitude=38.7637, specialties=["Emergency", "Cardiology", "Surgery", "Pediatrics"], rating=4.5, is_open=True),
                Hospital(name="Tikur Anbessa Specialized Hospital", address="Sidist Kilo, Addis Ababa, Ethiopia", phone="+251-11-234-5678", latitude=9.0352, longitude=38.7630, specialties=["Oncology", "Neurology", "Orthopedics"], rating=4.3, is_open=True),
                Hospital(name="St. Paul's Hospital Millennium Medical College", address="Arat Kilo, Addis Ababa, Ethiopia", phone="+251-11-345-6789", latitude=9.0382, longitude=38.7614, specialties=["Internal Medicine", "Pediatrics", "Obstetrics"], rating=4.1, is_open=True),
                Hospital(name="Yekatit 12 Hospital", address="Piazza, Addis Ababa, Ethiopia", phone="+251-11-456-7890", latitude=9.0350, longitude=38.7470, specialties=["General Surgery", "Emergency", "Radiology"], rating=3.9, is_open=True),
                Hospital(name="Ras Mekonnen Hospital", address="Harar, Ethiopia", phone="+251-25-123-4567", latitude=9.3115, longitude=42.1198, specialties=["General Medicine", "Surgery", "Pediatrics"], rating=3.8, is_open=True),
                Hospital(name="Jimma University Specialized Hospital", address="Jimma, Ethiopia", phone="+251-47-123-4567", latitude=7.6789, longitude=36.8340, specialties=["Teaching Hospital", "Surgery", "Internal Medicine"], rating=4.0, is_open=True),
            ]
            db.add_all(hospitals)

        if db.query(Pharmacy).count() == 0:
            pharmacies = [
                Pharmacy(name="Ethiopian Pharmaceutical Supply Agency", address="Bole, Addis Ababa, Ethiopia", phone="+251-11-567-8901", latitude=9.0054, longitude=38.7636, rating=4.2, is_open=True),
                Pharmacy(name="Lifeline Pharmacy", address="Bole Road, Addis Ababa, Ethiopia", phone="+251-11-678-9012", latitude=9.0132, longitude=38.7784, rating=4.0, is_open=True),
                Pharmacy(name="MedPharm Ethiopia", address="Piassa, Addis Ababa, Ethiopia", phone="+251-11-789-0123", latitude=9.0340, longitude=38.7475, rating=3.9, is_open=True),
                Pharmacy(name="Curative Pharmacy", address="Merkato, Addis Ababa, Ethiopia", phone="+251-11-890-1234", latitude=9.0206, longitude=38.7468, rating=3.7, is_open=True),
                Pharmacy(name="Balo Pharmacy", address="Meskel Square, Addis Ababa, Ethiopia", phone="+251-11-901-2345", latitude=9.0349, longitude=38.7615, rating=4.1, is_open=True),
            ]
            db.add_all(pharmacies)

        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(bind=engine)
    _seed_data()
    yield


app = FastAPI(
    title="AI Community Health & Emergency Platform",
    description="Backend API for community health monitoring, emergency response, and AI-powered health assistance",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ai.router)
app.include_router(health.router)
app.include_router(emergency.router)
app.include_router(medications.router)
app.include_router(records.router)
app.include_router(community.router)
app.include_router(family.router)


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "healthy", "service": "AI Community Health Platform", "version": "1.0.0"}
