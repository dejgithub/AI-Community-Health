'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthScoreGaugeProps {
  score: number;
  label?: string;
  className?: string;
  size?: number;
}

function getScoreColor(score: number): { stroke: string; text: string; bg: string } {
  if (score <= 40) return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
  if (score <= 70) return { stroke: '#eab308', text: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
  return { stroke: '#22c55e', text: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'Needs Attention';
  if (score <= 70) return 'Moderate';
  return 'Excellent';
}

export default function HealthScoreGauge({
  score,
  label,
  className,
  size = 160,
}: HealthScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const colors = getScoreColor(clampedScore);
  const displayLabel = label || getScoreLabel(clampedScore);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = clampedScore / 100;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            className="dark:stroke-gray-800"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - fillPercentage) }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn('text-3xl font-bold', colors.text)}
          >
            {clampedScore}
          </motion.span>
          <span className="text-xs text-gray-400 dark:text-gray-500">out of 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayLabel}</p>
        <div className={cn('mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5', colors.bg)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', colors.text)} style={{ backgroundColor: colors.stroke }} />
          <span className={cn('text-xs font-medium', colors.text)}>
            {clampedScore <= 40 ? 'Low' : clampedScore <= 70 ? 'Moderate' : 'Good'} Health Score
          </span>
        </div>
      </div>
    </div>
  );
}
