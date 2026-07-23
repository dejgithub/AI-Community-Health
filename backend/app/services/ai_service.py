import json
import base64
import time
from datetime import datetime

from google import genai
from google.api_core import exceptions as google_exceptions
from google.genai import types

from app.config import get_settings
from app.schemas.health import (
    AIChatResponse,
    AIImageAnalysisResponse,
    HealthReport,
    ImageAnalysisResult,
)

settings = get_settings()

client = None
if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

CHAT_MODEL = "gemini-2.0-flash"
VISION_MODEL = "gemini-2.0-flash"


def _retry(fn, *args, retries=3, backoff=2, **kwargs):
    for attempt in range(retries):
        try:
            return fn(*args, **kwargs)
        except (google_exceptions.ServiceUnavailable, google_exceptions.ResourceExhausted) as e:
            if attempt < retries - 1:
                time.sleep(backoff * (attempt + 1))
            else:
                raise

SYSTEM_INSTRUCTION = (
    "You are MediConnect AI, a helpful healthcare assistant. "
    "You provide general health information, symptom analysis, "
    "medication guidance, and wellness tips. "
    "IMPORTANT: You are NOT a doctor. Always remind users to "
    "consult healthcare professionals for diagnosis and treatment. "
    "For emergencies, tell them to call 911 immediately. "
    "Be concise, accurate, and compassionate. "
    "Respond in plain text with clear formatting."
)

VISION_SYSTEM_INSTRUCTION = (
    "You are a medical image analysis AI assistant. "
    "Analyze the provided medical/skin image and identify potential conditions. "
    "You MUST respond with valid JSON matching this exact schema:\n"
    '{"results": [{"condition": "string", "confidence": number (0-100), '
    '"description": "string", "recommendations": ["string"], '
    '"severity": "low|medium|high|critical"}], '
    '"disclaimer": "string"}\n'
    "Confidence should be a percentage (0-100). "
    "Severity must be one of: low, medium, high, critical. "
    "Include 3-4 specific recommendations per condition. "
    "Always include a medical disclaimer. "
    "If you cannot analyze the image, return results with low confidence "
    "and explain limitations."
)

REPORT_SYSTEM_INSTRUCTION = (
    "You are a medical AI that generates health reports. "
    "Respond ONLY with valid JSON matching this schema:\n"
    '{"summary": "string", "risk_level": "low|medium|high", '
    '"recommendations": ["string"], "vitals": {"key": "value"}, '
    '"generated_at": "ISO8601 string"}\n'
    "Be thorough but concise. Include actionable recommendations."
)


def chat_with_ai(messages: list[dict], context: str | None = None) -> AIChatResponse:
    if not messages:
        return AIChatResponse(response="How can I help you with your health today?", confidence=1.0)

    if not client:
        return AIChatResponse(
            response="I'm sorry, but the AI service is not configured. Please contact the administrator.",
            suggestions=["Try again later", "Contact support"],
            confidence=0.0,
        )

    try:
        system_context = ""
        if context:
            system_context = f"Additional context about the user: {context}\n\n"

        last_msg = messages[-1]["content"]
        prompt = f"{system_context}{last_msg}" if system_context else last_msg

        contents = []
        for msg in messages[:-1]:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])]))
        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=prompt)]))

        response = _retry(
            client.models.generate_content,
            model=CHAT_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
            ),
        )
        ai_text = response.text.strip()

        suggestions = []
        last_lower = last_msg.lower()
        if any(w in last_lower for w in ["headache", "head", "pain"]):
            suggestions = ["Rest in a dark room", "Stay hydrated", "Take OTC pain relief", "See a doctor if persistent"]
        elif any(w in last_lower for w in ["fever", "temperature", "hot"]):
            suggestions = ["Drink plenty of fluids", "Rest adequately", "Monitor temperature", "Seek care if high"]
        elif any(w in last_lower for w in ["cough", "cold", "flu"]):
            suggestions = ["Rest and sleep well", "Drink warm fluids", "Use saline nasal spray", "See a doctor if persistent"]
        elif any(w in last_lower for w in ["diet", "food", "eat", "nutrition"]):
            suggestions = ["Eat balanced meals", "Include fruits & vegetables", "Stay hydrated", "Limit processed foods"]
        elif any(w in last_lower for w in ["exercise", "workout", "fitness"]):
            suggestions = ["150 min/week moderate exercise", "Warm up and cool down", "Listen to your body", "Consult a trainer"]
        elif any(w in last_lower for w in ["sleep", "insomnia", "rest"]):
            suggestions = ["7-9 hours nightly", "Consistent sleep schedule", "No screens before bed", "Cool, dark room"]
        else:
            suggestions = ["Consult a doctor for specific concerns", "Keep a health diary", "Stay updated on vaccinations"]

        return AIChatResponse(response=ai_text, suggestions=suggestions, confidence=0.85)

    except Exception as e:
        return AIChatResponse(
            response=f"I encountered an error processing your request. Please try again later.",
            suggestions=["Try again later", "Contact support if issue persists"],
            confidence=0.0,
        )


def analyze_disease(image_base64: str | None = None, skin_category: str | None = None) -> AIImageAnalysisResponse:
    if not client:
        return AIImageAnalysisResponse(
            results=[
                ImageAnalysisResult(
                    condition="Service Unavailable",
                    confidence=0,
                    description="The AI analysis service is not configured. Please contact the administrator.",
                    recommendations=["Contact support"],
                    severity="low",
                )
            ],
            disclaimer="AI service is not configured.",
        )

    if not image_base64:
        return AIImageAnalysisResponse(
            results=[
                ImageAnalysisResult(
                    condition="No Image Provided",
                    confidence=0,
                    description="Please upload an image for analysis.",
                    recommendations=["Upload a clear image of the affected area"],
                    severity="low",
                )
            ],
        )

    try:
        image_bytes = base64.b64decode(image_base64)

        category_hint = ""
        if skin_category:
            category_hint = f" The user suspects this may be related to: {skin_category}."

        prompt = (
            f"Analyze this medical/skin image and identify potential conditions.{category_hint} "
            "Provide your analysis as JSON with the following structure: "
            '{"results": [{"condition": "...", "confidence": 85, "description": "...", '
            '"recommendations": ["..."], "severity": "low|medium|high|critical"}], '
            '"disclaimer": "..."}'
        )

        response = _retry(
            client.models.generate_content,
            model=VISION_MODEL,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                prompt,
            ],
            config=types.GenerateContentConfig(
                system_instruction=VISION_SYSTEM_INSTRUCTION,
            ),
        )

        raw_text = response.text.strip()

        json_start = raw_text.find("{")
        json_end = raw_text.rfind("}") + 1
        if json_start >= 0 and json_end > json_start:
            parsed = json.loads(raw_text[json_start:json_end])
            results = []
            for r in parsed.get("results", []):
                results.append(ImageAnalysisResult(
                    condition=r.get("condition", "Unknown"),
                    confidence=min(max(r.get("confidence", 0), 0), 100),
                    description=r.get("description", "No description available."),
                    recommendations=r.get("recommendations", ["Consult a healthcare professional"]),
                    severity=r.get("severity", "medium"),
                ))
            disclaimer = parsed.get(
                "disclaimer",
                "This is an AI-generated analysis and should not replace professional medical advice.",
            )
            return AIImageAnalysisResponse(results=results, disclaimer=disclaimer)

        return AIImageAnalysisResponse(
            results=[
                ImageAnalysisResult(
                    condition="Analysis Incomplete",
                    confidence=0,
                    description="The AI could not fully parse the image analysis. Please try with a clearer image.",
                    recommendations=["Upload a clearer image", "Consult a dermatologist"],
                    severity="low",
                )
            ],
        )

    except json.JSONDecodeError:
        return AIImageAnalysisResponse(
            results=[
                ImageAnalysisResult(
                    condition="Analysis Error",
                    confidence=0,
                    description="Could not parse the AI response. Please try again.",
                    recommendations=["Try again with a different image", "Consult a healthcare professional"],
                    severity="low",
                )
            ],
        )
    except Exception as e:
        return AIImageAnalysisResponse(
            results=[
                ImageAnalysisResult(
                    condition="Analysis Failed",
                    confidence=0,
                    description=f"An error occurred during analysis: {str(e)[:200]}",
                    recommendations=["Try again later", "Consult a healthcare professional"],
                    severity="low",
                )
            ],
        )


def generate_health_report(user_data: dict | None = None, record_ids: list[int] | None = None) -> HealthReport:
    if not client:
        return HealthReport(
            summary="The AI report generation service is not configured.",
            risk_level="unknown",
            recommendations=["Contact support"],
            vitals={},
            generated_at="",
        )

    try:
        user_info = ""
        if user_data:
            parts = []
            for k, v in user_data.items():
                if v:
                    parts.append(f"{k}: {v}")
            if parts:
                user_info = "User profile: " + ", ".join(parts) + ". "

        prompt = (
            f"{user_info}Generate a comprehensive health report with a summary, "
            "risk level assessment, personalized recommendations (5-7 items), "
            "and a vitals section with estimated values. "
            "Include the current timestamp as generated_at in ISO8601 format."
        )

        response = _retry(
            client.models.generate_content,
            model=CHAT_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=REPORT_SYSTEM_INSTRUCTION,
            ),
        )
        raw_text = response.text.strip()

        json_start = raw_text.find("{")
        json_end = raw_text.rfind("}") + 1
        if json_start >= 0 and json_end > json_start:
            parsed = json.loads(raw_text[json_start:json_end])
            return HealthReport(
                summary=parsed.get("summary", "Report generated successfully."),
                risk_level=parsed.get("risk_level", "low"),
                recommendations=parsed.get("recommendations", []),
                vitals=parsed.get("vitals", {}),
                generated_at=parsed.get("generated_at", datetime.utcnow().isoformat() + "Z"),
            )

        return HealthReport(
            summary=raw_text[:500] if raw_text else "Report generated but could not be parsed.",
            risk_level="low",
            recommendations=["Consult a healthcare professional for detailed analysis"],
            vitals={},
            generated_at=datetime.utcnow().isoformat() + "Z",
        )

    except Exception:
        return HealthReport(
            summary="An error occurred while generating the report. Please try again.",
            risk_level="unknown",
            recommendations=["Try again later", "Contact support"],
            vitals={},
            generated_at="",
        )
