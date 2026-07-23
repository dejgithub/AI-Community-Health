"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Bot,
  ScanLine,
  Siren,
  MapPin,
  Pill,
  FileText,
  BarChart3,
  Heart,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/components/providers/theme-provider";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/ai-assistant", label: "AI Health Chat", icon: Bot },
  { href: "/disease-detection", label: "Disease Detection", icon: ScanLine },
  { href: "/emergency", label: "Emergency", icon: Siren },
  { href: "/facility-finder", label: "Find Facilities", icon: MapPin },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/health-records", label: "Health Records", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/wellness", label: "Wellness", icon: Heart },
  { href: "/community", label: "Community", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } =
    useAppStore();
  const { resolvedTheme, toggleTheme } = useTheme();
  const user = useAppStore((s) => s.user);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-base font-bold text-sidebar-foreground">
                MediConnect
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
                AI Health
              </p>
            </motion.div>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:flex"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => {
            const btn = document.querySelector<HTMLElement>("[data-sos-trigger]");
            btn?.click();
          }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-lg transition-all",
            "bg-emergency hover:bg-emergency-dark",
            "animate-pulse-emergency"
          )}
        >
          <Siren className="h-5 w-5" />
          {!sidebarCollapsed && <span>SOS Emergency</span>}
        </button>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {!sidebarCollapsed && user && (
            <div className="flex flex-1 items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {user.role}
                </p>
              </div>
              <button className="rounded p-1 text-muted-foreground hover:bg-muted">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden h-screen flex-shrink-0 border-r border-border transition-all duration-300 lg:block",
          sidebarCollapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="absolute right-2 top-4 z-10">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function SidebarToggle() {
  const { setSidebarOpen } = useAppStore();
  return (
    <button
      onClick={() => setSidebarOpen(true)}
      className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
