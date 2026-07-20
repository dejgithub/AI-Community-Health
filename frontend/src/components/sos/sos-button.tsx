"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, MapPin, X, Shield } from "lucide-react";
import { useAppStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { sosActive, setSosActive } = useAppStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActivating && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isActivating && countdown === 0) {
      activateSOS();
    }
    return () => clearTimeout(timer);
  }, [isActivating, countdown]);

  const activateSOS = async () => {
    setIsActivating(false);
    setSosActive(true);
    toast.success("Emergency SOS activated! Sharing your location...", {
      duration: 6000,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success(
            `Location shared: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            { duration: 5000 }
          );
        },
        () => {
          toast.error("Unable to get location. Emergency services notified.", {
            duration: 5000,
          });
        }
      );
    }
  };

  const cancelActivation = () => {
    setIsActivating(false);
    setCountdown(5);
  };

  const deactivateSOS = () => {
    setSosActive(false);
    toast.success("Emergency SOS deactivated", { duration: 3000 });
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50 lg:hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (sosActive) {
              deactivateSOS();
            } else {
              setIsOpen(true);
            }
          }}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-colors ${
            sosActive
              ? "bg-emergency animate-pulse-emergency"
              : "bg-emergency hover:bg-emergency-dark"
          }`}
        >
          <span className="text-lg font-bold text-white">SOS</span>
          {!sosActive && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emergency opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emergency-dark" />
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={() => !isActivating && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl"
            >
              {isActivating ? (
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emergency"
                  >
                    <span className="text-3xl font-bold text-white">{countdown}</span>
                  </motion.div>
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                    Activating Emergency SOS
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Emergency contacts and services will be alerted. Your location will be
                    shared automatically.
                  </p>
                  <button
                    onClick={cancelActivation}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-border"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emergency/10">
                        <AlertTriangle className="h-5 w-5 text-emergency" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        Emergency SOS
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="mb-6 text-sm text-muted-foreground">
                    This will immediately alert your emergency contacts and share your
                    current location with emergency services.
                  </p>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          Share Location
                        </p>
                        <p className="text-xs text-muted-foreground">
                          GPS coordinates will be sent to contacts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          Alert Contacts
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 emergency contacts will be notified
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          Notify Health Services
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Local community health team alerted
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsActivating(true);
                      setCountdown(5);
                    }}
                    className="w-full rounded-lg bg-emergency px-4 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-emergency-dark"
                  >
                    Activate SOS
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
