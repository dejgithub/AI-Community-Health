"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  AlertTriangle,
  Droplets,
  Flame,
  Skull,
  Bug,
  Bone,
  HeartPulse,
  Phone,
  Volume2,
  VolumeOff,
  Download,
  ArrowLeft,
  CheckCircle2,
  Info,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmergencyType {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  steps: { text: string; warning?: string }[];
  dos?: string[];
  donts?: string[];
}

const emergencies: EmergencyType[] = [
  {
    id: "cpr",
    title: "CPR",
    icon: HeartPulse,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-600 dark:text-red-400",
    description: "Cardiopulmonary Resuscitation for unresponsive person",
    steps: [
      { text: "Check the scene for safety. Ensure the area is safe for you and the victim.", warning: "Always prioritize your own safety first." },
      { text: "Tap the person's shoulders and shout 'Are you okay?' to check for responsiveness." },
      { text: "Call 911 immediately or ask someone nearby to call. Put phone on speaker.", warning: "Do not delay CPR to make a call if you are alone — do 2 minutes of CPR first." },
      { text: "Check for normal breathing for no more than 10 seconds. Gasping is NOT normal breathing." },
      { text: "Place the heel of one hand on the center of the chest (between the nipples). Place your other hand on top and interlace your fingers." },
      { text: "Begin chest compressions: Push hard and fast at a rate of 100-120 compressions per minute. Allow full chest recoil between compressions.", warning: "Push at least 2 inches deep for adults." },
      { text: "After 30 compressions, give 2 rescue breaths: Tilt head back, lift chin, pinch nose, and blow for 1 second each." },
      { text: "Continue cycles of 30 compressions and 2 breaths until emergency services arrive or the person starts breathing." },
    ],
  },
  {
    id: "choking",
    title: "Choking",
    icon: AlertTriangle,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
    description: "Heimlich maneuver for airway obstruction",
    steps: [
      { text: "Ask the person: 'Are you choking? Can you speak?' If they cannot speak, cough, or breathe, act immediately.", warning: "Complete airway blockage is life-threatening." },
      { text: "Stand behind the person. Place one foot between their feet for stability." },
      { text: "Make a fist with one hand and place it just above the person's navel, well below the breastbone." },
      { text: "Grasp your fist with your other hand. Give quick, upward abdominal thrusts (inward and upward).", warning: "Do NOT use on pregnant women or infants under 1 year." },
      { text: "Continue thrusts until the object is expelled or the person becomes unconscious." },
      { text: "If the person becomes unconscious, lower them to the ground, call 911, and begin CPR.", warning: "Check the mouth before giving breaths — if you see the object, sweep it out with your finger." },
    ],
  },
  {
    id: "bleeding",
    title: "Severe Bleeding",
    icon: Droplets,
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-600 dark:text-red-400",
    description: "Control severe bleeding with pressure and bandaging",
    steps: [
      { text: "Ensure scene safety and put on gloves if available.", warning: "Always use barrier protection when possible to prevent disease transmission." },
      { text: "Call 911 immediately for severe or uncontrolled bleeding." },
      { text: "Apply firm, direct pressure to the wound using a clean cloth, gauze, or clothing." },
      { text: "Press hard and maintain continuous pressure for at least 15 minutes. Do not lift to check.", warning: "Do not remove the cloth if it soaks through — add more on top." },
      { text: "If possible, elevate the injured area above the heart level." },
      { text: "For limb wounds, consider applying a tourniquet 2-3 inches above the wound as a last resort.", warning: "Mark the time the tourniquet was applied." },
      { text: "Keep the victim warm and still. Monitor for signs of shock (pale skin, rapid breathing, confusion)." },
    ],
  },
  {
    id: "burns",
    title: "Burns",
    icon: Flame,
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
    description: "First aid for thermal, chemical, and electrical burns",
    steps: [
      { text: "Remove the person from the source of the burn if it is safe to do so.", warning: "For electrical burns, do NOT touch the person until the power source is disconnected." },
      { text: "Cool the burn under cool (not ice cold) running water for at least 10-20 minutes." },
      { text: "Remove any jewelry, watches, or tight clothing near the burned area before swelling occurs." },
      { text: "Cover the burn loosely with a sterile, non-stick dressing or clean cloth." },
      { text: "Give over-the-counter pain relief if needed (ibuprofen or acetaminophen).", warning: "Do not apply ice, butter, toothpaste, or any home remedies to burns." },
      { text: "Seek medical attention for burns larger than 3 inches, on face/hands/joints, or if deep.", warning: "Call 911 immediately for chemical or electrical burns, or burns covering the whole body." },
    ],
  },
  {
    id: "poison",
    title: "Poisoning",
    icon: Skull,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-600 dark:text-purple-400",
    description: "Response to ingestion, inhalation, or contact with toxins",
    steps: [
      { text: "Call Poison Control immediately: 1-800-222-1222 (US) or your local emergency number." },
      { text: "Identify the substance if possible. Keep the container or substance for reference." },
      { text: "If the person is unconscious but breathing, place them in the recovery position (on their side).", warning: "Do NOT induce vomiting unless specifically instructed by Poison Control." },
      { text: "If the substance is on the skin, remove contaminated clothing and rinse skin with water for 15-20 minutes." },
      { text: "If the substance is in the eyes, flush eyes with clean water for 15-20 minutes." },
      { text: "If the person is not breathing, begin CPR and continue until emergency services arrive." },
    ],
    dos: [
      "Call Poison Control right away",
      "Keep the substance container handy",
      "Follow Poison Control's instructions exactly",
      "Note the time the exposure occurred",
    ],
    donts: [
      "Do NOT induce vomiting",
      "Do NOT try to neutralize the substance",
      "Do NOT give food or water unless told to",
      "Do NOT wait for symptoms to appear before calling for help",
    ],
  },
  {
    id: "snakebite",
    title: "Snake Bite",
    icon: Bug,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-600 dark:text-green-400",
    description: "First aid for venomous and non-venomous snake bites",
    steps: [
      { text: "Move away from the snake to prevent additional bites.", warning: "The snake can still bite for up to an hour after being killed." },
      { text: "Call 911 or go to the nearest hospital immediately. Note the snake's appearance if safe." },
      { text: "Keep the bitten limb immobilized and at or below heart level." },
      { text: "Remove any rings, watches, or tight clothing near the bite area before swelling develops." },
      { text: "Clean the wound gently with soap and water if available." },
      { text: "Apply a pressure immobilization bandage (firm, not tight) between the bite and the heart for venomous bites.", warning: "Do NOT apply a tourniquet." },
      { text: "Mark the time of the bite and any swelling progression with a pen." },
    ],
    donts: [
      "Do NOT suck out the venom",
      "Do NOT apply a tourniquet",
      "Do NOT cut the wound",
      "Do NOT apply ice or cold compresses",
      "Do NOT drink alcohol or take aspirin",
    ],
  },
  {
    id: "fracture",
    title: "Fracture",
    icon: Bone,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400",
    description: "Splinting and immobilization for suspected bone fractures",
    steps: [
      { text: "Call 911 for suspected spine, neck, or hip fractures, or if the bone is protruding through the skin.", warning: "Do NOT move the person if a spine or neck injury is suspected." },
      { text: "Control any bleeding by applying firm pressure around (not on) the wound." },
      { text: "Immobilize the injured area by splinting it in the position found.", warning: "Do NOT attempt to realign the bone." },
      { text: "Pad the splint with soft material for comfort. Splint should extend beyond the joints above and below the fracture." },
      { text: "Check circulation below the fracture (pulse, sensation, color). Loosen if too tight." },
      { text: "Apply ice wrapped in cloth to reduce swelling (20 minutes on, 20 minutes off).", warning: "Never apply ice directly to the skin." },
      { text: "Monitor for signs of shock and keep the person warm and calm." },
    ],
  },
  {
    id: "heartattack",
    title: "Heart Attack",
    icon: Heart,
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-600 dark:text-red-400",
    description: "Immediate response to cardiac emergency",
    steps: [
      { text: "Call 911 immediately. Do NOT drive yourself to the hospital.", warning: "Time is critical — every minute matters." },
      { text: "Chew and swallow an aspirin (325 mg or 4 baby aspirin) if not allergic and not contraindicated." },
      { text: "Sit or lie down in a comfortable position. Loosen any tight clothing." },
      { text: "If the person becomes unconscious and is not breathing normally, begin CPR immediately.", warning: "Push hard and fast in the center of the chest at 100-120 compressions per minute." },
      { text: "If an AED (defibrillator) is available, use it. Follow the voice prompts.", warning: "Do not hesitate to use an AED — it will only shock if needed." },
      { text: "Stay with the person until emergency services arrive. Keep them calm and reassured." },
      { text: "Unlock the front door and turn on outdoor lights to help emergency services find you quickly." },
    ],
  },
];

export default function EmergencyPage() {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const openEmergency = (emergency: EmergencyType) => {
    setSelectedEmergency(emergency);
    setCompletedSteps(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Emergency Call Button - Top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-red-600 to-red-700 p-6 text-center animate-pulse-glow"
      >
        <h2 className="text-xl font-bold text-white">Emergency SOS</h2>
        <p className="mt-1 text-sm text-white/80">
          Tap below to call emergency services immediately
        </p>
        <a
          href="tel:911"
          className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-red-600 shadow-lg transition-transform hover:scale-105"
        >
          <Phone className="h-6 w-6" />
          Call 911
        </a>
      </motion.div>

      {!selectedEmergency ? (
        <>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emergency First Aid</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select an emergency type below for step-by-step first aid instructions
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Offline Access</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  These guides are cached for offline use. However, always call 911 for real emergencies.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {emergencies.map((emergency, i) => (
              <motion.button
                key={emergency.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openEmergency(emergency)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-all hover:shadow-lg hover:border-primary/20"
                )}
              >
                <div className={cn("mb-4 inline-flex rounded-xl p-3", emergency.bgColor)}>
                  <emergency.icon className={cn("h-7 w-7", emergency.textColor)} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{emergency.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{emergency.description}</p>
                <div className={cn("absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 transition-all group-hover:scale-150 group-hover:opacity-20", emergency.color)} />
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEmergency.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedEmergency(null)}
                className="rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className={cn("inline-flex rounded-xl p-3", selectedEmergency.bgColor)}>
                <selectedEmergency.icon className={cn("h-6 w-6", selectedEmergency.textColor)} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{selectedEmergency.title}</h1>
                <p className="text-sm text-muted-foreground">{selectedEmergency.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-muted"
                  title={voiceEnabled ? "Mute voice narration" : "Enable voice narration"}
                >
                  {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeOff className="h-5 w-5" />}
                </button>
                <button className="rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-muted" title="Download guide">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">Important Warning</p>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    These instructions are for guidance only. Always call 911 for medical emergencies. Professional medical help is essential.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Step-by-Step Instructions
                </h2>
                <span className="text-xs text-muted-foreground">
                  {completedSteps.size}/{selectedEmergency.steps.length} completed
                </span>
              </div>
              <div className="space-y-3">
                {selectedEmergency.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-4 transition-all duration-200",
                      completedSteps.has(index)
                        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                        : "border-border bg-background hover:border-gray-300 dark:hover:border-gray-700"
                    )}
                  >
                    <button
                      onClick={() => toggleStep(index)}
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        completedSteps.has(index)
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 text-gray-400 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                      )}
                    >
                      {completedSteps.has(index) ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          completedSteps.has(index)
                            ? "text-green-700 line-through dark:text-green-400"
                            : "text-foreground"
                        )}
                      >
                        {step.text}
                      </p>
                      {step.warning && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          {step.warning}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dos and Don'ts */}
            {(selectedEmergency.dos || selectedEmergency.donts) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedEmergency.dos && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/20">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-800 dark:text-green-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Do&apos;s
                    </h3>
                    <ul className="space-y-2">
                      {selectedEmergency.dos.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedEmergency.donts && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-800 dark:text-red-300">
                      <AlertTriangle className="h-4 w-4" />
                      Don&apos;ts
                    </h3>
                    <ul className="space-y-2">
                      {selectedEmergency.donts.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Emergency Call CTA */}
            <div className="flex items-center gap-3">
              <a
                href="tel:911"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-600 hover:shadow-xl"
              >
                <Phone className="h-5 w-5" />
                Call Emergency Services
              </a>
              <Button
                variant="outline"
                onClick={() => setSelectedEmergency(null)}
                className="px-6 py-4"
              >
                All Emergencies
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
