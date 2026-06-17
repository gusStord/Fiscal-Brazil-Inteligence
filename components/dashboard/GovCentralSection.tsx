'use client';

import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  CreditCard,
  TrendingDown,
  Percent,
  Landmark,
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  gcData,
  gcMonthlyData,
  dbggData,
  fiscalFrameworkTargets,
} from '@/lib/brazil-data';
import { useLiveDataContext, DataStatusBadge } from '@/components/dashboard/LiveDataProvider';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatBi(value: number): string {
  const bi = value / 1000;
  const sign = bi < 0 ? '-' : '';
  return `${sign}R$ ${Math.abs(bi).toFixed(1)} bi`;
}

function formatBiShort(value: number): string {
  const bi = value / 1000;
  if (Math.abs(bi) >= 1) {
    return `${bi < 0 ? '-' : ''}R$ ${Math.abs(bi).toFixed(1)} bi`;
  }
  return `R$ ${value.toFixed(0)} mi`;
}

const GREEN = '#009C3B';
const RED = '#E74C3C';
const BLUE = '#002776';
const YELLOW = '#D4A017';
const ORANGE = '#F39C12';

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
interface GCTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey?: string }>;
  label?: string | number;
}

function GCMonthlyTooltip({ active, payload, label }: GCTooltipProps) {
  if (!active || !payload?.length) return null;
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthLabel = typeof label === 'number' ? monthNames[label - 1] : label;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{monthLabel}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatBiShort(p.value)}
        </p>
      ))}
    </div>
  );
}

function DBGGTooltip({ active, payload, label }: GCTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

function DBGG24MTooltip({ active, payload, label }: GCTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
interface GCKPICardData {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

function GCKPICard({ data }: { data: GCKPICardData }) {
  return (
    <Card className="relative overflow-hidden py-0 gap-0">
      <div className="h-1.5 w-full" style={{ backgroundColor: data.accentColor }} />
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {data.title}
          </span>
          <div
            className={`p-1.5 rounded-lg ${
              data.sentiment === 'positive'
                ? 'bg-green-50'
                : data.sentiment === 'negative'
                ? 'bg-red-50'
                : 'bg-blue-50'
            }`}
          >
            <span
              className={
                data.sentiment === 'positive'
                  ? 'text-green-600'
                  : data.sentiment === 'negative'
                  ? 'text-red-600'
                  : 'text-blue-600'
              }
            >
              {data.icon}
            </span>
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
          {data.value}
        </div>
        <p className="text-xs text-gray-500 mt-1">{data.subtitle}</p>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function GovCentralSection() {
  const { dbgg } = useLiveDataContext();
  const gc2024 = gcData[2024];
  const gc2025 = gcData[2025];

  // KPI cards data
  const kpiCards: GCKPICardData[] = useMemo(() => [
    {
      title: 'Receita Líquida',
      value: formatBi(gc2025.receita_liquida),
      subtitle: `2024: ${formatBi(gc2024.receita_liquida)} | +${((gc2025.receita_liquida / gc2024.receita_liquida - 1) * 100).toFixed(1)}%`,
      icon: <DollarSign className="size-4" />,
      accentColor: GREEN,
      sentiment: 'positive',
    },
    {
      title: 'Despesa Total',
      value: formatBi(gc2025.despesa_total),
      subtitle: `2024: ${formatBi(gc2024.despesa_total)} | +${((gc2025.despesa_total / gc2024.despesa_total - 1) * 100).toFixed(1)}%`,
      icon: <CreditCard className="size-4" />,
      accentColor: RED,
      sentiment: 'negative',
    },
    {
      title: 'Resultado Primário',
      value: formatBi(gc2025.resultado_primario),
      subtitle: `Meta LC 200/2023: [0.0%, 0.5%] PIB`,
      icon: <TrendingDown className="size-4" />,
      accentColor: RED,
      sentiment: 'negative',
    },
    {
      title: 'Juros Nominais',
      value: formatBi(gc2025.juros_nominais),
      subtitle: `2024: ${formatBi(gc2024.juros_nominais)} | +${((Math.abs(gc2025.juros_nominais) / Math.abs(gc2024.juros_nominais) - 1) * 100).toFixed(1)}%`,
      icon: <Percent className="size-4" />,
      accentColor: ORANGE,
      sentiment: 'negative',
    },
  ], [gc2024, gc2025]);

  // Monthly chart data
  const monthlyChartData = useMemo(() => {
    const data = [];
    for (let m = 1; m <= 12; m++) {
      const m2024 = gcMonthlyData[2024].find((d) => d.month === m);
      const m2025 = gcMonthlyData[2025].find((d) => d.month === m);
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      data.push({
        month: m,
        monthLabel: monthNames[m - 1],
        rec2024: m2024?.receita_liquida ?? 0,
        rec2025: m2025?.receita_liquida ?? 0,
        desp2024: m2024?.despesa_total ?? 0,
        desp2025: m2025?.despesa_total ?? 0,
        prim2024: m2024?.resultado_primario ?? 0,
        prim2025: m2025?.resultado_primario ?? 0,
        juros2024: m2024?.juros_nominais ?? 0,
        juros2025: m2025?.juros_nominais ?? 0,
      });
    }
    return data;
  }, []);

  // DBGG historical time series data (static, from brazil-data.ts)
  const dbggChartData = useMemo(() => {
    return Object.entries(dbggData)
      .map(([year, pct]) => ({ year: parseInt(year), dbgg: pct }))
      .sort((a, b) => a.year - b.year);
  }, []);

  // DBGG 24-month live chart data (from BCB API)
  const dbgg24MChartData = useMemo(() => {
    if (!dbgg.series || dbgg.series.length === 0) return [];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return dbgg.series.map((d) => {
      const date = new Date(d.date + 'T12:00:00');
      return {
        dateLabel: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        dbgg: d.value,
        sortKey: d.date,
      };
    });
  }, [dbgg.series]);

  // Arcabouço fiscal context
  const target2025 = fiscalFrameworkTargets[2025];
  const gdp2025Approx = 11_500_000;
  const primaryPct2025 = (gc2025.resultado_primario / gdp2025Approx) * 100;

  return (
    <section id="governo-central" className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: BLUE }}>
            <Landmark className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Governo Central (Federal)
            </h2>
            <p className="text-sm text-gray-500">
              Dados fiscais do Governo Central para 2024-2025 | Fonte: STN
            </p>
          </div>
          <Badge
            className="ml-2 text-xs font-semibold px-3 py-1"
            style={{ backgroundColor: BLUE, color: 'white', borderColor: BLUE }}
          >
            Governo Central (Federal)
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1 max-w-3xl">
          Dados de 2024-2025 referem-se ao Governo Central (esfera federal apenas), não incluem estados e municípios.
          O Governo Geral (todas as esferas) tem dados disponíveis até 2023.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card, i) => (
          <GCKPICard key={i} data={card} />
        ))}
      </div>

      {/* Arcabouço Fiscal Target Indicator */}
      <Card className="mb-6 border-l-4" style={{ borderLeftColor: YELLOW }}>
        <CardContent className="py-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Arcabouço Fiscal (LC 200/2023):</span>
            <span className="text-sm text-gray-600">
              Meta 2025: resultado primário entre{' '}
              <span className="font-semibold">{target2025.primaryResultMin}%</span> e{' '}
              <span className="font-semibold">{target2025.primaryResultMax}%</span> do PIB
            </span>
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 font-semibold ${
                primaryPct2025 >= target2025.primaryResultMin && primaryPct2025 <= target2025.primaryResultMax
                  ? 'border-green-400 text-green-700 bg-green-50'
                  : 'border-red-400 text-red-700 bg-red-50'
              }`}
            >
              Resultado: {primaryPct2025.toFixed(2)}% PIB —{' '}
              {primaryPct2025 >= target2025.primaryResultMin && primaryPct2025 <= target2025.primaryResultMax
                ? 'Dentro da meta'
                : 'Fora da meta'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Evolution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Evolução Mensal — Resultado Primário GC</CardTitle>
            <CardDescription className="text-xs">
              Resultado primário mensal do Governo Central em 2024 e 2025 (R$ milhões)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)} bi`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<GCMonthlyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Bar dataKey="prim2024" fill="#93c5fd" name="Primário 2024" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="prim2025" fill={BLUE} name="Primário 2025" radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* DBGG Time Series Chart (historical) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Dívida Bruta do Governo Geral (% PIB)</CardTitle>
                <CardDescription className="text-xs">
                  Trajetória da DBGG de 2006 a 2025 — Fonte: BCB SGS 13762
                </CardDescription>
              </div>
              <DataStatusBadge state={dbgg.state} cachedAt={dbgg.cachedAt} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dbggChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradDbgg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RED} stopOpacity={0.4} />
                      <stop offset="50%" stopColor={ORANGE} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={RED} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => String(v)}
                  />
                  <YAxis
                    domain={[40, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<DBGGTooltip />} />
                  <ReferenceLine
                    y={60}
                    stroke={YELLOW}
                    strokeDasharray="5 5"
                    label={{ value: 'Limiar 60%', fontSize: 10, fill: YELLOW }}
                  />
                  <ReferenceLine
                    y={70}
                    stroke={ORANGE}
                    strokeDasharray="5 5"
                    label={{ value: 'Alerta 70%', fontSize: 10, fill: ORANGE }}
                  />
                  <Area
                    type="monotone"
                    dataKey="dbgg"
                    stroke={RED}
                    fill="url(#gradDbgg)"
                    strokeWidth={2}
                    name="DBGG (% PIB)"
                    dot={(props: Record<string, unknown>) => {
                      const { cx, cy, payload } = props as { cx: number; cy: number; payload: { year: number } };
                      const isRecent = payload.year >= 2024;
                      return (
                        <circle
                          key={payload.year}
                          cx={cx}
                          cy={cy}
                          r={isRecent ? 5 : 3}
                          fill={isRecent ? RED : '#999'}
                          stroke="white"
                          strokeWidth={isRecent ? 2 : 1}
                        />
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* DBGG context */}
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RED }} />
                <span>Pico pandemia: 86,9% (2020)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GREEN }} />
                <span>Mínimo: 51,3% (2011)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORANGE }} />
                <span>Atual: {dbgg.latest?.value?.toFixed(1) ?? dbggData[2025]}% ({dbgg.latest?.date ? new Date(dbgg.latest.date + 'T12:00:00').getFullYear() : '2025'})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEW: DBGG 24-Month Live Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  DBGG — Últimos 20 Meses
                  <DataStatusBadge state={dbgg.state} cachedAt={dbgg.cachedAt} />
                </CardTitle>
                <CardDescription className="text-xs">
                  Série mensal da Dívida Bruta do Governo Geral como % do PIB — Fonte: BCB (ao vivo)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {dbgg.state === 'loading' ? (
              <div className="h-[280px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : dbgg24MChartData.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dbgg24MChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradDbgg24m" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={RED} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={RED} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="dateLabel"
                      tick={{ fontSize: 9 }}
                      interval={2}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<DBGG24MTooltip />} />
                    <ReferenceLine
                      y={90}
                      stroke={RED}
                      strokeDasharray="5 5"
                      label={{ value: 'Zona de Risco (90%)', fontSize: 10, fill: RED, position: 'insideTopRight' }}
                    />
                    <ReferenceLine
                      y={80}
                      stroke={ORANGE}
                      strokeDasharray="5 5"
                      label={{ value: 'Atenção (80%)', fontSize: 10, fill: ORANGE, position: 'insideTopRight' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="dbgg"
                      stroke={RED}
                      strokeWidth={2}
                      dot={{ r: 3, fill: RED, stroke: 'white', strokeWidth: 1 }}
                      activeDot={{ r: 5, fill: RED, stroke: 'white', strokeWidth: 2 }}
                      name="DBGG (% PIB)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
                <div className="text-center">
                  <Landmark className="size-8 mx-auto mb-2 text-gray-300" />
                  <p>Dados da API BCB indisponíveis</p>
                  <p className="text-xs mt-1">Exibindo dados estáticos no gráfico histórico acima</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
