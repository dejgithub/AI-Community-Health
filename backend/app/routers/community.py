from datetime import date, timedelta

from fastapi import APIRouter

from app.schemas.health import CommunityStatsRead

router = APIRouter(prefix="/api/community", tags=["community"])


@router.get("/stats")
def community_stats() -> dict:
    return {
        "region": "Metro City",
        "date": date.today().isoformat(),
        "total_reports": 1247,
        "active_cases": 89,
        "recovered": 1120,
        "hospitals": 12,
        "pharmacies": 34,
        "vaccination_rate": 78.5,
        "health_score": 82,
        "disease_data": {
            "flu": 23,
            "dengue": 5,
            "malaria": 3,
            "covid": 12,
            "diabetes": 31,
            "hypertension": 15,
        },
        "vaccination_data": {
            "covid_full": 68,
            "covid_booster": 42,
            "flu_vaccine": 55,
            "childhood_complete": 89,
        },
        "emergency_data": {
            "total_emergencies": 34,
            "avg_response_time_min": 8.2,
            "resolved": 30,
        },
    }


@router.get("/trends")
def community_trends() -> dict:
    today = date.today()
    trends = []
    for i in range(30):
        d = today - timedelta(days=i)
        trends.append({
            "date": d.isoformat(),
            "new_cases": max(0, 15 - i + (i % 7)),
            "recoveries": max(0, 12 - i // 2),
            "active": max(0, 89 - i * 2 + (i % 5)),
        })
    trends.reverse()
    return {
        "region": "Metro City",
        "period": "30 days",
        "trends": trends,
        "insights": [
            "Case numbers have been declining over the past week",
            "Flu season is approaching - vaccination recommended",
            "Dengue cases are concentrated in the eastern district",
        ],
    }


@router.get("/alerts")
def community_alerts() -> dict:
    today = date.today().isoformat()
    return {
        "alerts": [
            {
                "id": 1,
                "type": "disease_outbreak",
                "severity": "medium",
                "title": "Seasonal Flu Advisory",
                "description": "Increased flu cases reported in the northern district. Residents are advised to get vaccinated and practice good hygiene.",
                "date": today,
                "region": "Northern District",
                "active": True,
            },
            {
                "id": 2,
                "type": "vaccination",
                "severity": "low",
                "title": "Free Vaccination Drive",
                "description": "Free COVID booster shots available at Metro Health Center this weekend. Walk-ins welcome.",
                "date": today,
                "region": "Metro City Center",
                "active": True,
            },
            {
                "id": 3,
                "type": "emergency",
                "severity": "high",
                "title": "Water Contamination Alert",
                "description": "Water contamination detected in eastern district. Do not drink tap water without boiling. Water tankers being deployed.",
                "date": today,
                "region": "Eastern District",
                "active": True,
            },
            {
                "id": 4,
                "type": "health_tip",
                "severity": "low",
                "title": "Heat Wave Precautions",
                "description": "Temperatures expected to exceed 40°C this week. Stay hydrated, avoid outdoor activities during peak hours, and check on elderly neighbors.",
                "date": today,
                "region": "All Regions",
                "active": True,
            },
        ]
    }
