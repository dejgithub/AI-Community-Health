import { create } from "zustand";
import type { UserRead } from "./api-client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "emergency" | "success";
  read: boolean;
  createdAt: string;
}

interface AppState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  activePath: string;
  setActivePath: (path: string) => void;

  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  language: "en" | "orm" | "amh" | "sw";
  setLanguage: (lang: "en" | "orm" | "amh" | "sw") => void;

  user: UserRead | null;
  setUser: (user: UserRead | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;

  sosActive: boolean;
  setSosActive: (active: boolean) => void;
}

function loadToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mediconnect_token");
}

function loadUser(): UserRead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("mediconnect_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  activePath: "/",
  setActivePath: (path) => set({ activePath: path }),

  notifications: [
    {
      id: "1",
      title: "Health Alert",
      message: "Malaria outbreak reported in your region",
      type: "emergency",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Appointment Reminder",
      message: "You have a checkup tomorrow at 10 AM",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      title: "Medication Due",
      message: "Time to take your afternoon medication",
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  language: "en",
  setLanguage: (lang) => set({ language: lang }),

  user: loadUser(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem("mediconnect_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mediconnect_user");
    }
    set({ user });
  },
  token: loadToken(),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("mediconnect_token", token);
    } else {
      localStorage.removeItem("mediconnect_token");
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("mediconnect_token");
    localStorage.removeItem("mediconnect_user");
    set({ token: null, user: null });
  },

  sosActive: false,
  setSosActive: (active) => set({ sosActive: active }),
}));
