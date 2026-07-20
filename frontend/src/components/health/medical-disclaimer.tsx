'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'inline' | 'modal';
  dismissible?: boolean;
}

export default function MedicalDisclaimer({
  variant = 'banner',
  dismissible = true,
}: MedicalDisclaimerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const disclaimerText =
    'This AI assistant provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition.';

  if (variant === 'modal') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-8 shadow-2xl dark:border-amber-900 dark:from-amber-950/50 dark:to-gray-900"
          >
            {dismissible && (
              <button
                onClick={() => setDismissed(true)}
                className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Medical Disclaimer
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {disclaimerText}
              </p>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/30">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          {disclaimerText}
        </p>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="ml-auto shrink-0 rounded p-0.5 text-amber-600 hover:text-amber-800 dark:text-amber-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full border-b border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 px-4 py-3 dark:border-amber-900 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-amber-950/40">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-900/50">
          <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400" />
        </div>
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Medical Disclaimer: </span>
          {disclaimerText}
        </p>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="ml-2 shrink-0 rounded-lg p-1 text-amber-600 hover:bg-amber-200/50 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
