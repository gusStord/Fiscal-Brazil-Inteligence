'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import DataFreshnessBanner from '@/components/dashboard/DataFreshnessBanner';
import KPISection from '@/components/dashboard/KPISection';
import GovCentralSection from '@/components/dashboard/GovCentralSection';
import TimelineSection from '@/components/dashboard/TimelineSection';
import AnalysisSection from '@/components/dashboard/AnalysisSection';
import QuizSection from '@/components/dashboard/QuizSection';
import CuriositiesSection from '@/components/dashboard/CuriositiesSection';
import IndicesSection from '@/components/dashboard/IndicesSection';
import FatoDoDia from '@/components/dashboard/FatoDoDia';
import PerCapitaCard from '@/components/dashboard/PerCapitaCard';
import SectionAnchor from '@/components/dashboard/SectionAnchor';
import { Separator } from '@/components/ui/separator';

// Heavy components loaded dynamically to reduce cold start bundle size
const ChartsSection = dynamic(() => import('@/components/dashboard/ChartsSection'), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />,
  ssr: false,
});

const InternationalComparisonSection = dynamic(() => import('@/components/dashboard/InternationalComparisonSection'), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />,
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Data Freshness Banner - 2024-2025 update */}
      <DataFreshnessBanner />

      {/* Section 1: Executive View with KPIs */}
      <section id="kpis" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900 group">
            Visão Executiva
            <SectionAnchor id="kpis" />
          </h2>
        </div>
        <KPISection />
      </section>

      <Separator className="my-2" />

      {/* Fato do Dia */}
      <FatoDoDia />

      <Separator className="my-2" />

      {/* Section 2: Charts */}
      <section id="graficos" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900 group">
            Análise Visual
            <SectionAnchor id="graficos" />
          </h2>
        </div>
        <ChartsSection />
      </section>

      <Separator className="my-2" />

      {/* Section 2b: Government Central 2024-2025 */}
      <GovCentralSection />

      <Separator className="my-2" />

      {/* Section 2c: International Comparison (Expanded) */}
      <InternationalComparisonSection />

      <Separator className="my-2" />

      {/* Section 3: Narrative Timeline */}
      <TimelineSection />

      <Separator className="my-2" />

      {/* Per Capita Spending Card */}
      <PerCapitaCard />

      <Separator className="my-2" />

      {/* Section 4: Intelligent Analysis — hidden in classroom mode */}
      <div className="classroom-hide">
        <AnalysisSection />
      </div>

      <Separator className="my-2 classroom-hide" />

      {/* Section 5: Interactive Quiz — hidden in classroom mode */}
      <div id="quiz" className="classroom-hide scroll-mt-24">
        <QuizSection />
      </div>

      <Separator className="my-2 classroom-hide" />

      {/* Section 6: Curiosities — hidden in classroom mode */}
      <div className="classroom-hide">
        <CuriositiesSection />
      </div>

      <Separator className="my-2 classroom-hide" />

      {/* Section 7: Composite Indices */}
      <IndicesSection />
    </main>
  );
}
