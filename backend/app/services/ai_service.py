from random import choice, uniform

from app.schemas.health import (
    AIChatResponse,
    AIImageAnalysisResponse,
    HealthReport,
    ImageAnalysisResult,
)


def chat_with_ai(messages: list[dict], context: str | None = None) -> AIChatResponse:
    if not messages:
        return AIChatResponse(response="How can I help you with your health today?", confidence=1.0)

    last_message = messages[-1]["content"].lower()

    responses: dict[str, tuple[str, list[str], float]] = {
        "headache": (
            "For headaches, try resting in a quiet, dark room. Stay hydrated and consider "
            "over-the-counter pain relievers like ibuprofen or acetaminophen. If headaches "
            "persist for more than a few days or are severe, please consult a doctor.",
            ["Rest in a quiet environment", "Stay hydrated", "Consider OTC pain relief", "See a doctor if persistent"],
            0.82,
        ),
        "fever": (
            "A fever is your body's way of fighting infection. Stay hydrated, rest, and "
            "monitor your temperature. If it exceeds 103°F (39.4°C) or lasts more than "
            "3 days, seek medical attention.",
            ["Drink plenty of fluids", "Rest adequately", "Monitor temperature", "Seek care if high or persistent"],
            0.85,
        ),
        "cold": (
            "For the common cold, rest, fluids, and time are your best remedies. Use "
            "honey and warm water for sore throats. Saline nasal drops can help with "
            "congestion. Symptoms usually resolve within 7-10 days.",
            ["Rest and sleep well", "Drink warm fluids", "Use saline nasal spray", "Honey for sore throat"],
            0.80,
        ),
        "diet": (
            "A balanced diet should include fruits, vegetables, whole grains, lean proteins, "
            "and healthy fats. Aim for at least 5 servings of fruits and vegetables daily. "
            "Limit processed foods, sugar, and sodium.",
            ["Eat 5+ fruits/vegetables daily", "Choose whole grains", "Limit processed foods", "Stay hydrated"],
            0.88,
        ),
        "exercise": (
            "The WHO recommends at least 150 minutes of moderate aerobic activity or 75 minutes "
            "of vigorous activity per week. Include strength training 2+ days per week. "
            "Start slow if you're new to exercise.",
            ["150 min/week moderate exercise", "Strength train 2+ days", "Warm up and cool down", "Listen to your body"],
            0.90,
        ),
        "sleep": (
            "Adults need 7-9 hours of quality sleep per night. Maintain a consistent schedule, "
            "avoid screens 1 hour before bed, keep your room cool and dark, and limit caffeine "
            "after 2 PM.",
            ["7-9 hours nightly", "Consistent sleep schedule", "No screens before bed", "Cool, dark room"],
            0.87,
        ),
    }

    for keyword, (response, suggestions, confidence) in responses.items():
        if keyword in last_message:
            return AIChatResponse(response=response, suggestions=suggestions, confidence=confidence)

    default_responses = [
        "I understand your concern. While I can provide general health information, it's important to consult with a healthcare professional for personalized advice. Is there a specific symptom you'd like to discuss?",
        "That's a great question about your health. Based on general guidelines, I'd recommend maintaining a balanced diet, regular exercise, and adequate sleep. For specific concerns, please consult your doctor.",
        "Thank you for asking. General health wellness includes proper nutrition, regular physical activity, stress management, and preventive care. Would you like me to elaborate on any of these areas?",
    ]
    return AIChatResponse(
        response=choice(default_responses),
        suggestions=["Consult a doctor for specific concerns", "Keep a health diary", "Stay updated on vaccinations"],
        confidence=0.70,
    )


def analyze_disease() -> AIImageAnalysisResponse:
    conditions = [
        ImageAnalysisResult(
            condition="Eczema (Atopic Dermatitis)",
            confidence=0.78,
            description="Chronic skin condition causing itchy, inflamed patches. Common in areas with skin folds.",
            recommendations=[
                "Moisturize skin regularly with fragrance-free lotion",
                "Avoid known triggers (harsh soaps, certain fabrics)",
                "Use prescribed topical corticosteroids during flare-ups",
                "Consult a dermatologist for persistent symptoms",
            ],
            severity="medium",
        ),
        ImageAnalysisResult(
            condition="Contact Dermatitis",
            confidence=0.65,
            description="Skin reaction from contact with an irritant or allergen. Typically appears as red, itchy rash.",
            recommendations=[
                "Identify and avoid the triggering substance",
                "Apply cool compresses to reduce itching",
                "Use over-the-counter hydrocortisone cream",
                "Seek medical attention if blisters develop",
            ],
            severity="low",
        ),
        ImageAnalysisResult(
            condition="Psoriasis",
            confidence=0.42,
            description="Autoimmune condition causing rapid skin cell buildup, resulting in scaling and inflammation.",
            recommendations=[
                "Keep skin moisturized",
                "Avoid skin injury and irritation",
                "Manage stress levels",
                "Consult a dermatologist for treatment options",
            ],
            severity="medium",
        ),
    ]
    selected = [conditions[0], conditions[2]]  # top 2 results
    return AIImageAnalysisResponse(results=selected)


def generate_health_report(user_data: dict | None = None, record_ids: list[int] | None = None) -> HealthReport:
    return HealthReport(
        summary=(
            "Based on your recent health data, you are in generally good health. "
            "Your BMI is within normal range and your latest vitals are stable. "
            "There are a few areas where lifestyle improvements could benefit your long-term health."
        ),
        risk_level="low",
        recommendations=[
            "Increase daily water intake to at least 2 liters",
            "Add 30 minutes of moderate cardio exercise 3 times per week",
            "Schedule a dental checkup - last visit was over 6 months ago",
            "Consider increasing fiber intake for better digestive health",
            "Keep up with your current medication schedule - adherence is good",
        ],
        vitals={
            "blood_pressure": "120/78 mmHg",
            "heart_rate": "72 bpm",
            "blood_sugar": "95 mg/dL",
            "bmi": 23.4,
            "temperature": "98.6°F",
        },
        generated_at="2026-01-15T10:30:00Z",
    )
