'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  fiscalData,
  getVariation,
  sphereColors,
} from '@/lib/brazil-data';

// ─── Color Palette ──────────────────────────────────────────────────────────
const RED = '#E74C3C';
const ORANGE = '#F39C12';
const DARK_ORANGE = '#D35400';
const GREEN = '#009C3B';
const LIGHT_GREEN = '#27AE60';
const BLUE = '#002776';
const YELLOW = '#FFDF00';
const PURPLE = '#8E44AD';
const TEAL = '#16A085';
const GRAY = '#7F8C8D';

// ─── Helpers ────────────────────────────────────────────────────────────────
export function formatBi(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(2)} tri`;
  if (Math.abs(value) >= 1_000) return `R$ ${(value / 1_000).toFixed(1)} bi`;
  return `R$ ${value.toFixed(0)} mi`;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ─── Fade-in on Scroll Hook ─────────────────────────────────────────────────
export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Chart Card Wrapper ─────────────────────────────────────────────────────
export function ChartCard({
  title,
  description,
  colSpan2 = false,
  children,
}: {
  title: string;
  description: string;
  colSpan2?: boolean;
  children: React.ReactNode;
}) {
  const { ref, visible } = useFadeIn();

  return (
    <div
      ref={ref}
      className={`${colSpan2 ? 'md:col-span-2' : ''} transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </div>
  );
}

// ─── Custom Tooltips ────────────────────────────────────────────────────────
export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey?: string }>;
  label?: string | number;
}

export function DualAxisTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm max-w-[280px]">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => {
        const isPct = p.dataKey?.includes('growth') || p.dataKey?.includes('pct') || p.dataKey?.includes('rate');
        return (
          <p key={i} className="text-xs flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}: {isPct ? formatPct(p.value) : formatBi(p.value)}
          </p>
        );
      })}
    </div>
  );
}

export function GenericTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm max-w-[280px]">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          {p.name}: {formatBi(p.value)}
        </p>
      ))}
    </div>
  );
}

export function PctTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm max-w-[280px]">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatPct(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────
export type SphereFilter = 'todas' | 'federal' | 'estadual' | 'municipal';
export type ViewMode = 'total' | 'percapita';

export const sphereLabels: Record<SphereFilter, string> = {
  todas: 'Todas',
  federal: 'Federal',
  estadual: 'Estadual',
  municipal: 'Municipal',
};

export const COLORS = { RED, ORANGE, DARK_ORANGE, GREEN, LIGHT_GREEN, BLUE, YELLOW, PURPLE, TEAL, GRAY };
