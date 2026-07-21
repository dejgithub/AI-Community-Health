const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ai-community-health.onrender.com";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mediconnect_token");
      localStorage.removeItem("mediconnect_user");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface UserRead {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  blood_group?: string;
  date_of_birth?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserRead;
}

export interface MedicationRead {
  id: number;
  user_id: number;
  name: string;
  dosage: string;
  frequency: string;
  times?: string[];
  start_date?: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
}

export interface HealthRecordRead {
  id: number;
  user_id: number;
  type: string;
  title: string;
  content?: string;
  date?: string;
  attachments?: unknown[];
}

export interface HospitalRead {
  id: number;
  name: string;
  address: string;
  phone?: string;
  latitude: number;
  longitude: number;
  specialties?: string[];
  rating: number;
  is_open: boolean;
  opening_hours?: Record<string, string>;
}

export interface PharmacyRead {
  id: number;
  name: string;
  address: string;
  phone?: string;
  latitude: number;
  longitude: number;
  rating: number;
  is_open: boolean;
  opening_hours?: Record<string, string>;
}

export interface EmergencyGuide {
  id: number;
  title: string;
  category: string;
  steps: string[];
  icon: string;
}

export interface SOSResponse {
  success: boolean;
  alert_id: string;
  message: string;
  notified_contacts: string[];
  estimated_response?: string;
}

export interface AIChatResponse {
  response: string;
  suggestions: string[];
  confidence: number;
}

export interface AIImageAnalysisResponse {
  results: {
    condition: string;
    confidence: number;
    description: string;
    recommendations: string[];
    severity: string;
  }[];
  disclaimer: string;
}

export interface HealthReportResponse {
  report: {
    summary: string;
    risk_level: string;
    recommendations: string[];
    vitals: Record<string, unknown>;
    generated_at: string;
  };
}

export interface FamilyMemberRead {
  id: number;
  user_id: number;
  name: string;
  relationship: string;
  date_of_birth?: string;
  blood_group?: string;
  phone?: string;
  medical_conditions: string[];
  allergies: string[];
  medications: string[];
}

export interface CommunityStats {
  region: string;
  date: string;
  total_reports: number;
  active_cases: number;
  recovered: number;
  hospitals: number;
  pharmacies: number;
  vaccination_rate: number;
  health_score: number;
  disease_data: Record<string, number>;
  vaccination_data: Record<string, number>;
  emergency_data: Record<string, number>;
}

export interface CommunityTrends {
  region: string;
  period: string;
  trends: { date: string; new_cases: number; recoveries: number; active: number }[];
  insights: string[];
}

export interface CommunityAlerts {
  alerts: {
    id: number;
    type: string;
    severity: string;
    title: string;
    description: string;
    date: string;
    region: string;
    active: boolean;
  }[];
}

export interface MedicationStats {
  total_medications: number;
  active_medications: number;
  adherence_rate: number;
  streak_days: number;
  doses_taken_today: number;
  doses_remaining_today: number;
}

export interface TodaySchedule {
  date: string;
  schedule: {
    medication_id: number;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
  }[];
}

export interface RecordsSummary {
  total_records: number;
  by_type: Record<string, number>;
  latest_record: HealthRecordRead | null;
}

export const api = {
  auth: {
    register: (data: { email: string; name: string; phone?: string; role?: string; password: string; blood_group?: string; date_of_birth?: string }) =>
      request<TokenResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<TokenResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: (token: string) =>
      request<UserRead>("/api/auth/me", { token }),
    updateProfile: (token: string, data: { name?: string; phone?: string; blood_group?: string; date_of_birth?: string; avatar_url?: string }) =>
      request<UserRead>("/api/auth/profile", { method: "PUT", token, body: JSON.stringify(data) }),
  },
  medications: {
    list: (token: string) =>
      request<MedicationRead[]>("/api/medications", { token }),
    create: (token: string, data: { name: string; dosage: string; frequency: string; times?: string[]; start_date?: string; end_date?: string; notes?: string }) =>
      request<MedicationRead>("/api/medications", { method: "POST", token, body: JSON.stringify(data) }),
    update: (token: string, id: number, data: { name?: string; dosage?: string; frequency?: string; times?: string[]; is_active?: boolean }) =>
      request<MedicationRead>(`/api/medications/${id}`, { method: "PUT", token, body: JSON.stringify(data) }),
    delete: (token: string, id: number) =>
      request<void>(`/api/medications/${id}`, { method: "DELETE", token }),
    markTaken: (token: string, id: number) =>
      request<{ success: boolean; message: string }>(`/api/medications/${id}/taken`, { method: "POST", token }),
    todaySchedule: (token: string) =>
      request<TodaySchedule>("/api/medications/schedule/today", { token }),
    stats: (token: string) =>
      request<MedicationStats>("/api/medications/stats", { token }),
  },
  records: {
    list: (token: string) =>
      request<HealthRecordRead[]>("/api/records", { token }),
    create: (token: string, data: { type: string; title: string; content?: string; date?: string; attachments?: unknown[] }) =>
      request<HealthRecordRead>("/api/records", { method: "POST", token, body: JSON.stringify(data) }),
    get: (token: string, id: number) =>
      request<HealthRecordRead>(`/api/records/${id}`, { token }),
    update: (token: string, id: number, data: { type?: string; title?: string; content?: string; date?: string }) =>
      request<HealthRecordRead>(`/api/records/${id}`, { method: "PUT", token, body: JSON.stringify(data) }),
    delete: (token: string, id: number) =>
      request<void>(`/api/records/${id}`, { method: "DELETE", token }),
    summary: (token: string) =>
      request<RecordsSummary>("/api/records/summary", { token }),
  },
  health: {
    hospitals: (lat?: number, lng?: number, radius?: number, specialty?: string) => {
      const params = new URLSearchParams();
      if (lat !== undefined) params.set("lat", String(lat));
      if (lng !== undefined) params.set("lng", String(lng));
      if (radius !== undefined) params.set("radius", String(radius));
      if (specialty) params.set("specialty", specialty);
      const qs = params.toString();
      return request<HospitalRead[]>(`/api/hospitals${qs ? `?${qs}` : ""}`);
    },
    pharmacies: (lat?: number, lng?: number, radius?: number) => {
      const params = new URLSearchParams();
      if (lat !== undefined) params.set("lat", String(lat));
      if (lng !== undefined) params.set("lng", String(lng));
      if (radius !== undefined) params.set("radius", String(radius));
      const qs = params.toString();
      return request<PharmacyRead[]>(`/api/pharmacies${qs ? `?${qs}` : ""}`);
    },
  },
  ai: {
    chat: (messages: { role: string; content: string }[], context?: string) =>
      request<AIChatResponse>("/api/ai/chat", { method: "POST", body: JSON.stringify({ messages, context }) }),
    analyzeImage: (token: string) =>
      request<AIImageAnalysisResponse>("/api/ai/analyze-image", { method: "POST", token, body: JSON.stringify({ image: "placeholder" }) }),
    generateReport: (userData: Record<string, unknown>, recordIds: number[] = []) =>
      request<HealthReportResponse>("/api/ai/generate-report", { method: "POST", body: JSON.stringify({ user_data: userData, record_ids: recordIds }) }),
    suggestions: () =>
      request<{ suggestions: string[] }>("/api/ai/suggestions"),
  },
  emergency: {
    guides: () =>
      request<EmergencyGuide[]>("/api/emergency/guides"),
    guide: (id: number) =>
      request<EmergencyGuide>(`/api/emergency/guides/${id}`),
    sos: (token: string, data: { latitude: number; longitude: number; message?: string; emergency_type?: string }) =>
      request<SOSResponse>("/api/emergency/sos", { method: "POST", token, body: JSON.stringify(data) }),
    report: (token: string, data: { emergency_type: string; description: string; latitude: number; longitude: number; severity?: string }) =>
      request<{ success: boolean; report_id: number; message: string }>("/api/emergency/report", { method: "POST", token, body: JSON.stringify(data) }),
  },
  community: {
    stats: () =>
      request<CommunityStats>("/api/community/stats"),
    trends: () =>
      request<CommunityTrends>("/api/community/trends"),
    alerts: () =>
      request<CommunityAlerts>("/api/community/alerts"),
  },
  family: {
    list: (token: string) =>
      request<FamilyMemberRead[]>("/api/family", { token }),
    create: (token: string, data: { name: string; relationship: string; date_of_birth?: string; blood_group?: string; phone?: string; medical_conditions?: string[]; allergies?: string[]; medications?: string[] }) =>
      request<FamilyMemberRead>("/api/family", { method: "POST", token, body: JSON.stringify(data) }),
    delete: (token: string, id: number) =>
      request<void>(`/api/family/${id}`, { method: "DELETE", token }),
  },
};
