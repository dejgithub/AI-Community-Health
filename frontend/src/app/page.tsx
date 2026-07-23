"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Bot,
  ScanLine,
  Siren,
  MapPin,
  FileText,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Heart,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Stethoscope,
  Activity,
  Phone,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Medical Assistant",
    description:
      "Chat with our AI-powered assistant for instant health guidance, symptom analysis, and personalized recommendations.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: ScanLine,
    title: "Disease Detection",
    description:
      "Upload images for AI-powered skin condition and disease analysis with confidence scoring and severity assessment.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Siren,
    title: "Emergency Response",
    description:
      "Step-by-step emergency instructions for CPR, choking, bleeding, and more. One-tap access to emergency services.",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: MapPin,
    title: "Hospital Finder",
    description:
      "Locate nearby hospitals, clinics, and pharmacies with real-time availability and distance information.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: FileText,
    title: "Health Records",
    description:
      "Securely store and manage your medical history, prescriptions, lab results, and vaccination records.",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: BarChart3,
    title: "Community Dashboard",
    description:
      "Monitor community health trends, disease outbreaks, and public health alerts in real-time.",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    description:
      "Sign up and complete your health profile for personalized AI-powered insights.",
    icon: Shield,
  },
  {
    num: "02",
    title: "Connect & Analyze",
    description:
      "Use our AI tools to analyze symptoms, detect conditions, and get instant health guidance.",
    icon: Activity,
  },
  {
    num: "03",
    title: "Stay Healthy",
    description:
      "Track your health journey, receive reminders, and access emergency help when needed.",
    icon: Heart,
  },
];

const stats = [
  { value: "10K+", label: "Active Users", icon: Globe },
  { value: "500+", label: "Partner Hospitals", icon: MapPin },
  { value: "24/7", label: "AI Availability", icon: Clock },
  { value: "99%", label: "Uptime", icon: Shield },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const token = useAppStore((s) => s.token);

  useEffect(() => {
    if (token) {
      setRedirecting(true);
      router.replace("/medications");
    }
  }, [token, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Medi<span className="text-primary">Connect</span> AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#stats"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-foreground md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border bg-background px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                How It Works
              </a>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        {/* Floating medical icons */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%] hidden lg:block"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-primary/10 dark:bg-gray-800">
            <Heart className="h-7 w-7 text-red-500" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-48 right-[12%] hidden lg:block"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-accent/10 dark:bg-gray-800">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-32 left-[15%] hidden lg:block"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-secondary/10 dark:bg-gray-800">
            <Stethoscope className="h-8 w-8 text-secondary" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute bottom-40 right-[8%] hidden lg:block"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-green-500/10 dark:bg-gray-800">
            <Shield className="h-6 w-6 text-green-500" />
          </div>
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                AI-Powered Healthcare Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              AI-Powered Healthcare{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                for Everyone
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Accessible, intelligent healthcare at your fingertips. Get
              instant AI medical guidance, emergency assistance, and community
              health insights — anytime, anywhere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                Learn More
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              <Shield className="h-3.5 w-3.5" />
              HIPAA Compliant &middot; End-to-End Encrypted &middot; Your Data Stays Private
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Everything You Need for{" "}
              <span className="text-primary">Better Health</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-2xl text-muted-foreground"
            >
              From AI-powered diagnostics to emergency response, we provide
              comprehensive healthcare tools designed for communities.
            </motion.p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20"
              >
                <div
                  className={`mb-5 inline-flex rounded-xl p-3 ${feature.bgColor}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div
                  className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} opacity-5 transition-all group-hover:scale-150 group-hover:opacity-10`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary"
            >
              How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Getting Started Is{" "}
              <span className="text-secondary">Simple</span>
            </motion.h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white shadow-lg shadow-primary/25">
                  {step.num}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-px w-[80%] bg-gradient-to-r from-primary/20 to-transparent md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary p-1">
            <div className="rounded-[calc(1.5rem-1px)] bg-background px-8 py-16 sm:px-16">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground sm:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent px-8 py-16 text-center sm:px-16"
          >
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
                Join thousands of users who trust MediConnect AI for their
                healthcare needs. Start your journey to better health today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:bg-white/90"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground">
                  MediConnect AI
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Making healthcare accessible, intelligent, and available to
                everyone through the power of artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {["AI Assistant", "Disease Detection", "Emergency Guide", "Hospital Finder"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Company
              </h4>
              <ul className="space-y-2.5">
                {["About Us", "Privacy Policy", "Terms of Service", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Emergency
              </h4>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
                  <Phone className="h-4 w-4" />
                  Emergency: 911
                </div>
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                  If you are experiencing a medical emergency, call 911
                  immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
              <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <span className="font-semibold">Medical Disclaimer:</span>{" "}
                MediConnect AI provides general health information only and is
                not a substitute for professional medical advice, diagnosis, or
                treatment. Always seek the advice of your physician or qualified
                health provider with any questions you may have regarding a
                medical condition.
              </p>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} MediConnect AI. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
