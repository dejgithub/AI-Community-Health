import logging

logger = logging.getLogger(__name__)


async def send_sos_alert(contacts: list[str], latitude: float, longitude: float) -> bool:
    """Send SOS alert to emergency contacts. Mock implementation."""
    location_url = f"https://maps.google.com/?q={latitude},{longitude}"
    message = (
        f"EMERGENCY SOS ALERT!\n"
        f"Location: {location_url}\n"
        f"Please send help immediately!"
    )
    logger.info(f"[SOS ALERT] Sending to {len(contacts)} contacts: {message}")
    for contact in contacts:
        logger.info(f"[SOS ALERT] -> {contact}")
    return True


async def send_medication_reminder(user_name: str, medication_name: str, dosage: str) -> bool:
    """Send medication reminder to user. Mock implementation."""
    message = (
        f"Hi {user_name}, this is a reminder to take your medication:\n"
        f"Medication: {medication_name}\n"
        f"Dosage: {dosage}\n"
        f"Please take it as prescribed."
    )
    logger.info(f"[MED REMINDER] {message}")
    return True


async def send_emergency_notification(contacts: list[str], message: str) -> bool:
    """Send emergency notification to contacts and authorities. Mock implementation."""
    notification = f"EMERGENCY: {message}"
    logger.info(f"[EMERGENCY NOTIFY] {notification}")
    for contact in contacts:
        logger.info(f"[EMERGENCY NOTIFY] -> {contact}")
    return True
