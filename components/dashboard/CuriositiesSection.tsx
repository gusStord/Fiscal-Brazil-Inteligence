'use client';

import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Sparkles, BookOpen } from 'lucide-react';
import { curiosities } from '@/lib/brazil-data';

// ─── Accent Palette ──────────────────────────────────────────────────

const accentPalette = [
  { color: '#009C3B', bg: '#dcfce7', border: '#bbf7d0' },
  { color: '#FFDF00', bg: '#fefce8', border: '#fef08a' },
  { color: '#002776', bg: '#eff6ff', border: '#bfdbfe' },
  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  { color: '#009C3B', bg: '#dcfce7', border: '#bbf7d0' },
  { color: '#002776', bg: '#eff6ff', border: '#bfdbfe' },
  { color: '#FFDF00', bg: '#fefce8', border: '#fef08a' },
  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
];

// ─── Main Component ──────────────────────────────────────────────────

export default function CuriositiesSection() {
  return (
    <section id="curiosidades" className="scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: '#FFDF00' }}
        >
          <Sparkles className="size-5 text-gray-900" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Curiosidades & Fatos Relevantes
          </h2>
          <p className="text-sm text-gray-500">
            Descubra fatos surpreendentes sobre as finanças públicas brasileiras
          </p>
        </div>
      </div>

      {/* Masonry-like Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {curiosities.map((item, idx) => {
          const accent = accentPalette[idx % accentPalette.length];
          return (
            <Card
              key={idx}
              className="group relative overflow-hidden break-inside-avoid py-0 gap-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] cursor-default"
              style={{ borderLeft: `4px solid ${accent.color}` }}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  {/* Emoji Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: accent.bg }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom accent on hover */}
                <div
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: accent.color }}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
