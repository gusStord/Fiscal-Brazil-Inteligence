'use client';

import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
  LabelList,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  fiscalData,
  years,
  getVariation,
  formatCompact,
  benchmarkData,
} from '@/lib/brazil-data';
import type { YearlyData } from '@/lib/brazil-data';
import { useLiveDataContext } from '@/components/dashboard/LiveDataProvider';
import ChartExportButton from '@/components/dashboard/ChartExportButton';

// ─── Brazil Theme Colors ────────────────────────────────────────────────────
const BRAZIL_COLORS = ['#009C3B', '#FFDF00', '#002776', '#C4E538', '#1A5276', '#F39C12'];
const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';
const RED = '#E74C3C';
const ORANGE = '#F39C12';
const LIGHT_GREEN = '#C4E538';
const DARK_BLUE = '#1A5276';
const DASHED_GREEN = '#6ee7b7'; // Light green for RTN dashed line
const DASHED_RED = '#fca5a5';   // Light red for RTN dashed line

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatBi(value: number): string {
  return `R$ ${(value / 1000).toFixed(1)} bi`;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ─── Data Preparation ───────────────────────────────────────────────────────
function useChartData() {
  const { rtn } = useLiveDataContext();

  return useMemo(() => {
    const yearDataList = years.map((y) => fiscalData[y]);

    // Chart 1: Receita vs Despesa — EXTENDED with RTN monthly data
    const receitaDespesaData = yearDataList.map((d) => ({
      year: d.year,
      receita_total: d.receita_total,
      despesa_total: d.despesa_total,
    }));

    // Add RTN monthly data as extension (2024-2025)
    // We aggregate monthly RTN data to annual and add as separate entries
    // For the extended chart, we add the RTN data points
    const rtnExtension: { year: number; rtn_receita: number; rtn_despesa: number; isRTN: boolean }[] = [];
    if (rtn.historico && rtn.historico.length > 0) {
      // Group by year
      const byYear: Record<number, { receita: number; despesa: number }> = {};
      rtn.historico.forEach((h) => {
        if (!byYear[h.ano]) byYear[h.ano] = { receita: 0, despesa: 0 };
        byYear[h.ano].receita += h.receitaTotal;
        byYear[h.ano].despesa += h.despesaTotal;
      });

      // Add RTN years that extend beyond our static data (2024, 2025)
      Object.entries(byYear)
        .sort(([a], [b]) => Number(a) - Number(b))
        .forEach(([yearStr, data]) => {
          const year = Number(yearStr);
          if (year >= 2024) {
            rtnExtension.push({
              year,
              rtn_receita: data.receita,
              rtn_despesa: data.despesa,
              isRTN: true,
            });
          }
        });
    }

    const receitaDespesaExtended = [
      ...receitaDespesaData.map((d) => ({
        year: d.year,
        receita_total: d.receita_total,
        despesa_total: d.despesa_total,
        rtn_receita: null as number | null,
        rtn_despesa: null as number | null,
        isRTN: false,
      })),
      ...rtnExtension.map((d) => ({
        year: d.year,
        receita_total: null as number | null,
        despesa_total: null as number | null,
        rtn_receita: d.rtn_receita,
        rtn_despesa: d.rtn_despesa,
        isRTN: true,
      })),
    ];

    // Chart 2: Composição da Receita (Stacked)
    const receitaComposicaoData = yearDataList.map((d) => ({
      year: d.year,
      impostos_total: d.impostos_total,
      contrib_sociais: d.contrib_sociais,
      juros_receita: d.juros_receita,
    }));

    // Chart 3: Distribuição da Despesa 2023 (Donut)
    const d2023 = fiscalData[2023];
    const despesaDonutData = [
      { name: 'Remuneração', value: d2023.remuneracao_empregados, color: GREEN },
      { name: 'Juros', value: d2023.juros_despesa, color: RED },
      { name: 'Benefícios Sociais', value: d2023.beneficios_sociais, color: YELLOW },
      { name: 'Bens e Serviços', value: d2023.uso_bens_servicos, color: BLUE },
      { name: 'Subsídios', value: d2023.subsidios, color: ORANGE },
      { name: 'FBCF', value: d2023.fbcf, color: LIGHT_GREEN },
      { name: 'Outras', value: d2023.outras_despesas, color: DARK_BLUE },
    ].filter((item) => item.value > 0);

    const despesaTotal2023 = despesaDonutData.reduce((s, d) => s + d.value, 0);

    // Chart 4: Receita por Esfera de Governo (Grouped)
    const receitaEsferaData = yearDataList.map((d) => ({
      year: d.year,
      Federal: d.receita_federal,
      Estadual: d.receita_estadual,
      Municipal: d.receita_municipal,
    }));

    // Chart 5: Evolução do ROL e ROB
    const rolRobData = yearDataList.map((d) => ({
      year: d.year,
      ROB: d.rob,
      ROL: d.rol,
    }));

    // Chart 6: Juros da Dívida
    const jurosData = yearDataList.map((d) => ({
      year: d.year,
      juros_despesa: d.juros_despesa,
      pct_despesa: (d.juros_despesa / d.despesa_total) * 100,
    }));

    // Chart 7: Investimento (FBCF) Evolution
    const investimentoData = yearDataList.map((d) => ({
      year: d.year,
      fbcf: d.fbcf,
      investimento_liquido: d.investimento_liquido,
    }));

    // Chart 8: Ranking de Indicadores 2023
    const indicadores2023 = [
      {
        name: 'Impostos/Receita',
        value: (d2023.impostos_total / d2023.receita_total) * 100,
        fill: GREEN,
      },
      {
        name: 'Juros/Despesa',
        value: (d2023.juros_despesa / d2023.despesa_total) * 100,
        fill: RED,
      },
      {
        name: 'FBCF/Despesa',
        value: (d2023.fbcf / d2023.despesa_total) * 100,
        fill: GREEN,
      },
      {
        name: 'Déficit/Receita',
        value: (Math.abs(d2023.rol) / d2023.receita_total) * 100,
        fill: RED,
      },
    ];

    // Chart 9: Radar Benchmark
    const radarData = [
      {
        dimension: 'Carga Tributária',
        Brasil: benchmarkData.taxBurden[0],
        Argentina: benchmarkData.taxBurden[1],
        México: benchmarkData.taxBurden[2],
        Chile: benchmarkData.taxBurden[3],
        Colômbia: benchmarkData.taxBurden[4],
      },
      {
        dimension: 'Crescimento PIB',
        Brasil: Math.max(0, benchmarkData.gdpGrowth[0] + 5) * 10,
        Argentina: Math.max(0, benchmarkData.gdpGrowth[1] + 5) * 10,
        México: Math.max(0, benchmarkData.gdpGrowth[2] + 5) * 10,
        Chile: Math.max(0, benchmarkData.gdpGrowth[3] + 5) * 10,
        Colômbia: Math.max(0, benchmarkData.gdpGrowth[4] + 5) * 10,
      },
      {
        dimension: 'Balanço Primário',
        Brasil: (benchmarkData.primaryBalance[0] + 5) * 10,
        Argentina: (benchmarkData.primaryBalance[1] + 5) * 10,
        México: (benchmarkData.primaryBalance[2] + 5) * 10,
        Chile: (benchmarkData.primaryBalance[3] + 5) * 10,
        Colômbia: (benchmarkData.primaryBalance[4] + 5) * 10,
      },
      {
        dimension: 'Investimento',
        Brasil: (d2023.fbcf / d2023.despesa_total) * 300,
        Argentina: 3.5,
        México: 4.2,
        Chile: 5.1,
        Colômbia: 3.8,
      },
    ];

    // Chart 10: Heatmap data
    const metrics = ['Receita', 'Despesa', 'Equilíbrio', 'Investimento', 'Serviço Dívida'];
    const heatmapData = yearDataList.map((d) => {
      const receitaGrowth = years.indexOf(d.year) > 0
        ? getVariation(fiscalData[years[years.indexOf(d.year) - 1]].receita_total, d.receita_total)
        : 0;
      const despesaGrowth = years.indexOf(d.year) > 0
        ? getVariation(fiscalData[years[years.indexOf(d.year) - 1]].despesa_total, d.despesa_total)
        : 0;
      return {
        year: d.year,
        values: [
          { metric: 'Receita', value: receitaGrowth, raw: d.receita_total },
          { metric: 'Despesa', value: -despesaGrowth, raw: d.despesa_total }, // negative because higher expense is bad
          { metric: 'Equilíbrio', value: (d.rob / d.despesa_total) * 100 + 25, raw: d.rob },
          { metric: 'Investimento', value: (d.fbcf / d.despesa_total) * 500, raw: d.fbcf },
          { metric: 'Serviço Dívida', value: 50 - (d.juros_despesa / d.despesa_total) * 200, raw: d.juros_despesa },
        ],
      };
    });

    // Chart 11: Scatter data
    const scatterData = yearDataList.map((d) => ({
      x: d.receita_total,
      y: d.despesa_total,
      z: Math.max(Math.abs(d.fbcf), 50000),
      year: d.year,
    }));

    // Chart 12: VAB/PIB + Produção
    const vabData = yearDataList.map((d) => ({
      year: d.year,
      vab_pib: d.vab_pib,
      producao: d.producao,
    }));

    return {
      receitaDespesaData,
      receitaDespesaExtended,
      receitaComposicaoData,
      despesaDonutData,
      despesaTotal2023,
      receitaEsferaData,
      rolRobData,
      jurosData,
      investimentoData,
      indicadores2023,
      radarData,
      heatmapData,
      metrics,
      scatterData,
      vabData,
    };
  }, [rtn.historico]);
}

// ─── Custom Tooltip Components ──────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
  formatter?: (value: number) => string;
}

function CurrencyTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value != null ? formatBi(p.value) : '—'}
        </p>
      ))}
    </div>
  );
}

function ExtendedReceitaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => {
        if (p.value == null) return null;
        const isRTN = p.name.includes('RTN');
        return (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {formatBi(p.value)}
            {isRTN && <span className="ml-1 text-[10px] text-gray-400">· Dados mensais STN</span>}
          </p>
        );
      })}
    </div>
  );
}

function PctTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatPct(p.value)}
        </p>
      ))}
    </div>
  );
}

function JurosTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}:{' '}
          {p.dataKey === 'pct_despesa'
            ? formatPct(p.value)
            : formatBi(p.value)}
        </p>
      ))}
    </div>
  );
}

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{d.year}</p>
      <p className="text-xs" style={{ color: GREEN }}>Receita: {formatBi(d.x)}</p>
      <p className="text-xs" style={{ color: RED }}>Despesa: {formatBi(d.y)}</p>
      <p className="text-xs" style={{ color: BLUE }}>FBCF: {formatBi(d.z)}</p>
    </div>
  );
}

// ─── Fade-in on Scroll Hook ─────────────────────────────────────────────────
function useFadeIn() {
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
function ChartCard({
  title,
  description,
  colSpan2 = false,
  chartId,
  children,
}: {
  title: string;
  description: string;
  colSpan2?: boolean;
  chartId?: string;
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
      <Card className="h-full group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
            {chartId && (
              <ChartExportButton targetId={chartId} fileName={title.replace(/\s+/g, '-').toLowerCase()} />
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0" id={chartId}>{children}</CardContent>
      </Card>
    </div>
  );
}

// ─── Chart 10: Heatmap Cell ─────────────────────────────────────────────────
function HeatmapCell({ value, metric, year, raw }: { value: number; metric: string; year: number; raw: number }) {
  const getColor = (v: number) => {
    const clamped = Math.max(-1, Math.min(1, v / 30));
    if (clamped > 0.3) return '#009C3B';
    if (clamped > 0.1) return '#4CAF50';
    if (clamped > -0.1) return '#FFDF00';
    if (clamped > -0.3) return '#FF9800';
    return '#E74C3C';
  };

  const getOpacity = (v: number) => {
    const intensity = Math.abs(v) / 50;
    return Math.max(0.35, Math.min(1, 0.35 + intensity * 0.65));
  };

  const cellLabel = metric === 'Receita' || metric === 'Despesa'
    ? `${raw ? formatBi(raw) : 'N/A'} (${value.toFixed(1)}%)`
    : `${value.toFixed(1)}`;

  return (
    <ShadTooltip>
      <TooltipTrigger asChild>
        <div
          className="flex items-center justify-center rounded-md text-[10px] font-medium text-white transition-transform hover:scale-110 cursor-default aspect-square min-h-[36px]"
          style={{
            backgroundColor: getColor(value),
            opacity: getOpacity(value),
          }}
        >
          {value.toFixed(0)}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-semibold">{year} - {metric}</p>
        <p>{cellLabel}</p>
      </TooltipContent>
    </ShadTooltip>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ChartsSection() {
  const data = useChartData();
  const { rtn } = useLiveDataContext();

  const donutLabelRender = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
      if (percent < 0.05) return null;
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
          {(percent * 100).toFixed(0)}%
        </text>
      );
    },
    []
  );

  // Check if we have RTN extension data
  const hasRTNData = data.receitaDespesaExtended.some((d) => d.isRTN);

  return (
    <section id="graficos" className="py-8 px-4 md:px-8 scroll-mt-24">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Análise Visual das Contas Públicas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          12 gráficos interativos que detalham a evolução fiscal do Brasil de 2018 a 2023
          {hasRTNData && (
            <span className="text-blue-600"> + dados em tempo real do RTN/STN (2024-2025)</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ─── Chart 1: Receita vs Despesa (EXTENDED with RTN) ──────────────── */}
        <ChartCard
          title="Receita vs Despesa"
          description={hasRTNData
            ? "Evolução temporal com extensão RTN/STN (linha tracejada) para 2024-2025"
            : "Evolução temporal da receita e despesa totais do Governo Geral"
          }
          colSpan2
          chartId="chart-receita-despesa"
        >
          <div className="h-[320px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.receitaDespesaExtended} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <Tooltip content={<ExtendedReceitaTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {/* Static data: solid lines */}
                <Area type="monotone" dataKey="receita_total" stroke={GREEN} fill="url(#gradReceita)" strokeWidth={2} name="Receita (IBGE)" connectNulls={false} />
                <Area type="monotone" dataKey="despesa_total" stroke={RED} fill="url(#gradDespesa)" strokeWidth={2} name="Despesa (IBGE)" connectNulls={false} />
                <Line type="monotone" dataKey="receita_total" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4, fill: GREEN }} name="Receita (IBGE)" connectNulls={false} />
                <Line type="monotone" dataKey="despesa_total" stroke={RED} strokeWidth={2.5} dot={{ r: 4, fill: RED }} name="Despesa (IBGE)" connectNulls={false} />
                {/* RTN data: dashed lines */}
                {hasRTNData && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="rtn_receita"
                      stroke={DASHED_GREEN}
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ r: 4, fill: DASHED_GREEN, stroke: GREEN, strokeWidth: 2 }}
                      name="Receita (RTN/STN)"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="rtn_despesa"
                      stroke={DASHED_RED}
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ r: 4, fill: DASHED_RED, stroke: RED, strokeWidth: 2 }}
                      name="Despesa (RTN/STN)"
                      connectNulls={false}
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {/* Legend explanation for RTN */}
          {hasRTNData && (
            <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-gray-700" />
                <span>Linha sólida: Dados IBGE (Governo Geral)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 border-t-2 border-dashed" style={{ borderColor: GREEN }} />
                <span>Linha tracejada: Dados mensais STN (Governo Central)</span>
              </div>
            </div>
          )}
        </ChartCard>

        {/* ─── Chart 2: Composição da Receita ──────────────────────────────── */}
        <ChartCard
          title="Composição da Receita"
          description="Impostos, contribuições sociais e juros ao longo dos anos"
          chartId="chart-composicao-receita"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.receitaComposicaoData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="impostos_total" stackId="a" fill={GREEN} name="Impostos" />
                <Bar dataKey="contrib_sociais" stackId="a" fill={YELLOW} name="Contribuições Sociais" />
                <Bar dataKey="juros_receita" stackId="a" fill={BLUE} name="Juros" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 3: Distribuição da Despesa 2023 ──────────────────────── */}
        <ChartCard
          title="Distribuição da Despesa 2023"
          description="Composição percentual da despesa total do Governo Geral em 2023"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.despesaDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={donutLabelRender}
                >
                  {data.despesaDonutData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${formatBi(value)} (${((value / data.despesaTotal2023) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value: string) => <span className="text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 4: Receita por Esfera de Governo ─────────────────────── */}
        <ChartCard
          title="Receita por Esfera de Governo"
          description="Comparação entre receitas federal, estadual e municipal"
          colSpan2
        >
          <div className="h-[320px] md:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.receitaEsferaData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Federal" fill={GREEN} name="Federal" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Estadual" fill={YELLOW} name="Estadual" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Municipal" fill={BLUE} name="Municipal" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 5: Evolução do ROL e ROB ──────────────────────────────── */}
        <ChartCard
          title="Evolução do ROL e ROB"
          description="Resultado Operacional Bruto e Líquido — valores negativos indicam déficit"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.rolRobData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" label={{ value: 'Zero', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="ROB"
                  stroke={GREEN}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: GREEN }}
                  name="ROB"
                />
                <Line
                  type="monotone"
                  dataKey="ROL"
                  stroke={RED}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: RED }}
                  name="ROL"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 6: Juros da Dívida ────────────────────────────────────── */}
        <ChartCard
          title="Juros da Dívida ao Longo do Tempo"
          description="Despesa com juros e sua participação percentual na despesa total"
          chartId="chart-juros-divida"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.jurosData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradJuros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ORANGE} stopOpacity={0.6} />
                    <stop offset="50%" stopColor={RED} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${v.toFixed(0)}%`} tick={{ fontSize: 11 }} />
                <Tooltip content={<JurosTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="juros_despesa"
                  stroke={RED}
                  fill="url(#gradJuros)"
                  strokeWidth={2}
                  name="Juros (R$)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pct_despesa"
                  stroke={ORANGE}
                  strokeWidth={2}
                  dot={{ r: 4, fill: ORANGE }}
                  name="% Despesa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 7: Investimento (FBCF) Evolution ─────────────────────── */}
        <ChartCard
          title="Evolução do Investimento (FBCF)"
          description="Formação Bruta de Capital Fixo (barras) e Investimento Líquido (linha)"
          chartId="chart-fbcf"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.investimentoData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                <Bar dataKey="fbcf" fill={GREEN} name="FBCF" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="investimento_liquido"
                  stroke={BLUE}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: BLUE }}
                  name="Investimento Líquido"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 8: Ranking de Indicadores 2023 ────────────────────────── */}
        <ChartCard
          title="Ranking de Indicadores 2023"
          description="Principais indicadores fiscais — verde (saudável), vermelho (crítico)"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.indicadores2023}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => `${v.toFixed(0)}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Valor">
                  {data.indicadores2023.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
                <LabelList dataKey="value" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 11, fill: '#666' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 9: Radar Benchmark ────────────────────────────────────── */}
        <ChartCard
          title="Brasil vs Benchmarks"
          description="Comparação com Argentina, México, Chile e Colômbia em indicadores-chave"
          colSpan2
          chartId="chart-benchmarks"
        >
          <div className="h-[340px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar name="Brasil" dataKey="Brasil" stroke={GREEN} fill={GREEN} fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Argentina" dataKey="Argentina" stroke="#75AADB" fill="#75AADB" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="México" dataKey="México" stroke={ORANGE} fill={ORANGE} fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Chile" dataKey="Chile" stroke={RED} fill={RED} fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Colômbia" dataKey="Colômbia" stroke={YELLOW} fill={YELLOW} fillOpacity={0.08} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 10: Heatmap Simulado ──────────────────────────────────── */}
        <ChartCard
          title="Desempenho por Ano (Heatmap)"
          description="Intensidade de verde = bom desempenho, vermelho = crítico, amarelo = neutro"
          colSpan2
          chartId="chart-heatmap"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Column headers */}
              <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-1 mb-1 pl-1">
                <div />
                {data.metrics.map((m) => (
                  <div key={m} className="text-center text-[10px] font-medium text-muted-foreground truncate">
                    {m}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {data.heatmapData.map((row) => (
                <div key={row.year} className="grid grid-cols-[60px_repeat(5,1fr)] gap-1 mb-1 pl-1">
                  <div className="flex items-center text-xs font-semibold text-foreground">
                    {row.year}
                  </div>
                  {row.values.map((cell: any) => (
                    <HeatmapCell
                      key={`${row.year}-${cell.metric}`}
                      value={cell.value}
                      metric={cell.metric}
                      year={row.year}
                      raw={cell.raw}
                    />
                  ))}
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#E74C3C', opacity: 0.8 }} />
                  <span>Crítico</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#FF9800', opacity: 0.8 }} />
                  <span>Alerta</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#FFDF00', opacity: 0.8 }} />
                  <span>Neutro</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#4CAF50', opacity: 0.8 }} />
                  <span>Bom</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#009C3B', opacity: 0.8 }} />
                  <span>Excelente</span>
                </div>
              </div>

            </div>
          </div>
        </ChartCard>

        {/* ─── Chart 11: Correlação Receita vs Despesa (Scatter) ──────────── */}
        <ChartCard
          title="Correlação Receita vs Despesa"
          description="Cada ponto = um ano. Tamanho = FBCF. Linha de tendência aproximada."
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Receita"
                  tickFormatter={formatCompact}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Receita', position: 'insideBottom', offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Despesa"
                  tickFormatter={formatCompact}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Despesa', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 600]} name="FBCF" />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={data.scatterData} fill={BLUE} name="Anos">
                  {data.scatterData.map((entry, index) => (
                    <Cell key={index} fill={BRAZIL_COLORS[index % BRAZIL_COLORS.length]} stroke="white" strokeWidth={1} />
                  ))}
                  <LabelList dataKey="year" position="top" style={{ fontSize: 10, fontWeight: 600, fill: '#333' }} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* ─── Chart 12: Evolução VAB/PIB + Produção ──────────────────────── */}
        <ChartCard
          title="VAB/PIB do Setor Público"
          description="Valor Adicionado Bruto (área) e Produção (linha) do CIG ao longo dos anos"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.vabData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradVab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.5} />
                    <stop offset="50%" stopColor={DARK_BLUE} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="vab_pib"
                  stroke={BLUE}
                  fill="url(#gradVab)"
                  strokeWidth={2}
                  name="VAB/PIB"
                />
                <Line
                  type="monotone"
                  dataKey="producao"
                  stroke={DARK_BLUE}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: DARK_BLUE }}
                  name="Produção"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
