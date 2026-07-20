'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LineChartDataItem {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartDataItem[];
  className?: string;
  color?: string;
  height?: number;
}

export default function LineChart({
  data,
  className,
  color = '#3b82f6',
  height = 200,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pad = { top: 20, right: 20, bottom: 40, left: 40 };
  const cw = Math.max(width - pad.left - pad.right, 0);
  const ch = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const pts = data.map((item, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * cw,
    y: pad.top + ch - (item.value / maxVal) * ch,
    label: item.label,
    value: item.value,
  }));

  const lineD = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 3;
      const cx2 = prev.x + (2 * (p.x - prev.x)) / 3;
      return `C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(' ');

  const areaD = lineD
    ? `${lineD} L ${pts[pts.length - 1]?.x ?? 0} ${pad.top + ch} L ${pts[0]?.x ?? 0} ${pad.top + ch} Z`
    : '';

  const gridCount = 5;

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {Array.from({ length: gridCount + 1 }).map((_, i) => {
          const y = pad.top + (i / gridCount) * ch;
          const val = Math.round(maxVal - (i / gridCount) * maxVal);
          return (
            <g key={i}>
              <line
                x1={pad.left}
                y1={y}
                x2={pad.left + cw}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                className="dark:stroke-gray-700"
              />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-gray-400 text-xs">
                {val}
              </text>
            </g>
          );
        })}
        {areaD && (
          <path
            d={areaD}
            fill={`url(#area-${color.replace('#', '')})`}
            className="opacity-60"
          />
        )}
        {lineD && (
          <path
            d={lineD}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="white" stroke={color} strokeWidth={2.5} />
            <text x={p.x} y={height - 10} textAnchor="middle" className="fill-gray-500 text-xs">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
