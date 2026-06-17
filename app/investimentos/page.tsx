'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  fiscalData,
  years,
  formatCompact,
  getVariation,
  toPerCapita,
  formatPerCapita,
  sphereColors,
  populationData,
} from '@/lib/brazil-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Building2,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  DollarSign,
  Percent,
  Activity,
  Landmark,
  Scale,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  Cell,
} from 'recharts';

// ─── Color Constants ──────────────────────────────────────────────────────
const COLORS = {
  green: '#009C3B',
  yellow: '#FFDF00',
  blue: '#002776',
  red: '#E74C3C',
  orange: '#F39C12',
  amber: '#D4A017',
  lightGreen: '#22C55E',
  darkGreen: '#166534',
  lightRed: '#FCA5A5',
  gray: '#6B7280',
};

// ─── Helper: Format R$ in billions ────────────────────────────────────────
function fmtBi(value: number): string {
  return `R$ ${(value / 1000).toFixed(1)} bi`;
}

function fmtPct(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

// ─── Chart Data Preparation ───────────────────────────────────────────────
function useChartData() {
  return useMemo(() => {
    // 1. Main series data
    const seriesData = years.map((y) => {
      const d = fiscalData[y];
      const consumoGov = d.remuneracao_empregados + d.uso_bens_servicos;
      const investimentoPublico = d.fbcf;
      const pctDespesa = (d.fbcf / d.despesa_total) * 100;

      return {
        year: y,
        fbcf: d.fbcf,
        investimentoLiquido: d.investimento_liquido,
        consumoCapitalFixo: d.consumo_capital_fixo,
        consumoGov,
        investimentoPublico,
        despesaTotal: d.despesa_total,
        pctDespesa: parseFloat(pctDespesa.toFixed(1)),
        receitaTotal: d.receita_total,
      };
    });

    // 2. Growth rates
    const growthData = years.map((y, i) => {
      const d = fiscalData[y];
      const consumoGov = d.remuneracao_empregados + d.uso_bens_servicos;
      const prevConsumo =
        i > 0
          ? fiscalData[years[i - 1]].remuneracao_empregados +
            fiscalData[years[i - 1]].uso_bens_servicos
          : consumoGov;
      const prevFbcf = i > 0 ? fiscalData[years[i - 1]].fbcf : d.fbcf;

      return {
        year: y,
        consumoGovGrowth: i > 0 ? getVariation(prevConsumo, consumoGov) : 0,
        fbcfGrowth: i > 0 ? getVariation(prevFbcf, d.fbcf) : 0,
      };
    });

    // 3. Per capita data
    const perCapitaData = years.map((y) => {
      const d = fiscalData[y];
      return {
        year: y,
        investimentoPerCapita: Math.round(toPerCapita(d.fbcf, y)),
        cargaPerCapita: Math.round(toPerCapita(d.impostos_total + d.contrib_sociais, y)),
      };
    });

    // 4. KPI values
    const d2023 = fiscalData[2023];
    const d2018 = fiscalData[2018];
    const fbcf2023 = d2023.fbcf;
    const invLiq2023 = d2023.investimento_liquido;
    const pctDespesa2023 = (d2023.fbcf / d2023.despesa_total) * 100;
    const crescimentoFbcf = getVariation(d2018.fbcf, d2023.fbcf);
    const consumoGov2023 = d2023.remuneracao_empregados + d2023.uso_bens_servicos;

    return {
      seriesData,
      growthData,
      perCapitaData,
      kpis: {
        fbcf2023,
        invLiq2023,
        pctDespesa2023,
        crescimentoFbcf,
        consumoGov2023,
      },
    };
  }, []);
}

// ─── Custom Tooltip for Dual-Axis Chart ───────────────────────────────────
function DualAxisTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs max-w-[280px]">
      <p className="font-bold text-gray-800 mb-2">Ano {label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <div
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {typeof entry.value === 'number'
              ? entry.value >= 100
                ? fmtBi(entry.value)
                : `${entry.value.toFixed(1)}%`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Custom Tooltip for Standard Charts ───────────────────────────────────
function StandardTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs max-w-[260px]">
      <p className="font-bold text-gray-800 mb-1.5">Ano {label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <div
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {typeof entry.value === 'number'
              ? Math.abs(entry.value) >= 1000
                ? fmtBi(entry.value)
                : Math.abs(entry.value) >= 1
                  ? `${entry.value.toFixed(1)}`
                  : entry.value.toFixed(2)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card Component ───────────────────────────────────────────────────
function KPICard({
  title,
  value,
  subtitle,
  icon,
  sentiment, // 'positive' | 'negative' | 'warning'
  change,
  changeLabel,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  sentiment: 'positive' | 'negative' | 'warning';
  change?: string;
  changeLabel?: string;
}) {
  const sentimentStyles = {
    positive: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      valueColor: 'text-emerald-700',
    },
    negative: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-800',
      valueColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      valueColor: 'text-amber-700',
    },
  };

  const s = sentimentStyles[sentiment];

  return (
    <Card className={`${s.bg} ${s.border} border shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-1 ${s.valueColor}`}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          </div>
          <div className={`${s.iconBg} p-2 sm:p-2.5 rounded-lg flex-shrink-0`}>
            <div className={`${s.iconColor} w-5 h-5 sm:w-6 sm:h-6`}>{icon}</div>
          </div>
        </div>
        {change && (
          <div className="mt-3 flex items-center gap-1.5">
            <Badge variant="secondary" className={`${s.badgeBg} ${s.badgeText} text-[10px] px-1.5 py-0 border-0`}>
              {sentiment === 'positive' ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : sentiment === 'negative' ? (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              ) : (
                <AlertTriangle className="w-3 h-3 mr-0.5" />
              )}
              {change}
            </Badge>
            {changeLabel && (
              <span className="text-[10px] text-gray-400">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────
export default function InvestimentosPage() {
  const { seriesData, growthData, perCapitaData, kpis } = useChartData();
  const [chartTab, setChartTab] = useState('comparativo');

  // Merge growth data into series data for the key chart
  const keyChartData = useMemo(() => {
    return seriesData.map((s, i) => ({
      ...s,
      consumoGovGrowth: growthData[i].consumoGovGrowth,
      fbcfGrowth: growthData[i].fbcfGrowth,
    }));
  }, [seriesData, growthData]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
      {/* ─── Section 1: Page Header ──────────────────────────────────── */}
      <section className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-800 -ml-2">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl shadow-sm"
                style={{ backgroundColor: '#dcfce7' }}
              >
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: COLORS.green }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Investimentos Públicos
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-0.5">
                  Análise da Formação Bruta de Capital Fixo (FBCF) e Investimento Líquido
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              className="text-xs font-semibold px-3 py-1 shadow-sm"
              style={{ backgroundColor: COLORS.green, color: 'white', borderColor: COLORS.green }}
            >
              FBCF
            </Badge>
            <Badge variant="outline" className="text-xs font-medium">
              2018–2023
            </Badge>
          </div>
        </div>
      </section>

      {/* ─── Section 2: KPI Cards Row ────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="FBCF 2023"
          value={fmtBi(kpis.fbcf2023)}
          subtitle="Formação Bruta de Capital Fixo"
          icon={<Building2 />}
          sentiment="positive"
          change={fmtPct(kpis.crescimentoFbcf)}
          changeLabel="vs 2018"
        />
        <KPICard
          title="Investimento Líquido 2023"
          value={fmtBi(kpis.invLiq2023)}
          subtitle="FBCF − Consumo de Capital Fixo"
          icon={<CheckCircle2 />}
          sentiment="positive"
          change="Positivo!"
          changeLabel="desde 2022"
        />
        <KPICard
          title="FBCF % da Despesa"
          value={`${kpis.pctDespesa2023.toFixed(1)}%`}
          subtitle="Participação na despesa total"
          icon={<Percent />}
          sentiment="warning"
          change="Muito baixo"
          changeLabel="mín. recomendado: 8%"
        />
        <KPICard
          title="Crescimento FBCF"
          value={fmtPct(kpis.crescimentoFbcf)}
          subtitle="2018 → 2023"
          icon={<Activity />}
          sentiment="positive"
          change="Expansão forte"
          changeLabel="7 anos"
        />
      </section>

      {/* ─── Section 3: KEY CHART — Consumo vs Investimento ──────────── */}
      <section>
        <Card className="shadow-md border-2" style={{ borderColor: '#dcfce7' }}>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: COLORS.green }} />
                  Consumo de Governo vs Investimento Público
                </CardTitle>
                <CardDescription className="mt-1">
                  A disparidade entre gastos com pessoal/insumos e investimento em infraestrutura
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[300px] text-xs">
                    <p>
                      <strong>Consumo de Governo</strong> = Remuneração de Empregados + Uso de Bens e Serviços.
                      Representa os gastos correntes de funcionamento do Estado.
                    </p>
                    <p className="mt-1">
                      <strong>Investimento Público</strong> = FBCF. Representa gastos com infraestrutura, equipamentos e obras.
                    </p>
                    <p className="mt-1 font-medium" style={{ color: COLORS.red }}>
                      O consumo é ~10x maior que o investimento!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Gap indicator */}
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-red-800">
                <span className="font-semibold">Gap Crítico:</span> Em 2023, o Consumo de Governo ({fmtBi(kpis.consumoGov2023)}) foi{' '}
                <span className="font-bold">{(kpis.consumoGov2023 / kpis.fbcf2023).toFixed(1)}x</span> maior que o Investimento Público ({fmtBi(kpis.fbcf2023)}).
                Para cada R$ 1 investido, R$ {(kpis.consumoGov2023 / kpis.fbcf2023).toFixed(1)} são gastos com custeio.
              </div>
            </div>

            <div className="h-[400px] sm:h-[480px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={keyChartData} margin={{ top: 20, right: 60, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  {/* Left Y-axis: Values in R$ billions */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)} bi`}
                    label={{
                      value: 'R$ (Milhões)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, fill: '#6b7280' },
                    }}
                  />
                  {/* Right Y-axis: Growth rates */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                    label={{
                      value: 'Variação %',
                      angle: 90,
                      position: 'insideRight',
                      style: { fontSize: 10, fill: '#6b7280' },
                    }}
                  />
                  <RechartsTooltip content={<DualAxisTooltip />} />

                  {/* Shaded gap zone between consumo and investimento */}
                  <Area
                    yAxisId="left"
                    dataKey="consumoGov"
                    fill="#fee2e2"
                    fillOpacity={0.3}
                    stroke="none"
                    name="Zona do Gap"
                  />

                  {/* Consumo de Governo bars */}
                  <Bar
                    yAxisId="left"
                    dataKey="consumoGov"
                    fill={COLORS.red}
                    fillOpacity={0.75}
                    radius={[4, 4, 0, 0]}
                    name="Consumo de Governo"
                    barSize={32}
                  />

                  {/* Investimento Público bars */}
                  <Bar
                    yAxisId="left"
                    dataKey="investimentoPublico"
                    fill={COLORS.green}
                    fillOpacity={0.85}
                    radius={[4, 4, 0, 0]}
                    name="Investimento Público (FBCF)"
                    barSize={24}
                  />

                  {/* Growth rate lines */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="consumoGovGrowth"
                    stroke={COLORS.orange}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COLORS.orange, stroke: '#fff', strokeWidth: 2 }}
                    name="Cresc. Consumo %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="fbcfGrowth"
                    stroke={COLORS.green}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: COLORS.green, stroke: '#fff', strokeWidth: 2 }}
                    name="Cresc. FBCF %"
                    strokeDasharray="6 3"
                  />

                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(value: string) => (
                      <span className="text-gray-600 text-xs">{value}</span>
                    )}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Annotation cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs font-semibold text-red-800">Consumo de Governo</p>
                <p className="text-xs text-red-600 mt-0.5">
                  Cresceu {fmtPct(getVariation(
                    fiscalData[2018].remuneracao_empregados + fiscalData[2018].uso_bens_servicos,
                    fiscalData[2023].remuneracao_empregados + fiscalData[2023].uso_bens_servicos
                  ))} de 2018 a 2023
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-800">Investimento Público</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Cresceu {fmtPct(kpis.crescimentoFbcf)} — recuperação forte após anos de baixo investimento
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-xs font-semibold text-amber-800">A Razão do Gap</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Custeio da máquina pública domina o orçamento, sufocando investimento em infraestrutura
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Section 4: FBCF Evolution (ComposedChart) ───────────────── */}
      <section>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: COLORS.green }} />
              Evolução da FBCF e Investimento Líquido
            </CardTitle>
            <CardDescription>
              Transição de investimento líquido negativo para positivo — o Brasil volta a ampliar seu estoque de capital
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[350px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={seriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)} bi`}
                    label={{
                      value: 'R$ Milhões',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, fill: '#6b7280' },
                    }}
                  />
                  <RechartsTooltip content={<StandardTooltip />} />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Zero', position: 'insideTopLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                  <Bar
                    dataKey="fbcf"
                    fill={COLORS.green}
                    fillOpacity={0.8}
                    radius={[4, 4, 0, 0]}
                    name="FBCF (Investimento Bruto)"
                    barSize={40}
                  />
                  <Line
                    type="monotone"
                    dataKey="investimentoLiquido"
                    stroke={COLORS.blue}
                    strokeWidth={2.5}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      const isPositive = payload.investimentoLiquido >= 0;
                      return (
                        <circle
                          key={`dot-${payload.year}`}
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill={isPositive ? COLORS.green : COLORS.red}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    name="Investimento Líquido"
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(value: string) => (
                      <span className="text-gray-600 text-xs">{value}</span>
                    )}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Insight bar */}
            <div className="mt-4 flex flex-wrap gap-3">
              {seriesData.map((s) => (
                <div
                  key={s.year}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    s.investimentoLiquido >= 0
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {s.investimentoLiquido >= 0 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {s.year}: {fmtBi(s.investimentoLiquido)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Section 5: Investment as % of Despesa ───────────────────── */}
      <section>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Scale className="w-5 h-5" style={{ color: COLORS.amber }} />
                  Investimento como % da Despesa Total
                </CardTitle>
                <CardDescription>
                  O Brasil está muito abaixo do mínimo recomendado para países em desenvolvimento
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[280px] text-xs">
                    <p>A OCDE recomenda que países em desenvolvimento invistam ao menos <strong>8% da despesa</strong> em infraestrutura. O Brasil investe apenas ~4,4%.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[320px] sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={seriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis
                    domain={[0, 12]}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(v: number) => `${v}%`}
                    label={{
                      value: '% da Despesa',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, fill: '#6b7280' },
                    }}
                  />
                  <RechartsTooltip content={<StandardTooltip />} />
                  <ReferenceLine
                    y={8}
                    stroke={COLORS.red}
                    strokeDasharray="6 3"
                    strokeWidth={2}
                    label={{
                      value: 'Mín. Recomendado (8%)',
                      position: 'insideTopRight',
                      style: { fontSize: 10, fill: COLORS.red, fontWeight: 600 },
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pctDespesa"
                    fill={COLORS.amber}
                    fillOpacity={0.15}
                    stroke={COLORS.amber}
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: COLORS.amber, stroke: '#fff', strokeWidth: 2 }}
                    name="FBCF / Despesa Total (%)"
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(value: string) => (
                      <span className="text-gray-600 text-xs">{value}</span>
                    )}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Progress bars for each year */}
            <div className="mt-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Distância da meta de 8%</p>
              {seriesData.map((s) => (
                <div key={s.year} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-10">{s.year}</span>
                  <div className="flex-1">
                    <Progress
                      value={(s.pctDespesa / 8) * 100}
                      className="h-2.5"
                      style={{
                        // @ts-ignore - inline style for custom color
                        '--progress-foreground': s.pctDespesa >= 8 ? COLORS.green : COLORS.amber,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-12 text-right">
                    {s.pctDespesa.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Section 6: FBCF vs Consumo de Capital Fixo ──────────────── */}
      <section>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Landmark className="w-5 h-5" style={{ color: COLORS.blue }} />
              FBCF vs Consumo de Capital Fixo (Depreciação)
            </CardTitle>
            <CardDescription>
              Estamos investindo mais do que perdemos para depreciação? A resposta mudou em 2022.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart side */}
              <div className="h-[320px] sm:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={seriesData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)} bi`}
                    />
                    <RechartsTooltip content={<StandardTooltip />} />
                    <Bar
                      dataKey="fbcf"
                      fill={COLORS.green}
                      fillOpacity={0.8}
                      radius={[4, 4, 0, 0]}
                      name="FBCF (Investimento Bruto)"
                      barSize={28}
                    />
                    <Bar
                      dataKey="consumoCapitalFixo"
                      fill={COLORS.red}
                      fillOpacity={0.6}
                      radius={[4, 4, 0, 0]}
                      name="Consumo de Capital Fixo (Depreciação)"
                      barSize={28}
                    />
                    <Line
                      type="monotone"
                      dataKey="investimentoLiquido"
                      stroke={COLORS.blue}
                      strokeWidth={2.5}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        const isPositive = payload.investimentoLiquido >= 0;
                        return (
                          <circle
                            key={`dot2-${payload.year}`}
                            cx={cx}
                            cy={cy}
                            r={5}
                            fill={isPositive ? COLORS.green : COLORS.red}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }}
                      name="Investimento Líquido"
                    />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
                    <Legend
                      wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      formatter={(value: string) => (
                        <span className="text-gray-600 text-xs">{value}</span>
                      )}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Explanation side */}
              <div className="flex flex-col justify-center gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Entendendo a Relação
                  </h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS.green }} />
                      <span><strong>FBCF</strong> — Investimento bruto em ativos fixos (obras, equipamentos)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS.red, opacity: 0.6 }} />
                      <span><strong>Consumo de Capital Fixo</strong> — Depreciação dos ativos existentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 flex-shrink-0" style={{ backgroundColor: COLORS.blue }} />
                      <span><strong>Investimento Líquido</strong> = FBCF − CCF (acréscimo real ao estoque)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Ponto de Inflexão: 2022
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Após anos com investimento líquido negativo (2018-2020), indicando que o país &quot;desinvestia&quot;
                    — a depreciação superava os novos investimentos —, o Brasil voltou a ampliar seu estoque de capital
                    público em 2022 (+R$ 40 bi) e 2023 (+R$ 45 bi).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alerta: Margem Ainda Pequena
                  </h3>
                  <p className="text-xs text-amber-700">
                    Embora positivo, o investimento líquido de R$ 45 bi (2023) representa apenas{' '}
                    <strong>{((fiscalData[2023].investimento_liquido / fiscalData[2023].fbcf) * 100).toFixed(0)}% da FBCF</strong>.
                    A depreciação consome {((fiscalData[2023].consumo_capital_fixo / fiscalData[2023].fbcf) * 100).toFixed(0)}%
                    de cada real investido, restando pouco para expansão do capital.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Section 7: Investment Need Analysis (Narrative) ──────────── */}
      <section>
        <Card className="shadow-sm border-2" style={{ borderColor: '#fef3c7' }}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" style={{ color: COLORS.amber }} />
              Análise da Necessidade de Investimento
            </CardTitle>
            <CardDescription>
              O déficit de investimento público do Brasil e suas implicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Narrative text */}
              <div className="lg:col-span-3 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  O Brasil enfrenta um <strong>déficit crônico de investimento público</strong>.
                  A FBCF representa apenas <strong>{kpis.pctDespesa2023.toFixed(1)}% da despesa total</strong> em 2023,
                  enquanto a média dos países da OCDE para investimento público situa-se em torno de{' '}
                  <strong>3,3% do PIB</strong>. Considerando que a carga tributária brasileira supera 33% do PIB,
                  o país arrecada muito, mas destina uma fração insuficiente para infraestrutura.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Estudos do Banco Mundial e da CNI estimam o <strong>déficit de infraestrutura brasileiro
                  em mais de R$ 2 trilhões</strong>, abrangendo transportes, saneamento, saúde e educação.
                  O subinvestimento crônico resulta em gargalos logísticos, perda de competitividade e
                  desigualdade regional acentuada.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A recuperação recente do investimento líquido (positivo desde 2022) é um sinal animador,
                  mas o ritmo precisa ser <strong>muito mais acelerado</strong>. Para atingir o mínimo recomendado
                  de 8% da despesa, a FBCF precisaria saltar de R$ 214 bi para aproximadamente{' '}
                  <strong>R$ {(0.08 * fiscalData[2023].despesa_total / 1000).toFixed(0)} bi</strong> — um aumento
                  de {fmtPct(getVariation(fiscalData[2023].fbcf, 0.08 * fiscalData[2023].despesa_total))}.
                </p>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Nota metodológica:</strong> Os valores estão em reais correntes (nominais),
                    não ajustados pela inflação. Dados extraídos dos Demonstrativos Fiscais do Governo Geral
                    e das Contas Integradas de Governo (CIG) do IBGE.
                  </p>
                </div>
              </div>

              {/* Key statistics */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Indicadores-Chave</h3>

                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">FBCF / Despesa Total</span>
                    <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                      Abaixo da meta
                    </Badge>
                  </div>
                  <p className="text-xl font-bold mt-1" style={{ color: COLORS.amber }}>
                    {kpis.pctDespesa2023.toFixed(1)}%
                  </p>
                  <div className="mt-2">
                    <Progress value={(kpis.pctDespesa2023 / 8) * 100} className="h-2" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Meta recomendada: 8%</p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Média OCDE (Invest. Público / PIB)</span>
                    <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-700">
                      Referência
                    </Badge>
                  </div>
                  <p className="text-xl font-bold mt-1" style={{ color: COLORS.blue }}>
                    ~3,3%
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Média dos países membros</p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Déficit de Infraestrutura Estimado</span>
                    <Badge variant="outline" className="text-[10px] border-red-300 text-red-700">
                      Crítico
                    </Badge>
                  </div>
                  <p className="text-xl font-bold mt-1" style={{ color: COLORS.red }}>
                    R$ 2+ tri
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Fonte: Banco Mundial / CNI</p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Investimento Necessário (8% despesa)</span>
                    <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700">
                      Meta
                    </Badge>
                  </div>
                  <p className="text-xl font-bold mt-1" style={{ color: COLORS.green }}>
                    R$ {(0.08 * fiscalData[2023].despesa_total / 1000).toFixed(0)} bi
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Gap: R$ {((0.08 * fiscalData[2023].despesa_total - fiscalData[2023].fbcf) / 1000).toFixed(0)} bi adicionais necessários
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Section 8: Per Capita Investment ────────────────────────── */}
      <section>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <DollarSign className="w-5 h-5" style={{ color: COLORS.blue }} />
              Investimento e Carga Tributária Per Capita
            </CardTitle>
            <CardDescription>
              Comparação entre o que cada brasileiro paga em tributos e o que é investido por pessoa
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[350px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={perCapitaData} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v}`
                    }
                    label={{
                      value: 'R$ per capita',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, fill: '#6b7280' },
                    }}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }: any) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs">
                          <p className="font-bold text-gray-800 mb-1.5">Ano {label}</p>
                          {payload.map((entry: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 py-0.5">
                              <div
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-gray-600">{entry.name}:</span>
                              <span className="font-semibold text-gray-900">
                                {formatPerCapita(entry.value)}
                              </span>
                            </div>
                          ))}
                          {payload.length === 2 && (
                            <div className="mt-2 pt-1.5 border-t border-gray-100 text-gray-500">
                              <span>Razão: 1:{' '}{(payload[1].value / payload[0].value).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="cargaPerCapita"
                    fill={COLORS.red}
                    fillOpacity={0.55}
                    radius={[4, 4, 0, 0]}
                    name="Carga Tributária Per Capita"
                    barSize={32}
                  />
                  <Bar
                    dataKey="investimentoPerCapita"
                    fill={COLORS.green}
                    fillOpacity={0.85}
                    radius={[4, 4, 0, 0]}
                    name="Investimento Per Capita"
                    barSize={24}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(value: string) => (
                      <span className="text-gray-600 text-xs">{value}</span>
                    )}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Per capita comparison table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-600">Ano</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-600">Invest. Per Capita</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-600">Carga Per Capita</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-600">Razão</th>
                  </tr>
                </thead>
                <tbody>
                  {perCapitaData.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 font-medium text-gray-800">{row.year}</td>
                      <td className="py-2 px-2 text-right text-emerald-700 font-semibold">
                        {formatPerCapita(row.investimentoPerCapita)}
                      </td>
                      <td className="py-2 px-2 text-right text-red-700 font-semibold">
                        {formatPerCapita(row.cargaPerCapita)}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-500">
                        1:{(row.cargaPerCapita / row.investimentoPerCapita).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key insight */}
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                Em 2023, cada brasileiro pagou em média <strong>R$ {(perCapitaData[perCapitaData.length - 1].cargaPerCapita / 1000).toFixed(1)} mil</strong> em
                tributos, mas apenas <strong>R$ {(perCapitaData[perCapitaData.length - 1].investimentoPerCapita).toFixed(0)}</strong> foram
                investidos per capita — uma razão de 1:{(perCapitaData[perCapitaData.length - 1].cargaPerCapita / perCapitaData[perCapitaData.length - 1].investimentoPerCapita).toFixed(1)}.
                Para cada R$ 1 investido, R$ {(perCapitaData[perCapitaData.length - 1].cargaPerCapita / perCapitaData[perCapitaData.length - 1].investimentoPerCapita).toFixed(1)} são arrecadados.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Footer Navigation ───────────────────────────────────────── */}
      <section className="pt-4">
        <Separator className="mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard Principal
            </Button>
          </Link>
          <p className="text-xs text-gray-400 text-center">
            Dados: IBGE/CIG e STN/Demonstrativos Fiscais | Valores correntes (nominais)
          </p>
        </div>
      </section>
    </main>
  );
}
