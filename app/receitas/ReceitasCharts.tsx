'use client';

import React from 'react';
import Link from 'next/link';
import {
  fiscalData,
  formatCompact,
  formatPerCapita,
  sphereColors,
} from '@/lib/brazil-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Table2,
  Info,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

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

// ─── Chart configs ──────────────────────────────────────────────────────────
const waterfallChartConfig: ChartConfig = {
  receitaTotal: { label: 'Receita Total', color: COLORS.green },
  impostos: { label: '(-) Impostos', color: '#ef4444' },
  contribSociais: { label: '(-) Contribuições Sociais', color: '#f97316' },
  jurosReceita: { label: '(-) Juros Receita', color: '#eab308' },
  receitaLiquida: { label: '(=) Receita Líquida', color: COLORS.blue },
};

const compositionChartConfig: ChartConfig = {
  impostos: { label: 'Impostos', color: COLORS.blue },
  contrib_sociais: { label: 'Contribuições Sociais', color: COLORS.green },
  juros_receita: { label: 'Juros', color: COLORS.gold },
};

const sphereChartConfig: ChartConfig = {
  federal: { label: 'Federal', color: sphereColors.federal.primary },
  estadual: { label: 'Estadual', color: sphereColors.estadual.primary },
  municipal: { label: 'Municipal', color: sphereColors.municipal.primary },
};

const taxBurdenChartConfig: ChartConfig = {
  taxBurden: { label: 'Carga Tributária (%)', color: COLORS.green },
};

// ─── Custom Waterfall Label Component ──────────────────────────────────────
function CustomWaterfallLabel({
  data,
  formatValue,
}: {
  data: any[];
  formatValue: (v: number) => string;
}) {
  return (
    <g>
      {data.map((entry: any, index: number) => {
        const y = entry.type === 'negative'
          ? entry.base + entry.value + 5
          : entry.base + entry.value + 5;
        const display = entry.display;
        const isNeg = display < 0;

        return (
          <text
            key={`label-${index}`}
            x={0}
            y={y}
            textAnchor="middle"
            fill={isNeg ? '#ef4444' : entry.type === 'result' ? COLORS.blue : COLORS.green}
            fontSize={11}
            fontWeight={600}
          >
            {isNeg ? '-' : ''}{formatValue(Math.abs(display as number))}
          </text>
        );
      })}
    </g>
  );
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface ReceitasChartsProps {
  sphereFilter: SphereFilter;
  perCapita: boolean;
  selectedYear: number;
  sphereLabel: string;
  activeSphereColor: string;
  waterfallData: any[];
  compositionData: any[];
  sphereBarData: any[];
  taxBurdenData: any[];
  perCapitaTableData: any[];
  formatValue: (v: number) => string;
}

export default function ReceitasCharts({
  sphereFilter,
  perCapita,
  selectedYear,
  sphereLabel,
  activeSphereColor,
  waterfallData,
  compositionData,
  sphereBarData,
  taxBurdenData,
  perCapitaTableData,
  formatValue,
}: ReceitasChartsProps) {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          3. WATERFALL CHART — "Cachoeira de Dados"
      ═══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="size-5 text-[#009C3B]" />
                Cachoeira de Dados
              </CardTitle>
              <CardDescription className="mt-1">
                Fluxo de decomposição da receita — {sphereFilter === 'todas' ? 'Receita Total' : `Receita ${sphereLabel}`} → Impostos, Contribuições e Juros → Receita Líquida ({selectedYear})
              </CardDescription>
            </div>
            <TooltipProvider>
              <ShadTooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Info className="size-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>O gráfico waterfall mostra como a Receita Total é decomposta: impostos, contribuições sociais e juros são deduzidos para chegar à Receita Líquida.</p>
                </TooltipContent>
              </ShadTooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={waterfallChartConfig} className="h-[350px] w-full">
            <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
                tickFormatter={(v: number) => formatValue(v)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => {
                      const display = item.payload.display;
                      const isNeg = display < 0;
                      return (
                        <span className={isNeg ? 'text-red-500' : 'text-green-600'}>
                          {isNeg ? '' : ''}{formatValue(Math.abs(display as number))}
                        </span>
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="base" stackId="waterfall" fill="transparent" isAnimationActive={false} />
              <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <CustomWaterfallLabel data={waterfallData} formatValue={formatValue} />
            </BarChart>
          </ChartContainer>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[
              { label: sphereFilter === 'todas' ? 'Receita Total' : `Receita ${sphereLabel}`, color: COLORS.green },
              { label: 'Deduções', color: '#ef4444' },
              { label: 'Contribuições', color: '#f97316' },
              { label: 'Juros', color: '#eab308' },
              { label: 'Rec. Líquida', color: COLORS.blue },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="size-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {sphereFilter !== 'todas' && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-1.5">
              <Info className="size-3 flex-shrink-0" />
              Dados reais por esfera — Fonte: IBGE/CIG
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          4 & 5 — SIDE BY SIDE on desktop
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. REVENUE COMPOSITION OVER TIME */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="size-5 text-[#002776]" />
              Composição da Receita ao Longo do Tempo
            </CardTitle>
            <CardDescription>
              Evolução de Impostos, Contribuições Sociais e Juros{' '}
              {perCapita ? '(Per Capita)' : '(Valores Totais)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sphereFilter !== 'todas' && (
              <div className="mb-3 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-1.5">
                <Info className="size-3 flex-shrink-0" />
                Dados reais por esfera — Fonte: IBGE/CIG
              </div>
            )}
            <ChartContainer config={compositionChartConfig} className="h-[300px] w-full">
              <AreaChart data={compositionData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(v: number) => formatValue(v)}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatValue(value as number)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="impostos" stackId="1" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.6} />
                <Area type="monotone" dataKey="contrib_sociais" stackId="1" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.6} />
                <Area type="monotone" dataKey="juros_receita" stackId="1" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 5. REVENUE BY SPHERE */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="size-5 text-[#D4A017]" />
              Receita por Esfera de Governo
            </CardTitle>
            <CardDescription>
              Comparativo Federal, Estadual e Municipal{' '}
              {perCapita ? '(Per Capita)' : '(Valores Totais)'}
              {sphereFilter !== 'todas' && ` — ${sphereFilter.charAt(0).toUpperCase() + sphereFilter.slice(1)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sphereChartConfig} className="h-[300px] w-full">
              <BarChart data={sphereBarData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(v: number) => formatValue(v)}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatValue(value as number)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {(sphereFilter === 'todas' || sphereFilter === 'federal') && (
                  <Bar dataKey="federal" fill={sphereColors.federal.primary} radius={[3, 3, 0, 0]} />
                )}
                {(sphereFilter === 'todas' || sphereFilter === 'estadual') && (
                  <Bar dataKey="estadual" fill={sphereColors.estadual.primary} radius={[3, 3, 0, 0]} />
                )}
                {(sphereFilter === 'todas' || sphereFilter === 'municipal') && (
                  <Bar dataKey="municipal" fill={sphereColors.municipal.primary} radius={[3, 3, 0, 0]} />
                )}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. TAX BURDEN EVOLUTION (Line Chart)
      ═══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-5 text-[#E74C3C]" />
                Evolução da Carga Tributária
              </CardTitle>
              <CardDescription className="mt-1">
                Relação (Impostos / Receita Total) × 100 — Percentual da receita composto por impostos
              </CardDescription>
            </div>
            <TooltipProvider>
              <ShadTooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Info className="size-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>A linha vermelha tracejada em 60% representa o limiar de alerta. Quando a carga tributária ultrapassa este nível, indica que a maior parte da receita vem de impostos, com menor diversificação de fontes.</p>
                </TooltipContent>
              </ShadTooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {sphereFilter !== 'todas' && (
            <div className="mb-3 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-1.5">
              <Info className="size-3 flex-shrink-0" />
              Carga tributária calculada com dados reais por esfera — Fonte: IBGE/CIG
            </div>
          )}
          <ChartContainer config={taxBurdenChartConfig} className="h-[300px] w-full">
            <LineChart data={taxBurdenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis
                domain={[50, 70]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />
                }
              />
              <ReferenceLine
                y={60}
                stroke={COLORS.red}
                strokeDasharray="8 4"
                strokeWidth={2}
                label={{
                  value: 'Limiar de Alerta 60%',
                  position: 'right',
                  fill: COLORS.red,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="taxBurden"
                stroke={COLORS.green}
                strokeWidth={3}
                dot={{ r: 5, fill: COLORS.green, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 7, fill: COLORS.green, strokeWidth: 2, stroke: 'white' }}
              />
            </LineChart>
          </ChartContainer>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
            <Info className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              <strong>Insight:</strong> A carga tributária manteve-se acima de 58% em todo o período, atingindo o pico em 2023 ({((fiscalData[2023]?.impostos_total || 0) / (fiscalData[2023]?.receita_total || 1) * 100).toFixed(1)}%).
              Isso indica alta dependência de impostos como fonte de receita, com baixa diversificação para outras fontes como juros e transferências.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. PER CAPITA REVENUE TABLE / CARDS
      ═══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Table2 className="size-5 text-[#009C3B]" />
                Receita Per Capita por Ano
              </CardTitle>
              <CardDescription className="mt-1">
                {sphereFilter === 'todas' ? 'Receita total' : `Receita ${sphereLabel}`} dividida pela população estimada do IBGE para cada ano
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {perCapitaTableData.map((row: any, idx: number) => {
              if (!row) return null;
              const isPositive = row.variation >= 0;
              return (
                <div
                  key={row.year}
                  className={`p-3 rounded-lg border ${
                    idx === perCapitaTableData.length - 1 ? 'ring-2 ring-[#009C3B]/30 bg-[#009C3B]/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{row.year}</span>
                    {idx > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isPositive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {isPositive ? '+' : ''}{row.variation.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">{sphereFilter === 'todas' ? 'Receita' : `Receita ${sphereLabel}`}</span>
                      <p className="font-mono font-medium">{formatPerCapita(row.recPerCapita)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Impostos{sphereFilter !== 'todas' ? ' *' : ''}</span>
                      <p className="font-mono text-muted-foreground">{formatPerCapita(row.impPerCapita)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Contribuições{sphereFilter !== 'todas' ? ' *' : ''}</span>
                      <p className="font-mono text-muted-foreground">{formatPerCapita(row.contribPerCapita)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">População</span>
                      <p className="text-muted-foreground">{(row.population / 1_000_000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
            <Info className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              <strong>Metodologia:</strong> O valor per capita é calculado dividindo o valor total (em R$ milhões) pela população estimada do IBGE para cada ano, multiplicando por 1.000.000 para converter para reais por habitante.
              Fórmula: <code className="bg-blue-100 px-1 rounded">Valor Per Capita = (Valor em R$ milhões × 1.000.000) / População</code>
              {sphereFilter !== 'todas' && (
                <><br /><strong>* Governo Geral:</strong> Impostos e Contribuições não possuem dados por esfera. Os valores exibidos referem-se ao Governo Geral.</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back to top / Home */}
      <div className="flex justify-center pt-4">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </>
  );
}
