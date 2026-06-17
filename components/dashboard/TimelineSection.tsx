'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  timelineEvents,
  fiscalData,
  gcData,
  dbggData,
} from '@/lib/brazil-data';
import type { TimelineEvent } from '@/lib/brazil-data';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatBi(value: number): string {
  const bi = value / 1000;
  const sign = bi < 0 ? '-' : '';
  return `${sign}R$ ${Math.abs(bi).toFixed(1)} bi`;
}

function getFiscalContext(year: number): string | null {
  // Check fiscalData first (Governo Geral)
  const fd = fiscalData[year];
  if (fd) {
    return `Governo Geral ${year}: Receita ${formatBi(fd.receita_total)} | Despesa ${formatBi(fd.despesa_total)} | ROL ${formatBi(fd.rol)}`;
  }
  // Check gcData (Governo Central)
  const gc = gcData[year as keyof typeof gcData];
  if (gc) {
    return `Governo Central ${year}: Rec. Líquida ${formatBi(gc.receita_liquida)} | Despesa ${formatBi(gc.despesa_total)} | Primário ${formatBi(gc.resultado_primario)}`;
  }
  return null;
}

function getDbggContext(year: number): string | null {
  const dbgg = dbggData[year];
  if (dbgg) {
    return `DBGG: ${dbgg}% do PIB`;
  }
  return null;
}

// ─── Timeline Point ─────────────────────────────────────────────────────────
function TimelinePoint({
  event,
  isSelected,
  onClick,
}: {
  event: TimelineEvent;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 min-w-[80px] sm:min-w-[100px] px-2 py-2
        rounded-lg transition-all duration-300 cursor-pointer group
        ${isSelected
          ? 'bg-white shadow-lg scale-105 ring-2'
          : 'hover:bg-white/60 hover:shadow-md'
        }
      `}
      style={isSelected ? { ringColor: event.color } : undefined}
      aria-label={`Evento de ${event.year}: ${event.title}`}
    >
      {/* Year label */}
      <span className={`text-xs font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
        {event.year}
      </span>

      {/* Colored dot with icon */}
      <div
        className={`
          w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
          text-lg sm:text-xl transition-all duration-300
          ${isSelected ? 'scale-110 shadow-lg' : 'group-hover:scale-105'}
        `}
        style={{
          backgroundColor: `${event.color}20`,
          border: `2.5px solid ${event.color}`,
          boxShadow: isSelected ? `0 0 0 3px ${event.color}30` : undefined,
        }}
      >
        {event.icon}
      </div>

      {/* Short title */}
      <span className={`
        text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[80px] sm:max-w-[100px]
        ${isSelected ? 'text-gray-900' : 'text-gray-500'}
      `}>
        {event.title.length > 25 ? event.title.substring(0, 22) + '...' : event.title}
      </span>
    </button>
  );
}

// ─── Detail Panel ───────────────────────────────────────────────────────────
function DetailPanel({ event }: { event: TimelineEvent }) {
  const fiscalContext = getFiscalContext(event.year);
  const dbggContext = getDbggContext(event.year);

  return (
    <Card className="overflow-hidden border-t-4" style={{ borderTopColor: event.color }}>
      <CardContent className="pt-5 pb-5 px-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${event.color}20`, border: `2px solid ${event.color}` }}
          >
            {event.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs font-bold px-2"
                style={{ borderColor: event.color, color: event.color }}
              >
                {event.year}
              </Badge>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {event.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Impact callout */}
        <div
          className="rounded-lg p-3 mb-4 border-l-4"
          style={{
            backgroundColor: '#fef3c7',
            borderLeftColor: '#f59e0b',
          }}
        >
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider mt-0.5">
              Impacto
            </span>
            <p className="text-sm text-amber-900 leading-relaxed">
              {event.impact}
            </p>
          </div>
        </div>

        {/* Fiscal context */}
        {(fiscalContext || dbggContext) && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Dados Fiscais do Período
            </p>
            {fiscalContext && (
              <p className="text-xs text-gray-700">{fiscalContext}</p>
            )}
            {dbggContext && (
              <p className="text-xs text-gray-700 mt-1">{dbggContext}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TimelineSection() {
  const [selectedIndex, setSelectedIndex] = useState(timelineEvents.length - 1); // Default to latest
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedEvent = timelineEvents[selectedIndex];

  // Scroll to selected item on change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const buttons = container.querySelectorAll('button');
      if (buttons[selectedIndex]) {
        const btn = buttons[selectedIndex] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handlePrev = () => {
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  const handleNext = () => {
    setSelectedIndex(Math.min(timelineEvents.length - 1, selectedIndex + 1));
  };

  return (
    <section id="linha-do-tempo" className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#D4A017' }}>
            <Clock className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Linha do Tempo Narrativa
            </h2>
            <p className="text-sm text-gray-500">
              A história das contas públicas brasileiras de 2018 a 2025
            </p>
          </div>
        </div>
      </div>

      {/* Timeline - Horizontal on desktop, scrollable on mobile */}
      <div className="relative">
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Evento anterior"
        >
          <ChevronLeft className="size-4 text-gray-600" />
        </button>
        <button
          onClick={handleNext}
          disabled={selectedIndex === timelineEvents.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo evento"
        >
          <ChevronRight className="size-4 text-gray-600" />
        </button>

        {/* Scrollable timeline */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-thin px-8 py-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="relative flex items-start min-w-max">
            {/* Connecting line */}
            <div className="absolute top-[46px] sm:top-[52px] left-0 right-0 h-0.5 bg-gray-300" />

            {/* Event points */}
            {timelineEvents.map((event, index) => (
              <div key={event.year} className="relative z-10">
                <TimelinePoint
                  event={event}
                  isSelected={index === selectedIndex}
                  onClick={() => setSelectedIndex(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel for selected event */}
      <div className="mt-4">
        <DetailPanel event={selectedEvent} />
      </div>

      {/* Year range indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {timelineEvents.map((event, index) => (
          <button
            key={event.year}
            onClick={() => setSelectedIndex(index)}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${index === selectedIndex ? 'scale-125' : 'opacity-50 hover:opacity-80'}
            `}
            style={{ backgroundColor: event.color }}
            aria-label={`Ir para ${event.year}`}
          />
        ))}
      </div>
    </section>
  );
}
