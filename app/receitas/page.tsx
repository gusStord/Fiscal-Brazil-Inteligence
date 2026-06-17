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
  formatPerCapita,
  sphereColors,
  populationData,
  type YearlyData,
} from '@/lib/brazil-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Filter,
  Info,
  Home,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  X,
} from 'lucide-react';

// Dynamic import for heavy chart component (reduces compilation memory)
const ReceitasCharts = dynamic(() => import('./ReceitasCharts'), { ssr: false });

// ─── Constants ──────────────────────────────────────────────────────────────
const COLORS = {
  green: '#009C3B',
  yellow: '#FFDF00',
  blue: '#002776',
  red: '#E74C3C',
  lightGreen: '#22c55e',
  darkGreen: '#15803d',
  lightBlue: '#3b82f6',
  gold: '#D4A017',
};

type SphereFilter = 'todas' | 'federal' | 'estadual' | 'municipal';

// ─── Sphere Filter Buttons ──────────────────────────────────────────────────
function SphereFilterButtons({
  active,
  onChange,
}: {
  active: SphereFilter;
  onChange: (s: SphereFilter) => void;
}) {
  const filters: { key: SphereFilter; label: string; color: string }[] = [
    { key: 'todas', label: 'Todas', color: '#6b7280' },
    { key: 'federal', label: 'Federal', color: sphereColors.federal.primary },
    { key: 'estadual', label: 'Estadual', color: sphereColors.estadual.primary },
    { key: 'municipal', label: 'Municipal', color: sphereColors.municipal.primary },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <Button
          key={f.key}
          variant={active === f.key ? 'default' : 'outline'}
          size="sm"
          className="transition-all duration-200"
          style={
            active === f.key
              ? { backgroundColor: f.color, borderColor: f.color, color: f.key === 'todas' ? 'white' : 'white' }
              : { borderColor: f.color, color: f.color }
          }
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}

// ─── KPI Card Mini ──────────────────────────────────────────────────────────
function MiniKPICard({
  title,
  value,
  variation,
  icon,
  color,
  tooltip,
  badge,
}: {
  title: string;
  value: string;
  variation?: number;
  icon: React.ReactNode;
  color: string;
  tooltip?: string;
  badge?: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
      <CardContent className="pl-5 py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              {title}
              {tooltip && (
                <span className="ml-1 inline-flex items-center" title={tooltip}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-gray-400 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </p>
            {badge}
            <p className="text-xl font-bold tracking-tight">{value}</p>
            {variation !== undefined && (
              <div className="flex items-center gap-1">
                {variation >= 0 ? (
                  <TrendingUp className="size-3 text-green-600" />
                ) : (
                  <TrendingDown className="size-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    variation >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {variation >= 0 ? '+' : ''}
                  {variation.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div
            className="size-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Per-sphere data helpers (IBGE CIG) ─────────────────────────────────────
function getSphereImpostos(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.impostos_federal;
    case 'estadual': return data.impostos_estadual;
    case 'municipal': return data.impostos_municipal;
    default: return data.impostos_total;
  }
}

function getSphereContrib(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.contrib_sociais_federal;
    case 'estadual': return data.contrib_sociais_estadual;
    case 'municipal': return data.contrib_sociais_municipal;
    default: return data.contrib_sociais;
  }
}

function getSphereJurosReceita(data: YearlyData, sphere: SphereFilter): number {
  switch (sphere) {
    case 'federal': return data.juros_receita_federal;
    case 'estadual': return data.juros_receita_estadual;
    case 'municipal': return data.juros_receita_municipal;
    default: return data.juros_receita;
  }
}

// ─── Waterfall Chart Data Builder ──────────────────────────────────────────
function buildWaterfallData(year: number, perCapita: boolean, sphereFilter: SphereFilter = 'todas') {
  const d = fiscalData[year];
  if (!d) return [];

  const fmt = (v: number) => (perCapita ? toPerCapita(v, year) : v);

  const getSphereReceita = (data: YearlyData, sphere: SphereFilter): number => {
    switch (sphere) {
      case 'federal': return data.receita_federal;
      case 'estadual': return data.receita_estadual;
      case 'municipal': return data.receita_municipal;
      default: return data.receita_total;
    }
  };

  const baseReceita = getSphereReceita(d, sphereFilter);
  const impostosRaw = getSphereImpostos(d, sphereFilter);
  const contribRaw = getSphereContrib(d, sphereFilter);
  const jurosRaw = getSphereJurosReceita(d, sphereFilter);
  const receitaLiquidaRaw = baseReceita - impostosRaw - contribRaw - jurosRaw;

  const receitaTotal = fmt(baseReceita);
  const impostos = fmt(impostosRaw);
  const contrib = fmt(contribRaw);
  const juros = fmt(jurosRaw);
  const receitaLiquida = fmt(receitaLiquidaRaw);

  return [
    { name: 'Receita Total', base: 0, value: receitaTotal, display: receitaTotal, fill: COLORS.green, type: 'positive' as const },
    { name: '(-) Impostos', base: receitaTotal - impostos, value: impostos, display: -impostos, fill: '#ef4444', type: 'negative' as const },
    { name: '(-) Contrib. Sociais', base: receitaTotal - impostos - contrib, value: contrib, display: -contrib, fill: '#f97316', type: 'negative' as const },
    { name: '(-) Juros Rec.', base: receitaTotal - impostos - contrib - juros, value: juros, display: -juros, fill: '#eab308', type: 'negative' as const },
    { name: '(=) Rec. Líquida', base: 0, value: receitaLiquida, display: receitaLiquida, fill: COLORS.blue, type: 'result' as const },
  ];
}

// ─── Main Page Component ────────────────────────────────────────────────────
export default function ReceitasPage() {
  const [sphereFilter, setSphereFilter] = useState<SphereFilter>('todas');
  const [perCapita, setPerCapita] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  const getReceitaBySphere = useCallback((data: YearlyData, sphere: SphereFilter): number => {
    switch (sphere) {
      case 'federal': return data.receita_federal;
      case 'estadual': return data.receita_estadual;
      case 'municipal': return data.receita_municipal;
      default: return data.receita_total;
    }
  }, []);

  const sphereLabel = sphereFilter === 'federal' ? 'Federal' : sphereFilter === 'estadual' ? 'Estadual' : sphereFilter === 'municipal' ? 'Municipal' : 'Todas';
  const activeSphereColor = sphereFilter !== 'todas' ? sphereColors[sphereFilter as keyof typeof sphereColors].primary : '#6b7280';

  const currentData = useMemo(() => fiscalData[selectedYear], [selectedYear]);

  const waterfallData = useMemo(
    () => buildWaterfallData(selectedYear, perCapita, sphereFilter),
    [selectedYear, perCapita, sphereFilter]
  );

  const compositionData = useMemo(() => {
    return years.map((y) => {
      const d = fiscalData[y];
      if (!d) return { year: y };
      const impVal = getSphereImpostos(d, sphereFilter);
      const contribVal = getSphereContrib(d, sphereFilter);
      const jurosVal = getSphereJurosReceita(d, sphereFilter);
      if (perCapita) {
        return { year: y, impostos: toPerCapita(impVal, y), contrib_sociais: toPerCapita(contribVal, y), juros_receita: toPerCapita(jurosVal, y) };
      }
      return { year: y, impostos: impVal, contrib_sociais: contribVal, juros_receita: jurosVal };
    });
  }, [perCapita, sphereFilter]);

  const sphereBarData = useMemo(() => {
    const spheres: { key: string; recKey: keyof typeof fiscalData[2018] }[] = [
      { key: 'federal', recKey: 'receita_federal' },
      { key: 'estadual', recKey: 'receita_estadual' },
      { key: 'municipal', recKey: 'receita_municipal' },
    ];
    const filtered = sphereFilter === 'todas' ? spheres : spheres.filter((s) => s.key === sphereFilter);
    return years.map((y) => {
      const d = fiscalData[y];
      if (!d) return { year: y };
      const entry: Record<string, number | string> = { year: y };
      for (const s of filtered) {
        const raw = d[s.recKey] as number;
        entry[s.key] = perCapita ? toPerCapita(raw, y) : raw;
      }
      return entry;
    });
  }, [sphereFilter, perCapita]);

  const taxBurdenData = useMemo(() => {
    return years.map((y) => {
      const d = fiscalData[y];
      if (!d) return { year: y, taxBurden: 0 };
      if (sphereFilter !== 'todas') {
        const impVal = getSphereImpostos(d, sphereFilter);
        const recVal = getReceitaBySphere(d, sphereFilter);
        return { year: y, taxBurden: recVal > 0 ? (impVal / recVal) * 100 : 0 };
      }
      return { year: y, taxBurden: (d.impostos_total / d.receita_total) * 100 };
    });
  }, [sphereFilter, getReceitaBySphere]);

  const perCapitaTableData = useMemo(() => {
    return years.map((y) => {
      const d = fiscalData[y];
      if (!d) return null;
      const pop = populationData[y] || 214_300_000;
      const sphereRec = getReceitaBySphere(d, sphereFilter);
      const recPerCapita = toPerCapita(sphereRec, y);
      const impPerCapita = toPerCapita(getSphereImpostos(d, sphereFilter), y);
      const contribPerCapita = toPerCapita(getSphereContrib(d, sphereFilter), y);
      const prevYear = years[years.indexOf(y) - 1];
      const prevData = prevYear ? fiscalData[prevYear] : null;
      const variation = prevData
        ? getVariation(toPerCapita(getReceitaBySphere(prevData, sphereFilter), prevYear), recPerCapita)
        : 0;
      return { year: y, recPerCapita, impPerCapita, contribPerCapita, variation, population: pop };
    }).filter(Boolean);
  }, [sphereFilter, getReceitaBySphere]);

  const kpiVariation = useMemo(() => {
    const idx = years.indexOf(selectedYear);
    if (idx <= 0) return undefined;
    const prev = fiscalData[years[idx - 1]];
    const curr = fiscalData[selectedYear];
    if (!prev || !curr) return undefined;
    const prevRec = getReceitaBySphere(prev, sphereFilter);
    const currRec = getReceitaBySphere(curr, sphereFilter);
    return getVariation(prevRec, currRec);
  }, [selectedYear, sphereFilter, getReceitaBySphere]);

  const formatValue = (v: number) => {
    if (perCapita) return formatPerCapita(v);
    return formatCompact(v);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. PAGE HEADER */}
      <section id="top" className="scroll-mt-24 space-y-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="flex items-center gap-1 hover:text-[#002776] transition-colors">
            <Home className="size-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">Receitas</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.green}15`, color: COLORS.green }}
              >
                <DollarSign className="size-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Receitas &amp; Arrecadação
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Detalhamento da arrecadação e carga tributária do Governo Geral
            </p>
          </div>
          <Badge
            className="self-start sm:ml-auto text-xs font-semibold px-3 py-1 shadow-sm"
            style={{ backgroundColor: COLORS.green, color: 'white', borderColor: COLORS.green }}
          >
            2018-2023
          </Badge>
        </div>
      </section>

      {/* 2. INTERACTIVE FILTERS BAR */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Filter className="size-3" />
                Esfera
              </div>
              <SphereFilterButtons active={sphereFilter} onChange={setSphereFilter} />
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-12" />

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Users className="size-3" />
                Visualização
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium transition-colors ${!perCapita ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Valores Totais
                </span>
                <Switch checked={perCapita} onCheckedChange={setPerCapita} />
                <span className={`text-sm font-medium transition-colors ${perCapita ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Per Capita
                </span>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-12" />

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Activity className="size-3" />
                Ano
              </div>
              <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sphere filter active indicator */}
      {sphereFilter !== 'todas' && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ backgroundColor: `${activeSphereColor}10`, borderColor: `${activeSphereColor}40` }}>
          <div className="size-2.5 rounded-full" style={{ backgroundColor: activeSphereColor }} />
          <span className="text-sm font-medium" style={{ color: activeSphereColor }}>
            Filtro ativo: {sphereLabel}
          </span>
          <span className="text-[10px] text-muted-foreground ml-1">
            {'\u2014'} Fonte: IBGE/CIG
          </span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs ml-1" onClick={() => setSphereFilter('todas')}>
            <X className="size-3 mr-1" />
            Limpar filtro
          </Button>
        </div>
      )}

      {/* Mini KPI cards */}
      {currentData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniKPICard
            title={sphereFilter === 'todas' ? 'Receita Total' : `Receita ${sphereLabel}`}
            value={perCapita ? formatPerCapita(toPerCapita(getReceitaBySphere(currentData, sphereFilter), selectedYear)) : formatCompact(getReceitaBySphere(currentData, sphereFilter))}
            variation={kpiVariation}
            icon={<DollarSign className="size-5" />}
            color={COLORS.green}
            badge={sphereFilter !== 'todas' ? <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderColor: activeSphereColor, color: activeSphereColor }}>{sphereLabel}</Badge> : undefined}
          />
          <MiniKPICard
            title="Impostos"
            value={perCapita ? formatPerCapita(toPerCapita(getSphereImpostos(currentData, sphereFilter), selectedYear)) : formatCompact(getSphereImpostos(currentData, sphereFilter))}
            variation={
              selectedYear > 2018
                ? getVariation(
                    getSphereImpostos(fiscalData[years[years.indexOf(selectedYear) - 1]] || currentData, sphereFilter),
                    getSphereImpostos(currentData, sphereFilter)
                  )
                : undefined
            }
            icon={<BarChart3 className="size-5" />}
            color={COLORS.blue}
            badge={sphereFilter !== 'todas' ? <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderColor: activeSphereColor, color: activeSphereColor }}>{sphereLabel}</Badge> : undefined}
          />
          <MiniKPICard
            title="Contribuições Sociais"
            value={perCapita ? formatPerCapita(toPerCapita(getSphereContrib(currentData, sphereFilter), selectedYear)) : formatCompact(getSphereContrib(currentData, sphereFilter))}
            icon={<PieChartIcon className="size-5" />}
            color={COLORS.gold}
            badge={sphereFilter !== 'todas' ? <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderColor: activeSphereColor, color: activeSphereColor }}>{sphereLabel}</Badge> : undefined}
          />
          <MiniKPICard
            title="Carga Tributária"
            value={`${(sphereFilter !== 'todas' ? (getSphereImpostos(currentData, sphereFilter) / getReceitaBySphere(currentData, sphereFilter)) * 100 : (currentData.impostos_total / currentData.receita_total) * 100).toFixed(1)}%`}
            icon={<Activity className="size-5" />}
            color={COLORS.red}
            tooltip="Percentual da receita proveniente de impostos (Impostos / Receita)"
            badge={sphereFilter !== 'todas' ? <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderColor: activeSphereColor, color: activeSphereColor }}>{sphereLabel}</Badge> : undefined}
          />
        </div>
      )}

      {/* Chart sections - dynamically loaded to reduce compilation memory */}
      <ReceitasCharts
        sphereFilter={sphereFilter}
        perCapita={perCapita}
        selectedYear={selectedYear}
        sphereLabel={sphereLabel}
        activeSphereColor={activeSphereColor}
        waterfallData={waterfallData}
        compositionData={compositionData}
        sphereBarData={sphereBarData}
        taxBurdenData={taxBurdenData}
        perCapitaTableData={perCapitaTableData as any[]}
        formatValue={formatValue}
      />
    </main>
  );
}
