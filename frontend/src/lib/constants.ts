export const APP_NAME = "MediConnect AI";

export const COLORS = {
  primary: "#0077B6",
  primaryLight: "#00B4D8",
  primaryDark: "#023E8A",
  emergency: "#E63946",
  emergencyLight: "#FF6B6B",
  success: "#2D6A4F",
  successLight: "#52B788",
  warning: "#F4A261",
  warningLight: "#FFD166",
  info: "#457B9D",
  infoLight: "#A8DADC",
} as const;

export const NAV_ITEMS = [
  {
    title: "Home",
    href: "/",
    icon: "Home",
    description: "Dashboard overview and quick actions",
  },
  {
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: "Bot",
    description: "Chat with AI health assistant",
  },
  {
    title: "Disease Detection",
    href: "/disease-detection",
    icon: "ScanSearch",
    description: "Upload images for disease analysis",
  },
  {
    title: "Emergency",
    href: "/emergency",
    icon: "Siren",
    description: "Emergency services and SOS alerts",
  },
  {
    title: "Find Facilities",
    href: "/finder",
    icon: "MapPin",
    description: "Find nearby hospitals and pharmacies",
  },
  {
    title: "Medications",
    href: "/medications",
    icon: "Pill",
    description: "Track and manage medications",
  },
  {
    title: "Health Records",
    href: "/health-records",
    icon: "FileHeart",
    description: "View and manage health records",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "ClipboardList",
    description: "Generate health reports",
  },
  {
    title: "Family",
    href: "/family",
    icon: "Users",
    description: "Manage family health profiles",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
    description: "Health analytics and trends",
  },
  {
    title: "Community",
    href: "/community",
    icon: "Globe",
    description: "Community health dashboard",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
    description: "App settings and preferences",
  },
] as const;

export interface EmergencyGuide {
  id: string;
  title: string;
  steps: string[];
  icon: string;
  color: string;
}

export const EMERGENCY_GUIDES: EmergencyGuide[] = [
  {
    id: "cpr",
    title: "CPR (Cardiopulmonary Resuscitation)",
    steps: [
      "Check the scene for safety and check if the person is responsive",
      "Call emergency services (911) immediately or ask someone to call",
      "Place the heel of one hand on the center of the chest (between the nipples)",
      "Place your other hand on top and interlace your fingers",
      "Keep arms straight and push hard and fast at least 2 inches deep",
      "Allow full chest recoil between compressions at a rate of 100-120 per minute",
      "If trained, give 30 compressions then 2 rescue breaths (tilt head, lift chin)",
      "Continue CPR until emergency services arrive or the person starts breathing",
      "If an AED is available, use it as soon as possible following voice prompts",
    ],
    icon: "HeartPulse",
    color: COLORS.emergency,
  },
  {
    id: "choking",
    title: "Choking Response",
    steps: [
      "Ask 'Are you choking?' - if the person cannot speak, cough, or breathe, act immediately",
      "Stand behind the person and slightly to one side",
      "Make a fist with one hand and place it just above the navel",
      "Grasp your fist with the other hand and give quick upward thrusts",
      "Continue thrusts until the object is expelled or the person becomes unconscious",
      "If the person becomes unconscious, lower them to the ground and call emergency services",
      "Begin CPR if trained, checking the mouth for the object before giving breaths",
      "For infants, use 5 back blows followed by 5 chest thrusts with 2 fingers",
    ],
    icon: "AlertTriangle",
    color: "#FF6B6B",
  },
  {
    id: "bleeding",
    title: "Severe Bleeding Control",
    steps: [
      "Apply direct pressure to the wound using a clean cloth or gauze",
      "Press firmly and maintain continuous pressure for at least 10 minutes",
      "Do not remove the cloth if it soaks through - add more layers on top",
      "Elevate the injured area above the heart level if possible",
      "Apply a tourniquet 2-3 inches above the wound ONLY for life-threatening limb bleeding",
      "Note the time the tourniquet was applied and tell emergency responders",
      "Keep the victim warm and calm to prevent shock",
      "Monitor for signs of shock: pale skin, rapid breathing, confusion",
    ],
    icon: "Droplets",
    color: COLORS.emergency,
  },
  {
    id: "burns",
    title: "Burn Treatment",
    steps: [
      "Remove the person from the heat source immediately",
      "Cool the burn under cool (not cold) running water for 10-20 minutes",
      "Remove jewelry, watches, and tight clothing near the burned area",
      "Do NOT apply ice, butter, toothpaste, or other home remedies",
      "Cover the burn loosely with a sterile, non-stick dressing",
      "Take over-the-counter pain relief if needed (ibuprofen or acetaminophen)",
      "For chemical burns, flush with large amounts of water for 20+ minutes",
      "Seek emergency care for burns larger than 3 inches, on face/hands/joints, or deep burns",
    ],
    icon: "Flame",
    color: COLORS.warning,
  },
  {
    id: "poison",
    title: "Poisoning Response",
    steps: [
      "Call Poison Control Center or emergency services immediately",
      "Try to identify the substance that was ingested, inhaled, or contacted",
      "Do NOT induce vomiting unless specifically instructed by medical professionals",
      "If the person is unconscious but breathing, place them in the recovery position",
      "If the person has seized, do not restrain them - clear the area around them",
      "Save any containers, packages, or samples of the suspected substance",
      "If poison is on the skin, remove contaminated clothing and rinse skin with water",
      "If poison is in the eyes, flush with clean water for at least 15 minutes",
    ],
    icon: "Skull",
    color: "#8B5CF6",
  },
  {
    id: "snakebite",
    title: "Snake Bite First Aid",
    steps: [
      "Move away from the snake to prevent additional bites",
      "Keep the bitten person calm and still to slow venom spread",
      "Remove rings, watches, and tight clothing near the bite",
      "Keep the bitten limb at or below heart level",
      "Clean the wound gently with soap and water if available",
      "Cover with a clean, dry dressing",
      "Do NOT cut the wound, suck out venom, or apply a tourniquet",
      "Mark the edge of swelling with a pen and note the time",
      "Get to a hospital immediately - antivenom is the only effective treatment",
    ],
    icon: "Bug",
    color: COLORS.success,
  },
  {
    id: "fracture",
    title: "Fracture Care",
    steps: [
      "Do not move the injured person if a spinal injury is suspected",
      "Call emergency services for suspected fractures of the spine, pelvis, or femur",
      "Immobilize the injured area - splint it in the position found",
      "Apply ice wrapped in cloth to reduce swelling (20 minutes on, 20 off)",
      "Check circulation below the fracture: pulse, sensation, movement",
      "If bleeding, apply gentle pressure with a clean dressing",
      "Do NOT attempt to push bones back in or straighten the limb",
      "Treat for shock: lay flat, elevate legs (unless broken leg), keep warm",
    ],
    icon: "Bone",
    color: "#F97316",
  },
  {
    id: "heartAttack",
    title: "Heart Attack Response",
    steps: [
      "Call emergency services immediately - every minute counts",
      "Have the person sit or lie down in a comfortable position",
      "Give aspirin (325mg or 4 regular tablets) if not allergic - have them chew it",
      "Loosen any tight clothing around the neck and waist",
      "If the person becomes unconscious and stops breathing, begin CPR immediately",
      "Use an AED if available - follow the device voice prompts",
      "Keep the person calm and reassure them that help is on the way",
      "Note the time symptoms started - this information is critical for treatment",
      "Do NOT drive the person to the hospital yourself - wait for the ambulance",
    ],
    icon: "HeartCrack",
    color: COLORS.emergency,
  },
];

export const DISEASE_CATEGORIES = [
  {
    id: "communicable",
    name: "Communicable Diseases",
    description: "Infectious diseases that spread from person to person",
    icon: "Virus",
    examples: ["Malaria", "Tuberculosis", "HIV/AIDS", "COVID-19", "Cholera"],
  },
  {
    id: "non-communicable",
    name: "Non-Communicable Diseases",
    description: "Chronic conditions not transmitted between people",
    icon: "HeartPulse",
    examples: ["Diabetes", "Hypertension", "Cancer", "Asthma", "Arthritis"],
  },
  {
    id: "vector-borne",
    name: "Vector-Borne Diseases",
    description: "Diseases transmitted by insects and other vectors",
    icon: "Bug",
    examples: ["Malaria", "Dengue", "Yellow Fever", "Zika", "Chikungunya"],
  },
  {
    id: "waterborne",
    name: "Waterborne Diseases",
    description: "Diseases caused by contaminated water",
    icon: "Droplets",
    examples: ["Cholera", "Typhoid", "Dysentery", "Hepatitis A", "Giardiasis"],
  },
  {
    id: "respiratory",
    name: "Respiratory Conditions",
    description: "Diseases affecting the respiratory system",
    icon: "Wind",
    examples: ["Asthma", "COPD", "Pneumonia", "Bronchitis", "Tuberculosis"],
  },
  {
    id: "nutritional",
    name: "Nutritional Disorders",
    description: "Conditions caused by improper nutrition",
    icon: "Apple",
    examples: ["Malnutrition", "Obesity", "Scurvy", "Rickets", "Anemia"],
  },
] as const;

export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "or", name: "Afaan Oromo", nativeName: "Afaan Oromoo" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
] as const;

export const MEDICATION_FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "Once weekly",
  "As needed",
  "Before meals",
  "After meals",
  "At bedtime",
] as const;
