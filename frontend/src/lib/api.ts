import { generateId } from "./utils";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  specialties: string[];
  rating: number;
  isOpen: boolean;
  distance: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  distance: number;
  medications: string[];
}

export interface DiseaseAnalysis {
  id: string;
  conditions: {
    name: string;
    probability: number;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
  }[];
  confidence: number;
  recommendations: string[];
  affectedRegions: string[];
  timestamp: string;
}

export interface HealthReport {
  id: string;
  summary: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  riskScore: number;
  recommendations: string[];
  followUpActions: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    bmi: number;
  };
  generatedAt: string;
}

export interface CommunityStats {
  diseaseHotspots: {
    name: string;
    lat: number;
    lng: number;
    severity: number;
    disease: string;
  }[];
  emergencyReports: {
    id: string;
    type: string;
    location: string;
    timestamp: string;
    resolved: boolean;
  }[];
  healthTrends: {
    disease: string;
    cases: number;
    trend: "increasing" | "decreasing" | "stable";
    change: number;
  }[];
  vaccinationStats: {
    name: string;
    coverage: number;
    target: number;
    population: string;
  }[];
  riskMaps: {
    region: string;
    riskLevel: number;
    factors: string[];
  }[];
}

export interface SOSResult {
  id: string;
  status: "sent" | "delivered" | "acknowledged";
  contactsNotified: string[];
  estimatedResponseTime: string;
  message: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export async function fetchNearbyHospitals(
  lat: number,
  lng: number,
  radius: number = 10
): Promise<Hospital[]> {
  await delay(800);

  const hospitalNames = [
    "St. Mary's General Hospital",
    "City Health Medical Center",
    "Community Health Hospital",
    "Regional Medical Center",
    "University Teaching Hospital",
    "Red Cross Hospital",
    "National Referral Hospital",
    "Sacred Heart Medical Center",
  ];

  const specialties = [
    ["Emergency", "Cardiology", "Orthopedics"],
    ["Pediatrics", "Surgery", "Internal Medicine"],
    ["Obstetrics", "Gynecology", "Neonatology"],
    ["Oncology", "Radiology", "Neurology"],
    ["Dermatology", "Ophthalmology", "ENT"],
  ];

  const count = Math.floor(randomBetween(2, 6));
  const hospitals: Hospital[] = [];

  for (let i = 0; i < count; i++) {
    hospitals.push({
      id: generateId(),
      name: hospitalNames[i % hospitalNames.length],
      address: `${Math.floor(randomBetween(1, 500))} Health Avenue, Medical District`,
      phone: `+1-555-${String(Math.floor(randomBetween(100, 999)))}-${String(Math.floor(randomBetween(1000, 9999)))}`,
      lat: lat + randomBetween(-0.05, 0.05),
      lng: lng + randomBetween(-0.05, 0.05),
      specialties: specialties[i % specialties.length],
      rating: Number(randomBetween(3.0, 5.0).toFixed(1)),
      isOpen: Math.random() > 0.2,
      distance: Number(randomBetween(0.3, radius).toFixed(1)),
    });
  }

  return hospitals.sort((a, b) => a.distance - b.distance);
}

export async function fetchNearbyPharmacies(
  lat: number,
  lng: number,
  radius: number = 10
): Promise<Pharmacy[]> {
  await delay(600);

  const pharmacyNames = [
    "HealthPlus Pharmacy",
    "MedStar Drugstore",
    "Community Pharmacy",
    "WellCare Pharmacy",
    "LifeLine Drugs",
    "Sunrise Pharmacy",
    "Family Health Pharmacy",
  ];

  const commonMeds = [
    ["Paracetamol", "Ibuprofen", "Amoxicillin", "Metformin"],
    ["Lisinopril", "Atorvastatin", "Omeprazole", "Amlodipine"],
    ["Cetirizine", "Salbutamol", "Azithromycin", "Ciprofloxacin"],
  ];

  const count = Math.floor(randomBetween(3, 7));
  const pharmacies: Pharmacy[] = [];

  for (let i = 0; i < count; i++) {
    pharmacies.push({
      id: generateId(),
      name: pharmacyNames[i % pharmacyNames.length],
      address: `${Math.floor(randomBetween(1, 300))} Pharmacy Lane, Health District`,
      phone: `+1-555-${String(Math.floor(randomBetween(100, 999)))}-${String(Math.floor(randomBetween(1000, 9999)))}`,
      lat: lat + randomBetween(-0.05, 0.05),
      lng: lng + randomBetween(-0.05, 0.05),
      isOpen: Math.random() > 0.15,
      distance: Number(randomBetween(0.1, radius).toFixed(1)),
      medications: commonMeds[i % commonMeds.length],
    });
  }

  return pharmacies.sort((a, b) => a.distance - b.distance);
}

export async function analyzeImage(
  _imageFile: File
): Promise<DiseaseAnalysis> {
  await delay(2000);

  return {
    id: generateId(),
    conditions: [
      {
        name: "Eczema (Atopic Dermatitis)",
        probability: 0.82,
        description:
          "A chronic skin condition characterized by itchy, inflamed skin. Common in areas exposed to allergens or irritants.",
        severity: "medium",
      },
      {
        name: "Contact Dermatitis",
        probability: 0.45,
        description:
          "An inflammatory skin condition caused by direct contact with an irritant or allergen.",
        severity: "low",
      },
      {
        name: "Psoriasis",
        probability: 0.21,
        description:
          "An autoimmune condition that causes rapid skin cell buildup, resulting in scaling on the skin surface.",
        severity: "medium",
      },
    ],
    confidence: 0.78,
    recommendations: [
      "Keep the affected area clean and moisturized",
      "Avoid known skin irritants and allergens",
      "Apply over-the-counter hydrocortisone cream for mild relief",
      "Consult a dermatologist if symptoms persist beyond 2 weeks",
      "Consider allergy testing to identify triggers",
    ],
    affectedRegions: ["East Africa", "West Africa", "South Asia"],
    timestamp: new Date().toISOString(),
  };
}

export async function chatWithAI(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  await delay(1200);

  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() ?? "";

  if (lastMessage.includes("headache") || lastMessage.includes("head pain")) {
    return "Based on your symptoms, headaches can have several causes including tension, dehydration, eye strain, or underlying conditions. I recommend: 1) Stay hydrated - drink at least 8 glasses of water daily, 2) Rest in a quiet, dark room, 3) Apply a cold compress to your forehead, 4) Consider over-the-counter pain relief like ibuprofen. If headaches are severe, persistent, or accompanied by vision changes, nausea, or stiff neck, please seek immediate medical attention. Would you like me to help you find a nearby clinic?";
  }

  if (lastMessage.includes("fever") || lastMessage.includes("temperature")) {
    return "Fever is typically your body's response to infection. For management: 1) Rest adequately, 2) Stay well-hydrated with water, clear broths, or electrolyte solutions, 3) Take acetaminophen or ibuprofen as directed for adults, 4) Use lukewarm compresses. Seek immediate care if fever exceeds 39.4°C (103°F), persists more than 3 days, or is accompanied by severe headache, rash, difficulty breathing, or confusion. Would you like emergency contact information?";
  }

  if (lastMessage.includes("cough") || lastMessage.includes("cold")) {
    return "For cough and cold symptoms: 1) Rest and stay hydrated, 2) Use honey and warm lemon water to soothe your throat, 3) Use a humidifier or steam inhalation, 4) Over-the-counter cough suppressants may help at night. See a doctor if coughing persists beyond 3 weeks, produces blood, or is accompanied by high fever or difficulty breathing.";
  }

  if (
    lastMessage.includes("stomach") ||
    lastMessage.includes("abdominal") ||
    lastMessage.includes("belly")
  ) {
    return "For abdominal discomfort: 1) Eat bland foods (rice, bananas, toast), 2) Avoid spicy, fatty, or acidic foods, 3) Stay hydrated with small frequent sips, 4) Consider antacids for mild symptoms. Seek urgent care if you experience severe pain, bloody stools, persistent vomiting, or fever above 38.5°C. I can help locate the nearest medical facility if needed.";
  }

  return "Thank you for sharing your symptoms. Based on what you've described, I recommend the following: 1) Monitor your symptoms and note any changes, 2) Stay hydrated and get adequate rest, 3) Maintain a balanced diet rich in fruits and vegetables, 4) If symptoms persist or worsen within 48-72 hours, please consult a healthcare professional. Remember, this AI assistant provides general health guidance only and should not replace professional medical diagnosis or treatment. Would you like me to help you find a nearby healthcare facility, or do you have any other questions about your symptoms?";
}

export async function generateHealthReport(
  _userData: Record<string, unknown>
): Promise<HealthReport> {
  await delay(1500);

  return {
    id: generateId(),
    summary:
      "Your overall health status is good with minor areas of improvement needed. Blood pressure is within normal range, but cholesterol levels should be monitored. Regular exercise and a balanced diet are recommended to maintain optimal health.",
    riskLevel: "moderate",
    riskScore: 42,
    recommendations: [
      "Maintain a balanced diet with at least 5 servings of fruits and vegetables daily",
      "Engage in moderate physical activity for at least 150 minutes per week",
      "Monitor blood pressure weekly and log readings",
      "Schedule a comprehensive blood panel in 3 months",
      "Limit sodium intake to less than 2300mg per day",
      "Ensure 7-8 hours of quality sleep each night",
    ],
    followUpActions: [
      "Schedule follow-up appointment with your primary care physician within 30 days",
      "Complete lipid panel blood test",
      "Begin a daily walking routine of 30 minutes",
      "Update vaccination records - flu shot due",
    ],
    vitals: {
      bloodPressure: "124/78",
      heartRate: 72,
      temperature: 36.6,
      weight: 74.5,
      bmi: 23.8,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function sendSOSAlert(
  userId: string,
  location: { lat: number; lng: number },
  contacts: { name: string; phone: string }[]
): Promise<SOSResult> {
  await delay(1000);

  return {
    id: generateId(),
    status: "sent",
    contactsNotified: contacts.map((c) => c.name),
    estimatedResponseTime: "8-12 minutes",
    message: `Emergency SOS alert has been sent on behalf of user ${userId}. Location coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}. ${contacts.length} emergency contact(s) have been notified. Local emergency services have been alerted.`,
  };
}

export async function fetchCommunityStats(): Promise<CommunityStats> {
  await delay(900);

  return {
    diseaseHotspots: [
      {
        name: "Downtown District",
        lat: -1.2921,
        lng: 36.8219,
        severity: 0.7,
        disease: "Malaria",
      },
      {
        name: "Riverside Area",
        lat: -1.2833,
        lng: 36.8167,
        severity: 0.4,
        disease: "Cholera",
      },
      {
        name: "Hillside Community",
        lat: -1.2975,
        lng: 36.8285,
        severity: 0.55,
        disease: "Typhoid",
      },
      {
        name: "Industrial Zone",
        lat: -1.3012,
        lng: 36.8145,
        severity: 0.85,
        disease: "Respiratory Infections",
      },
    ],
    emergencyReports: [
      {
        id: generateId(),
        type: "Road Accident",
        location: "Main Highway Junction",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: true,
      },
      {
        id: generateId(),
        type: "Food Poisoning",
        location: "Market District",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        resolved: false,
      },
      {
        id: generateId(),
        type: "Allergic Reaction",
        location: "School Zone",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        resolved: true,
      },
    ],
    healthTrends: [
      {
        disease: "Malaria",
        cases: 342,
        trend: "increasing",
        change: 12.5,
      },
      {
        disease: "Cholera",
        cases: 89,
        trend: "decreasing",
        change: -8.3,
      },
      {
        disease: "Typhoid",
        cases: 156,
        trend: "stable",
        change: 1.2,
      },
      {
        disease: "COVID-19",
        cases: 67,
        trend: "decreasing",
        change: -15.7,
      },
      {
        disease: "Measles",
        cases: 234,
        trend: "increasing",
        change: 22.1,
      },
    ],
    vaccinationStats: [
      {
        name: "COVID-19",
        coverage: 68,
        target: 80,
        population: "3.2M",
      },
      {
        name: "Measles (MCV1)",
        coverage: 82,
        target: 95,
        population: "1.8M",
      },
      {
        name: "Polio (OPV3)",
        coverage: 91,
        target: 95,
        population: "1.8M",
      },
      {
        name: "DPT3",
        coverage: 85,
        target: 90,
        population: "1.5M",
      },
    ],
    riskMaps: [
      {
        region: "Northern District",
        riskLevel: 0.3,
        factors: ["Good sanitation", "High healthcare access"],
      },
      {
        region: "Central District",
        riskLevel: 0.6,
        factors: ["Crowded housing", "Moderate water quality"],
      },
      {
        region: "Southern District",
        riskLevel: 0.8,
        factors: ["Poor sanitation", "Limited healthcare access", "Water contamination"],
      },
      {
        region: "Eastern District",
        riskLevel: 0.45,
        factors: ["Moderate sanitation", "Seasonal flooding"],
      },
    ],
  };
}
