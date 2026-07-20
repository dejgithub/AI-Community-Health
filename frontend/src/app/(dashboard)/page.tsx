"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Weight,
  Calculator,
  Bot,
  ScanLine,
  MapPin,
  Pill,
  Siren,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Bell,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const healthCards = [
  {
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    change: -2,
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    change: 0,
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/10",
  },
  {
    label: "Weight",
    value: "71.5",
    unit: "kg",
    change: -1.2,
    icon: Weight,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    label: "BMI",
    value: "23.4",
    unit: "kg/m²",
    change: -0.5,
    icon: Calculator,
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
  },
];

const quickActions = [
  {
    label: "AI Chat",
    icon: Bot,
    href: "/ai-assistant",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Disease Detection",
    icon: ScanLine,
    href: "/disease-detection",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Find Hospital",
    icon: MapPin,
    href: "/finder",
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Medications",
    icon: Pill,
    href: "/medications",
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "SOS Emergency",
    icon: Siren,
    href: "/emergency",
    color: "from-red-500 to-red-600",
  },
  {
    label: "Health Report",
    icon: FileText,
    href: "/reports",
    color: "from-teal-500 to-cyan-500",
  },
];

const recentActivities = [
  {
    title: "AI Assistant Consultation",
    description: "Discussed headache symptoms and recommendations",
    time: "2 hours ago",
    icon: Bot,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Blood Pressure Logged",
    description: "120/80 mmHg - Normal range",
    time: "5 hours ago",
    icon: Heart,
    color: "text-red-500 bg-red-50 dark:bg-red-950/30",
  },
  {
    title: "Medication Reminder",
    description: "Vitamin D supplement taken",
    time: "Yesterday",
    icon: Pill,
    color: "text-green-500 bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Disease Detection Analysis",
    description: "Skin scan completed - No concerns detected",
    time: "2 days ago",
    icon: ScanLine,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  },
];

const medicationReminders = [
  { name: "Vitamin D3", dosage: "2000 IU", time: "9:00 AM", taken: true },
  { name: "Omega-3", dosage: "1000mg", time: "12:00 PM", taken: true },
  { name: "Magnesium", dosage: "400mg", time: "8:00 PM", taken: false },
  { name: "Melatonin", dosage: "3mg", time: "10:00 PM", taken: false },
];

const healthTips = [
  "Drink at least 8 glasses of water daily to stay hydrated and support your body's functions.",
  "Aim for 7-9 hours of quality sleep each night for optimal health and cognitive function.",
  "Regular exercise for at least 30 minutes a day can reduce the risk of chronic diseases by 40%.",
  "Eating 5 servings of fruits and vegetables daily can boost your immune system significantly.",
];

export default function DashboardPage() {
  const [currentTip, setCurrentTip] = useState(0);
  const { user } = useAppStore();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Health Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 p-4 dark:border-amber-900 dark:from-amber-950/30 dark:via-amber-950/20 dark:to-amber-950/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Community Health Alert
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Flu season is approaching. Make sure you&apos;re up to date on your
              vaccinations. Stay safe!
            </p>
          </div>
          <button className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50">
            Dismiss
          </button>
        </div>
      </motion.div>

      {/* Welcome & Health Summary */}
      <div>
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {today} &middot; Here&apos;s your health overview
          </motion.p>
        </div>

        {/* Health Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {healthCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-foreground">
                      {card.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {card.unit}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-xl p-2.5",
                    card.bgColor
                  )}
                >
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {card.change < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                ) : card.change > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <div className="h-3.5 w-3.5" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    card.change < 0
                      ? "text-green-600 dark:text-green-400"
                      : card.change > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                  )}
                >
                  {card.change === 0
                    ? "Stable"
                    : `${card.change > 0 ? "+" : ""}${card.change}%`}
                </span>
                {card.change !== 0 && (
                  <span className="text-xs text-muted-foreground">
                    vs last week
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={action.href}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-110",
                    action.color
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
              <Link
                href="/analytics"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-4 px-6 py-4"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      activity.color
                    )}
                  >
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Medication Reminders & Health Tips */}
        <div className="space-y-6 lg:col-span-2">
          {/* Medication Reminders */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Medication Reminders
                </h2>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                {medicationReminders.filter((m) => !m.taken).length} pending
              </span>
            </div>
            <div className="divide-y divide-border">
              {medicationReminders.map((med, i) => (
                <div
                  key={med.name}
                  className="flex items-center gap-3 px-6 py-3"
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
                      med.taken
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {med.taken && (
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        med.taken
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      )}
                    >
                      {med.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {med.dosage}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {med.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Tip */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Daily Health Tip
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {healthTips[currentTip]}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                {healthTips.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTip(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === currentTip
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentTip((prev) => (prev + 1) % healthTips.length)
                }
                className="text-xs font-medium text-primary hover:text-primary/80"
              >
                Next tip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
