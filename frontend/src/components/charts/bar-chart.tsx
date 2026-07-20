'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BarChartDataItem {
  label: string;
  value: number;
  color: string;
  maxValue?: number;
}

interface BarChartProps {
  data: BarChartDataItem[];
  className?: string;
  maxValue?: number;
}

export default function BarChart({ data, className, maxValue: globalMaxValue }: BarChartProps) {
  const computedMax = globalMaxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('space-y-4', className)}>
      {data.map((item, index) => {
        const percentage = Math.min((item.value / computedMax) * 100, 100);
        const displayPercentage = item.maxValue
          ? Math.round((item.value / item.maxValue) * 100)
          : Math.round(percentage);

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {displayPercentage}%
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
