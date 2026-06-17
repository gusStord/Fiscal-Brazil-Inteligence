'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy chart components (reduces compilation memory)
const DespesasCharts1 = dynamic(() => import('./DespesasCharts1'), { ssr: false });
const DespesasCharts2 = dynamic(() => import('./DespesasCharts2'), { ssr: false });

import type { SphereFilter, ViewMode } from './despesas-helpers';

// ─── Props ──────────────────────────────────────────────────────────────────
interface DespesasChartsProps {
  sphereFilter: SphereFilter;
  viewMode: ViewMode;
  consumoInvestData: any[];
  compositionData: any[];
  cigData: any[];
  waterfallData: any[];
  beneficiosData: any[];
  sphereDonutData: any[];
  sphereDonutTotal: number;
  yAxisFormatter: (value: number) => string;
  applyView: (value: number, year: number) => number;
}

export default function DespesasCharts({
  sphereFilter,
  viewMode,
  consumoInvestData,
  compositionData,
  cigData,
  waterfallData,
  beneficiosData,
  sphereDonutData,
  sphereDonutTotal,
  yAxisFormatter,
  applyView,
}: DespesasChartsProps) {
  return (
    <>
      <DespesasCharts1
        sphereFilter={sphereFilter}
        viewMode={viewMode}
        consumoInvestData={consumoInvestData}
        compositionData={compositionData}
        cigData={cigData}
        waterfallData={waterfallData}
        yAxisFormatter={yAxisFormatter}
        applyView={applyView}
      />
      <DespesasCharts2
        sphereFilter={sphereFilter}
        viewMode={viewMode}
        beneficiosData={beneficiosData}
        sphereDonutData={sphereDonutData}
        sphereDonutTotal={sphereDonutTotal}
        yAxisFormatter={yAxisFormatter}
        applyView={applyView}
      />
    </>
  );
}
