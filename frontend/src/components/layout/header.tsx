"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Globe,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { SidebarToggle } from "./sidebar";

const languages = [
  { code: "en" as const, label: "English", flag: "🇺🇸" },
  { code: "orm" as const, label: "Afaan Oromo", flag: "🇪🇹" },
  { code: "amh" as const, label: "Amharic", flag: "🇪🇹" },
  { code: "sw" as const, label: "Swahili", flag: "🇰🇪" },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/ai-chat": "AI Health Chat",
  "/symptom-checker": "Symptom Checker",
  "/emergency": "Emergency Response",
  "/facility-finder": "Find Facilities",
  "/medications": "Medications",
  "/health-records": "Health Records",
  "/analytics": "Analytics",
  "/wellness": "Wellness",
  "/community": "Community",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
    language,
    setLanguage,
    user,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = unreadCount();
  const pageTitle = pageTitles[pathname] || "Page";
  const currentLang = languages.find((l) => l.code === language);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setShowLanguageMenu(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <SidebarToggle />

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
      </div>

      <div className="hidden max-w-xs flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search health topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div ref={langRef} className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLang?.flag} {currentLang?.label}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      language === lang.code
                        ? "bg-primary/10 text-primary"
                        : "text-card-foreground hover:bg-muted"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emergency text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-1 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold text-card-foreground">
                    Notifications
                  </h3>
                  {unread > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={cn(
                          "flex w-full gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted",
                          !notif.read && "bg-primary/5"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                            notif.type === "emergency" && "bg-emergency",
                            notif.type === "warning" && "bg-warning",
                            notif.type === "success" && "bg-success",
                            notif.type === "info" && "bg-primary",
                            notif.read && "opacity-0"
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-card-foreground">
                            {notif.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {notif.message}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </div>
            <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
          </button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-1 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                {user && (
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium text-card-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                )}
                <div className="py-1">
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-emergency hover:bg-emergency/5">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
