'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'om', name: 'Afaan Oromo', nativeName: 'Afaan Oromoo', flag: '\u{1F1EA}\u{1F1F9}' },
  { code: 'am', name: 'Amharic', nativeName: '\u12A0\u12CD\u1295\u1235', flag: '\u{1F1EA}\u{1F1F9}' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '\u{1F1F3}\u{1F1FA}' },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  className?: string;
}

export default function LanguageSelector({
  currentLanguage = 'en',
  onLanguageChange,
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentLanguage);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = languages.find((l) => l.code === selected) || languages[0];

  const handleSelect = (code: string) => {
    setSelected(code);
    onLanguageChange?.(code);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
      >
        <Globe className="h-4 w-4 text-gray-400" />
        <span>{current.flag}</span>
        <span>{current.nativeName}</span>
        <svg
          className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="p-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    selected === lang.code
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lang.nativeName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{lang.name}</p>
                  </div>
                  {selected === lang.code && (
                    <Check className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
