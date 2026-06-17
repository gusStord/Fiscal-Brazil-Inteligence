'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  fiscalData,
  years,
  formatCompact,
  getVariation,
  toPerCapita,
  sphereColors,
} from '@/lib/brazil-data';
import type { YearlyData } from '@/lib/brazil-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Filter,
  Users,
  DollarSign,
  BarChart3,
  X,
} from 'lucide-react';

// Dynamic import for heavy chart component (reduces compilation memory)
const DespesasCharts = dynamic(() => import('./DespesasCharts'), { ssr: false });

// ─── Color Palette ──────────────────────────────────────────────────────────
const RED = '#E74C3C';
const ORANGE = '#F39C12';
const GREEN = '#009C3B';
const BLUE = '#002776';

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatBi(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(2)} tri`;
  if (Math.abs(value) >= 1_000) return `R$ ${(value / 1_000).toFixed(1)} bi`;
  return `R$ ${value.toFixed(0)} mi`;
}

// ─── Type for sphere filter ─────────────────────────────────────────────────
type SphereFilter = 'todas' | 'federal' | 'estadual' | 'municipal';
type ViewMode = 'total' | 'percapita';

const sphereLabels: Record<SphereFilter, string> = {
  todas: 'Todas',
  federal: 'Federal',
  estadual: 'Estadual',
  municipal: 'Municipal',
};

// ─── Per-sphere data helpers (IBGE CIG) ─────────────────────────────────────
function getSphereRemuneracao(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.remuneracao_federal;
    case 'estadual': return data.remuneracao_estadual;
    case 'municipal': return data.remuneracao_municipal;
    default: return data.remuneracao_empregados;
  }
}

function getSphereUsoBens(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.uso_bens_federal;
    case 'estadual': return data.uso_bens_estadual;
    case 'municipal': return data.uso_bens_municipal;
    default: return data.uso_bens_servicos;
  }
}

function getSphereJurosDespesa(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.juros_despesa_federal;
    case 'estadual': return data.juros_despesa_estadual;
    case 'municipal': return data.juros_despesa_municipal;
    default: return data.juros_despesa;
  }
}

function getSphereSubsidios(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.subsidios_federal;
    case 'estadual': return data.subsidios_estadual;
    case 'municipal': return data.subsidios_municipal;
    default: return data.subsidios;
  }
}

function getSphereBeneficios(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.beneficios_federal;
    case 'estadual': return data.beneficios_estadual;
    case 'municipal': return data.beneficios_municipal;
    default: return data.beneficios_sociais;
  }
}

function getSphereFbcf(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.fbcf_federal;
    case 'estadual': return data.fbcf_estadual;
    case 'municipal': return data.fbcf_municipal;
    default: return data.fbcf;
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function DespesasPage() {
  const [sphereFilter, setSphereFilter] = useState<SphereFilter>('todas');
  const [viewMode, setViewMode] = useState<ViewMode>('total');

  // Helper to get despesa value based on sphere filter
  const getDespesa = useCallback(
    (data: YearlyData): number => {
      switch (sphereFilter) {
        case 'federal': return data.despesa_federal;
        case 'estadual': return data.despesa_estadual;
        case 'municipal': return data.despesa_municipal;
        default: return data.despesa_total;
      }
    },
    [sphereFilter]
  );

  // Apply per capita if needed
  const applyView = useCallback(
    (value: number, year: number): number => {
      if (viewMode === 'percapita') return toPerCapita(value, year);
      return value;
    },
    [viewMode]
  );

  const viewSuffix = viewMode === 'percapita' ? '/hab' : '';

  // ─── Section 3: KEY CHART - Consumo de Governo vs Investimento Público ────
  const consumoInvestData = useMemo(() => {
    return years.map((y, idx) => {
      const d = fiscalData[y];
      const remuneracao = getSphereRemuneracao(d, sphereFilter);
      const usoBens = getSphereUsoBens(d, sphereFilter);
      const consumoGoverno = remuneracao + usoBens;
      const investimento = getSphereFbcf(d, sphereFilter);

      let consumoGrowth = 0;
      let investimentoGrowth = 0;
      if (idx > 0) {
        const prev = fiscalData[years[idx - 1]];
        const prevRemuneracao = getSphereRemuneracao(prev, sphereFilter);
        const prevUsoBens = getSphereUsoBens(prev, sphereFilter);
        const prevConsumo = prevRemuneracao + prevUsoBens;
        const prevInvestimento = getSphereFbcf(prev, sphereFilter);
        consumoGrowth = getVariation(prevConsumo, consumoGoverno);
        investimentoGrowth = getVariation(prevInvestimento, investimento);
      }

      const despesaRef = getDespesa(d);
      return {
        year: y,
        consumo_governo: applyView(consumoGoverno, y),
        investimento_publico: applyView(investimento, y),
        consumo_growth: consumoGrowth,
        investimento_growth: investimentoGrowth,
        consumo_pct_despesa: (consumoGoverno / despesaRef) * 100,
        investimento_pct_despesa: (investimento / despesaRef) * 100,
      };
    });
  }, [applyView, getDespesa, sphereFilter]);

  // ─── Section 4: Despesa Composition Breakdown (Stacked Bar) ──────────────
  const compositionData = useMemo(() => {
    return years.map((y) => {
      const d = fiscalData[y];
      return {
        year: y,
        remuneracao: applyView(getSphereRemuneracao(d, sphereFilter), y),
        juros: applyView(getSphereJurosDespesa(d, sphereFilter), y),
        beneficios_sociais: applyView(getSphereBeneficios(d, sphereFilter), y),
        bens_servicos: applyView(getSphereUsoBens(d, sphereFilter), y),
        subsidios: applyView(getSphereSubsidios(d, sphereFilter), y),
        fbcf: applyView(getSphereFbcf(d, sphereFilter), y),
        outras: applyView(d.outras_despesas, y),
      };
    });
  }, [applyView, sphereFilter]);

  // ─── Section 5: CIG Waterfall Data (Produção → CI → VAB) ────────────────
  const cigData = useMemo(() => {
    return years.map((y) => ({
      year: y,
      producao: applyView(fiscalData[y].producao, y),
      consumo_intermediario: applyView(fiscalData[y].consumo_intermediario, y),
      vab_pib: applyView(fiscalData[y].vab_pib, y),
      ci_pct_producao: (fiscalData[y].consumo_intermediario / fiscalData[y].producao) * 100,
      vab_pct_producao: (fiscalData[y].vab_pib / fiscalData[y].producao) * 100,
    }));
  }, [applyView]);

  const waterfallData = useMemo(() => {
    const d = fiscalData[2023];
    const producao = applyView(d.producao, 2023);
    const ci = applyView(d.consumo_intermediario, 2023);
    const vab = applyView(d.vab_pib, 2023);

    return [
      { name: 'Produção', value: producao, fill: BLUE },
      { name: 'Consumo Interm.', value: -ci, fill: RED },
      { name: 'VAB/PIB', value: vab, fill: GREEN },
    ];
  }, [applyView]);

  // ─── Section 6: Benefícios Sociais Deep Dive ─────────────────────────────
  const beneficiosData = useMemo(() => {
    return years.map((y) => {
      const d = fiscalData[y];
      const despesaRef = getDespesa(d);
      const beneficiosTotal = getSphereBeneficios(d, sphereFilter);
      const segProportion = d.beneficios_seguridade / (d.beneficios_seguridade + d.beneficios_assistencia || 1);
      const beneficiosSeg = beneficiosTotal * segProportion;
      const beneficiosAssist = beneficiosTotal * (1 - segProportion);
      return {
        year: y,
        beneficios_seguridade: applyView(beneficiosSeg, y),
        beneficios_assistencia: applyView(beneficiosAssist, y),
        pct_seguridade: (beneficiosSeg / despesaRef) * 100,
        pct_assistencia: (beneficiosAssist / despesaRef) * 100,
        pct_total: (beneficiosTotal / despesaRef) * 100,
      };
    });
  }, [applyView, getDespesa, sphereFilter]);

  // ─── Section 7: Despesa by Sphere (Donut for latest year) ────────────────
  const sphereDonutData = useMemo(() => {
    const d = fiscalData[2023];
    return [
      {
        name: 'Federal',
        value: applyView(d.despesa_federal, 2023),
        color: sphereColors.federal.primary,
      },
      {
        name: 'Estadual',
        value: applyView(d.despesa_estadual, 2023),
        color: sphereColors.estadual.primary,
      },
      {
        name: 'Municipal',
        value: applyView(d.despesa_municipal, 2023),
        color: sphereColors.municipal.primary,
      },
    ];
  }, [applyView]);

  const sphereDonutTotal = useMemo(
    () => sphereDonutData.reduce((s, d) => s + d.value, 0),
    [sphereDonutData]
  );

  // ─── KPI Cards Data ──────────────────────────────────────────────────────
  const kpiData = useMemo(() => {
    const latest = fiscalData[2023];
    const prev = fiscalData[2022];
    const remuneracaoLatest = getSphereRemuneracao(latest, sphereFilter);
    const usoBensLatest = getSphereUsoBens(latest, sphereFilter);
    const consumoGoverno = remuneracaoLatest + usoBensLatest;
    const remuneracaoPrev = getSphereRemuneracao(prev, sphereFilter);
    const usoBensPrev = getSphereUsoBens(prev, sphereFilter);
    const prevConsumo = remuneracaoPrev + usoBensPrev;
    const fbcfLatest = getSphereFbcf(latest, sphereFilter);
    const fbcfPrev = getSphereFbcf(prev, sphereFilter);
    const benefLatest = getSphereBeneficios(latest, sphereFilter);
    const benefPrev = getSphereBeneficios(prev, sphereFilter);
    const despesaTotal = getDespesa(latest);
    const prevDespesaTotal = getDespesa(prev);

    return [
      {
        title: 'Despesa Total',
        value: formatBi(applyView(despesaTotal, 2023)),
        variation: getVariation(prevDespesaTotal, despesaTotal),
        icon: <CreditCard className="size-4" />,
        color: RED,
        isDespesaTotal: true,
      },
      {
        title: 'Consumo de Governo',
        value: formatBi(applyView(consumoGoverno, 2023)),
        variation: getVariation(prevConsumo, consumoGoverno),
        icon: <BarChart3 className="size-4" />,
        color: ORANGE,
        isDespesaTotal: false,
      },
      {
        title: 'Investimento (FBCF)',
        value: formatBi(applyView(fbcfLatest, 2023)),
        variation: getVariation(fbcfPrev, fbcfLatest),
        icon: <TrendingUp className="size-4" />,
        color: GREEN,
        isDespesaTotal: false,
      },
      {
        title: 'Benefícios Sociais',
        value: formatBi(applyView(benefLatest, 2023)),
        variation: getVariation(benefPrev, benefLatest),
        icon: <Users className="size-4" />,
        color: BLUE,
        isDespesaTotal: false,
      },
    ];
  }, [applyView, getDespesa, sphereFilter]);

  // Y-axis formatter depending on view mode
  const yAxisFormatter = useCallback(
    (value: number) => {
      if (viewMode === 'percapita') {
        if (Math.abs(value) >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
        return `R$ ${value.toFixed(0)}`;
      }
      return formatCompact(value);
    },
    [viewMode]
  );

  // Sphere filter button style helper
  const sphereBtnStyle = (sphere: SphereFilter, isActive: boolean): React.CSSProperties => {
    if (!isActive) return {};
    const colorMap: Record<SphereFilter, string> = {
      todas: '#374151',
      federal: sphereColors.federal.primary,
      estadual: sphereColors.estadual.primary,
      municipal: sphereColors.municipal.primary,
    };
    return { backgroundColor: colorMap[sphere], color: 'white', borderColor: colorMap[sphere] };
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: Page Header
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="scroll-mt-24" id="top">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-xl flex-shrink-0"
            style={{ backgroundColor: `${RED}15` }}
          >
            <CreditCard className="size-7" style={{ color: RED }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Despesas Públicas
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Análise de Consumo Intermediário vs. Benefícios Sociais — evolução da despesa pública brasileira de 2018 a 2023
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: Interactive Filters
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {/* Sphere Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground mr-1">Esfera:</span>
          {(['todas', 'federal', 'estadual', 'municipal'] as SphereFilter[]).map((sphere) => {
            const labels: Record<SphereFilter, string> = {
              todas: 'Todas',
              federal: 'Federal',
              estadual: 'Estadual',
              municipal: 'Municipal',
            };
            const isActive = sphereFilter === sphere;
            return (
              <Button
                key={sphere}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7 px-3 transition-all"
                style={sphereBtnStyle(sphere, isActive)}
                onClick={() => setSphereFilter(sphere)}
              >
                {labels[sphere]}
              </Button>
            );
          })}
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground mr-1">Modo:</span>
          <Button
            variant={viewMode === 'total' ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 px-3"
            style={viewMode === 'total' ? { backgroundColor: '#374151', color: 'white' } : {}}
            onClick={() => setViewMode('total')}
          >
            Valores Totais
          </Button>
          <Button
            variant={viewMode === 'percapita' ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 px-3"
            style={viewMode === 'percapita' ? { backgroundColor: '#374151', color: 'white' } : {}}
            onClick={() => setViewMode('percapita')}
          >
            <Users className="size-3 mr-1" />
            Per Capita
          </Button>
        </div>
      </section>

      {/* Sphere filter active indicator */}
      {sphereFilter !== 'todas' && (
        <div
          className="flex items-center gap-2 p-2.5 rounded-lg border"
          style={{
            backgroundColor: `${sphereColors[sphereFilter].primary}10`,
            borderColor: `${sphereColors[sphereFilter].primary}30`,
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: sphereColors[sphereFilter].primary }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: sphereColors[sphereFilter].primary }}
          >
            Filtrando: {sphereLabels[sphereFilter]}
          </span>
          <span className="text-[10px] text-muted-foreground ml-1">
            {'\u2014'} Dados reais por esfera {'\u2014'} Fonte: IBGE/CIG
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-5 px-2 text-[10px] gap-1"
            onClick={() => setSphereFilter('todas')}
          >
            <X className="size-3" />
            Limpar filtro
          </Button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-medium text-muted-foreground truncate">{kpi.title}</span>
                  {kpi.isDespesaTotal && sphereFilter !== 'todas' && (
                    <Badge
                      variant="outline"
                      className="text-[9px] h-4 px-1.5 flex-shrink-0"
                      style={{
                        borderColor: sphereColors[sphereFilter].primary,
                        color: sphereColors[sphereFilter].primary,
                      }}
                    >
                      {sphereLabels[sphereFilter]}
                    </Badge>
                  )}
                </div>
                <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${kpi.color}15` }}>
                  <span style={{ color: kpi.color }}>{kpi.icon}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              {!kpi.isDespesaTotal && sphereFilter !== 'todas' && (
                <p className="text-[9px] text-muted-foreground/60 italic mt-0.5">
                  Fonte: IBGE/CIG
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                {kpi.variation > 0 ? (
                  <TrendingUp className="size-3" style={{ color: kpi.color === GREEN ? GREEN : RED }} />
                ) : (
                  <TrendingDown className="size-3" style={{ color: GREEN }} />
                )}
                <span
                  className="text-[11px] font-medium"
                  style={{
                    color: (kpi.variation > 0 && kpi.color !== GREEN) ? RED : GREEN,
                  }}
                >
                  {kpi.variation > 0 ? '+' : ''}{kpi.variation.toFixed(1)}% vs 2022
                </span>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: kpi.color }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Chart sections - dynamically loaded to reduce compilation memory */}
      <DespesasCharts
        sphereFilter={sphereFilter}
        viewMode={viewMode}
        consumoInvestData={consumoInvestData}
        compositionData={compositionData}
        cigData={cigData}
        waterfallData={waterfallData}
        beneficiosData={beneficiosData}
        sphereDonutData={sphereDonutData}
        sphereDonutTotal={sphereDonutTotal}
        yAxisFormatter={yAxisFormatter}
        applyView={applyView}
      />
    </main>
  );
}
