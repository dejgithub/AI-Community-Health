export type TranslationKey =
  | "nav.home"
  | "nav.aiAssistant"
  | "nav.diseaseDetection"
  | "nav.emergency"
  | "nav.finder"
  | "nav.medications"
  | "nav.healthRecords"
  | "nav.reports"
  | "nav.family"
  | "nav.analytics"
  | "nav.community"
  | "nav.settings"
  | "common.search"
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.edit"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.back"
  | "common.next"
  | "common.confirm"
  | "common.close"
  | "common.viewAll"
  | "medical.disclaimer"
  | "medical.symptoms"
  | "medical.diagnosis"
  | "medical.treatment"
  | "medical.prevention"
  | "medical.bloodPressure"
  | "medical.heartRate"
  | "medical.temperature"
  | "medical.weight"
  | "emergency.title"
  | "emergency.call"
  | "emergency.sos"
  | "emergency.cpr"
  | "emergency.choking"
  | "emergency.bleeding"
  | "emergency.burns"
  | "emergency.poison"
  | "emergency.snakeBite"
  | "emergency.fracture"
  | "emergency.heartAttack"
  | "lang.en"
  | "lang.or"
  | "lang.am"
  | "lang.sw";

type TranslationDictionary = Record<TranslationKey, string>;

export const translations: Record<string, TranslationDictionary> = {
  en: {
    "nav.home": "Home",
    "nav.aiAssistant": "AI Assistant",
    "nav.diseaseDetection": "Disease Detection",
    "nav.emergency": "Emergency",
    "nav.finder": "Find Facilities",
    "nav.medications": "Medications",
    "nav.healthRecords": "Health Records",
    "nav.reports": "Reports",
    "nav.family": "Family",
    "nav.analytics": "Analytics",
    "nav.community": "Community",
    "nav.settings": "Settings",
    "common.search": "Search",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.back": "Back",
    "common.next": "Next",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.viewAll": "View All",
    "medical.disclaimer": "This information is for educational purposes only and should not replace professional medical advice.",
    "medical.symptoms": "Symptoms",
    "medical.diagnosis": "Diagnosis",
    "medical.treatment": "Treatment",
    "medical.prevention": "Prevention",
    "medical.bloodPressure": "Blood Pressure",
    "medical.heartRate": "Heart Rate",
    "medical.temperature": "Temperature",
    "medical.weight": "Weight",
    "emergency.title": "Emergency Services",
    "emergency.call": "Call Emergency",
    "emergency.sos": "SOS Alert",
    "emergency.cpr": "CPR Instructions",
    "emergency.choking": "Choking Response",
    "emergency.bleeding": "Severe Bleeding",
    "emergency.burns": "Burn Treatment",
    "emergency.poison": "Poison Response",
    "emergency.snakeBite": "Snake Bite",
    "emergency.fracture": "Fracture Care",
    "emergency.heartAttack": "Heart Attack Response",
    "lang.en": "English",
    "lang.or": "Afaan Oromoo",
    "lang.am": "Amharic",
    "lang.sw": "Swahili",
  },
  or: {
    "nav.home": "Keessaa",
    "nav.aiAssistant": "Kaa'imsa AI",
    "nav.diseaseDetection": "Argannoo Cimaa",
    "nav.emergency": "Hojjatamaa",
    "nav.finder": "Tajaajila Eegduu",
    "nav.medications": "Qorannoo",
    "nav.healthRecords": "Galmee Fogaphyyaa",
    "nav.reports": "Gabaasa",
    "nav.family": "Maatii",
    "nav.analytics": "Xiinxala",
    "nav.community": "Maddaala",
    "nav.settings": "Qindaa'ina",
    "common.search": "Barbaadi",
    "common.save": "Olkaa'i",
    "common.cancel": "Haqi",
    "common.delete": "Meeshaalee",
    "common.edit": "Fooyyee'i",
    "common.loading": "Eegaa...",
    "common.error": "Dogongora ta'e",
    "common.success": "Milkaa'ina",
    "common.back": "Duubatti",
    "common.next": "Itti Aanu",
    "common.confirm": "Mirkaneessi",
    "common.close": "Cufi",
    "common.viewAll": "Hunda Ilaali",
    "medical.disclaimer": "Odeeffannoon kun bishaanuma barumsaa fi hawaan korniyaa adda baasuu hin qabu.",
    "medical.symptoms": "Cal'aamiiwwan",
    "medical.diagnosis": "Qixa Guyyuu",
    "medical.treatment": "Tilaama",
    "medical.prevention": "Illiilluu",
    "medical.bloodPressure": "Dhuphii Dima",
    "medical.heartRate": "Lafa Qalbii",
    "medical.temperature": "Ho'aa",
    "medical.weight": "Ulfaa",
    "emergency.title": "Tajaajila Hundummataa",
    "emergency.call": "Hojjatamaa Waci",
    "emergency.sos": "Vabaa'i SOS",
    "emergency.cpr": "Barreeffama CPR",
    "emergency.choking": "Bishaanuu Guyyuu",
    "emergency.bleeding": "Bakka Dima",
    "emergency.burns": "Tilaama Jabeenya",
    "emergency.poison": "Dhukkumsa",
    "emergency.snakeBite": "Cunqarsii Masaa",
    "emergency.fracture": "Biyyoo Haquu",
    "emergency.heartAttack": "Hojjatamaa Qalbii",
    "lang.en": "English",
    "lang.or": "Afaan Oromoo",
    "lang.am": "Amharic",
    "lang.sw": "Swahili",
  },
  am: {
    "nav.home": "\u1260\u1348\u1273",
    "nav.aiAssistant": "\u1265\u1228 AI \u1280\u1233\u1218",
    "nav.diseaseDetection": "\u1260\u1263\u1273\u1271\u1218 \u1260\u127D\u127A\u1263\u1265\u1265\u1295",
    "nav.emergency": "\u130A\u1263\u1293 \u1263\u1208\u1236",
    "nav.finder": "\u1260\u1270\u1263\u1265\u1276\u1260\u1295 \u1260\u1263\u127D",
    "nav.medications": "\u1260\u1263\u1273\u1275\u1263\u127F\u1263\u12CD",
    "nav.healthRecords": "\u1265\u1203\u1263\u1276\u1260 \u1260\u1265\u12AB\u1293\u1273\u1263\u12CD",
    "nav.reports": "\u1280\u1273\u1260\u1260\u1263",
    "nav.family": "\u1260\u1265\u1271\u1295\u127D\u1271",
    "nav.analytics": "\u1271\u1223\u12AB\u1260\u1276\u1271\u1295",
    "nav.community": "\u1260\u1260\u1273\u1295\u1265\u1260\u1273\u1295",
    "nav.settings": "\u1260\u1273\u1349\u1260\u1263\u1295\u1263\u1273\u1263\u12CD",
    "common.search": "\u1280\u127D\u1273\u1263",
    "common.save": "\u130A\u1273\u130D\u1263\u1271",
    "common.cancel": "\u12B5\u1293\u126B",
    "common.delete": "\u1260\u1273\u127D\u1260\u1276\u1265",
    "common.edit": "\u1300\u1265\u1275\u1265\u1276\u1265\u1265",
    "common.loading": "\u1265\u12AD\u1260... ",
    "common.error": "\u126D\u1273\u1271\u127E \u1271\u1260\u1248\u1233\u1203",
    "common.success": "\u1271\u1263\u134A\u1263\u1203",
    "common.back": "\u1261\u127D\u1270\u1260\u1271",
    "common.next": "\u12B3\u1271\u1293",
    "common.confirm": "\u1260\u1263\u1293\u1273\u1278\u1265\u1265",
    "common.close": "\u1274\u1289",
    "common.viewAll": "\u1265\u1265\u1260\u1260\u1348\u1295\u1273 \u1265\u1285\u1285\u1348\u1265",
    "medical.disclaimer": "\u12A0\u1265\u1295 \u127E\u1240\u1295\u1265 \u12B3 \u1271\u1260\u1349\u1271\u1265 \u1276\u1263\u12AB \u1263\u1205\u1273\u122A \u126F\u1275\u127A\u1295 \u12A5\u1276\u1275\u1295 \u1265\u1203\u1263\u1276\u1260 \u1265\u1349\u1273\u1260\u1276\u1265 \u1260\u1263\u1273\u1271\u1218 \u1295\u1276\u1295\u122D\u1293\u1276\u1325.",
    "medical.symptoms": "\u1260\u1265\u127D\u1275\u1293\u1263\u1263\u1263\u1263\u1263",
    "medical.diagnosis": "\u1260\u1263\u1273\u1249\u1260\u1265",
    "medical.treatment": "\u1260\u1263\u1273\u1248",
    "medical.prevention": "\u1260\u1263\u1270\u1261\u1261",
    "medical.bloodPressure": "\u1265\u1228\u1260 \u1262\u127D\u129A\u1261\u1228",
    "medical.heartRate": "\u1265\u1271\u1261\u1293 \u126D\u1278\u1289\u1263\u1263\u1295",
    "medical.temperature": "\u1260\u1263\u1291\u1260\u1263",
    "medical.weight": "\u1250\u1260\u127D",
    "emergency.title": "\u130A\u1263\u1293 \u1263\u1208\u1236 \u1260\u1270\u1263\u1265\u1276\u1260\u1260\u1263\u1271\u1263\u1263",
    "emergency.call": "\u130A\u1263\u1293 \u1262\u1276\u1268 \u1295\u127E\u1295",
    "emergency.sos": "SOS \u1260\u1260\u1263\u1271\u1295\u1295",
    "emergency.cpr": "CPR \u1260\u1260\u1273\u1278\u127D\u1263\u1263\u1263\u1263",
    "emergency.choking": "\u1260\u1263\u1273\u1275 \u1265\u127D\u1289\u1265\u1265",
    "emergency.bleeding": "\u1270\u1293\u1260\u1260\u1273 \u1265\u1228\u1260 \u1260\u127D\u1289\u1260\u1260\u1265",
    "emergency.burns": "\u12AE\u127A\u1276\u1276\u1271\u127E \u1260\u1263\u1273\u1275",
    "emergency.poison": "\u1295\u1276\u1248\u1293\u1260\u1271\u1295\u1295 \u1265\u127D\u1289\u1265\u1265",
    "emergency.snakeBite": "\u1320\u1228\u1295 \u1260\u1269\u1265\u1261",
    "emergency.fracture": "\u1260\u1263\u127D \u1261\u1276\u1260",
    "emergency.heartAttack": "\u1265\u1271\u1261\u1293 \u1261\u127A\u1293\u1276\u1325",
    "lang.en": "English",
    "lang.or": "Afaan Oromoo",
    "lang.am": "\u1260\u1263\u1273\u127E\u1260\u1263\u1271",
    "lang.sw": "Swahili",
  },
  sw: {
    "nav.home": "Nyumbani",
    "nav.aiAssistant": "Msaidizi wa AI",
    "nav.diseaseDetection": "Utambuzi wa Ugonjwa",
    "nav.emergency": "Dharura",
    "nav.finder": "Tafuta Vifaa",
    "nav.medications": "Dawa",
    "nav.healthRecords": "Rekodi za Afya",
    "nav.reports": "Ripoti",
    "nav.family": "Familia",
    "nav.analytics": "Uchambuzi",
    "nav.community": "Jamii",
    "nav.settings": "Mipangilio",
    "common.search": "Tafuta",
    "common.save": "Hifadhi",
    "common.cancel": "Ghairi",
    "common.delete": "Futa",
    "common.edit": "Hariri",
    "common.loading": "Inapakia...",
    "common.error": "Kumetokea hitilafu",
    "common.success": "Imefanikiwa",
    "common.back": "Rudi",
    "common.next": "Ifuatayo",
    "common.confirm": "Thibitisha",
    "common.close": "Funga",
    "common.viewAll": "Ona Yote",
    "medical.disclaimer": "Taarifa hii ni kwa madhumuni ya kielimu tu na haipaswi kubadilisha ushauri wa matibabu wa kitaalamu.",
    "medical.symptoms": "Dalili",
    "medical.diagnosis": "Utambuzi",
    "medical.treatment": "Matibabu",
    "medical.prevention": "Kuzuia",
    "medical.bloodPressure": "Shinikizo la Damu",
    "medical.heartRate": "Kiwango cha Moyo",
    "medical.temperature": "Joto",
    "medical.weight": "Uzito",
    "emergency.title": "Huduma za Dharura",
    "emergency.call": "Piga Dharura",
    "emergency.sos": "Tahadhari ya SOS",
    "emergency.cpr": "Maelekezo ya CPR",
    "emergency.choking": "Jinsi ya Kukabili Kukwama",
    "emergency.bleeding": "Kutokwa na Damu Nyingi",
    "emergency.burns": "Matibabu ya Mchoma",
    "emergency.poison": "Jinsi ya Kukabili Sumu",
    "emergency.snakeBite": "Kuumwa na Nyoka",
    "emergency.fracture": "Huduma ya Mifupa",
    "emergency.heartAttack": "Jinsi ya Kukambata Shambulio la Moyo",
    "lang.en": "English",
    "lang.or": "Afaan Oromoo",
    "lang.am": "Amharic",
    "lang.sw": "Kiswahili",
  },
};

export function t(key: TranslationKey, language: string = "en"): string {
  return translations[language]?.[key] ?? translations.en[key] ?? key;
}

export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    or: "Afaan Oromoo",
    am: "\u1260\u1263\u1273\u127E\u1260\u1263\u1271",
    sw: "Kiswahili",
  };
  return names[code] ?? code;
}
