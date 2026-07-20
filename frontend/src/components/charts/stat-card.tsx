'use client';

import { motion } from 'framer-motion';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string;
}

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
  },
};

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:border-gray-300',
        'dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-semibold',
                  change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', colors.iconBg)}>
          <Icon className={cn('h-6 w-6', colors.text)} />
        </div>
      </div>
      <div
        className={cn(
          'absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-10',
          colors.iconBg
        )}
      />
    </motion.div>
  );
}
