"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Bot, MapPin, User, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ai-chat", label: "AI Chat", icon: Bot },
  { href: "/sos", label: "SOS", icon: Siren, isSos: true },
  { href: "/facility-finder", label: "Finder", icon: MapPin },
  { href: "/settings", label: "Profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));

          if (tab.isSos) {
            return (
              <Link
                key={tab.href}
                href="/emergency"
                className="-mt-6 flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
                    "bg-emergency text-white"
                  )}
                >
                  <Siren className="h-6 w-6" />
                </motion.div>
                <span className="mt-1 text-[10px] font-medium text-emergency">
                  SOS
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center px-3 py-2"
            >
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "mt-0.5 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
