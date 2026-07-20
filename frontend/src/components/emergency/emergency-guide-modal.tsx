'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Volume2,
  VolumeOff,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyStep {
  text: string;
  warning?: string;
}

interface EmergencyGuide {
  title: string;
  icon?: string;
  steps: EmergencyStep[];
  tips?: string[];
  warnings?: string[];
}

interface EmergencyGuideModalProps {
  guide: EmergencyGuide;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyGuideModal({
  guide,
  isOpen,
  onClose,
}: EmergencyGuideModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/50">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {guide.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                  title={voiceEnabled ? 'Mute voice' : 'Enable voice narration'}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <VolumeOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              {guide.warnings && guide.warnings.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="mb-1 text-sm font-semibold text-red-800 dark:text-red-300">
                        Important Warning
                      </p>
                      {guide.warnings.map((w, i) => (
                        <p key={i} className="text-sm text-red-700 dark:text-red-400">
                          {w}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Step-by-Step Instructions
                </h3>
                {guide.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex items-start gap-4 rounded-xl border p-4 transition-all duration-200',
                      completedSteps.has(index)
                        ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700'
                    )}
                  >
                    <button
                      onClick={() => toggleStep(index)}
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                        completedSteps.has(index)
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 text-gray-400 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
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
                          'text-sm leading-relaxed',
                          completedSteps.has(index)
                            ? 'text-green-700 line-through dark:text-green-400'
                            : 'text-gray-800 dark:text-gray-200'
                        )}
                      >
                        {step.text}
                      </p>
                      {step.warning && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" />
                          {step.warning}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {guide.tips && guide.tips.length > 0 && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Helpful Tips
                      </p>
                      <ul className="space-y-1">
                        {guide.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-blue-700 dark:text-blue-400">
                            <Info className="mt-0.5 h-3 w-3 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
              <div className="flex items-center gap-3">
                <a
                  href="tel:911"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  <Phone className="h-4 w-4" />
                  Call Emergency Services
                </a>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
