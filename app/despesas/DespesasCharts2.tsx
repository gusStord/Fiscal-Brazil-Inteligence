'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts';
import {
  fiscalData,
  years,
  getVariation,
  sphereColors,
} from '@/lib/brazil-data';
import {
  ArrowLeft,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  ChartCard,
  GenericTooltip,
  PctTooltip,
  formatBi,
  COLORS,
  sphereLabels,
  type SphereFilter,
  type ViewMode,
} from './despesas-helpers';

const { RED, GREEN, BLUE, PURPLE, TEAL } = COLORS;

// ─── Props ──────────────────────────────────────────────────────────────────
interface DespesasCharts2Props {
  sphereFilter: SphereFilter;
  viewMode: ViewMode;
  beneficiosData: any[];
  sphereDonutData: any[];
  sphereDonutTotal: number;
  yAxisFormatter: (value: number) => string;
  applyView: (value: number, year: number) => number;
}

export default function DespesasCharts2({
  sphereFilter,
  beneficiosData,
  sphereDonutData,
  sphereDonutTotal,
  yAxisFormatter,
  applyView,
}: DespesasCharts2Props) {
  // Donut label renderer
  const donutLabelRender = React.useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
      if (percent < 0.05) return null;
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
          {(percent * 100).toFixed(0)}%
        </text>
      );
    },
    []
  );

  return (
    <>
      {/* SECTION 6: Benefícios Sociais Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Benefícios Sociais: Seguridade vs. Assistência"
          description="Evolução dos benefícios previdenciários (seguridade) e assistenciais em valores absolutos"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={beneficiosData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradSeguridade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradAssistencia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip content={<GenericTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="beneficios_seguridade" stroke={BLUE} fill="url(#gradSeguridade)" strokeWidth={2} name="Seguridade" />
                <Area type="monotone" dataKey="beneficios_assistencia" stroke={TEAL} fill="url(#gradAssistencia)" strokeWidth={2} name="Assistência" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Benefícios como % da Despesa Total"
          description="Participação crescente dos benefícios sociais na despesa pública — a pressão previdenciária"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={beneficiosData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradPctTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v: number) => `${v.toFixed(0)}%`} tick={{ fontSize: 11 }} />
                <Tooltip content={<PctTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="pct_seguridade" stroke={BLUE} fill={`${BLUE}20`} strokeWidth={2} name="Seguridade (%)" />
                <Area type="monotone" dataKey="pct_assistencia" stroke={TEAL} fill={`${TEAL}20`} strokeWidth={2} name="Assistência (%)" />
                <Line type="monotone" dataKey="pct_total" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 4, fill: PURPLE }} name="Total Benefícios (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-lg border flex items-start gap-2" style={{ backgroundColor: `${PURPLE}08`, borderColor: `${PURPLE}30` }}>
            <TrendingUp className="size-4 flex-shrink-0 mt-0.5" style={{ color: PURPLE }} />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Tendência crescente:</span>{' '}
              Os benefícios sociais passaram de{' '}
              <span className="font-semibold" style={{ color: PURPLE }}>
                {((fiscalData[2018].beneficios_seguridade + fiscalData[2018].beneficios_assistencia) / fiscalData[2018].despesa_total * 100).toFixed(1)}%
              </span>{' '}
              da despesa em 2018 para{' '}
              <span className="font-semibold" style={{ color: PURPLE }}>
                {((fiscalData[2023].beneficios_seguridade + fiscalData[2023].beneficios_assistencia) / fiscalData[2023].despesa_total * 100).toFixed(1)}%
              </span>{' '}
              em 2023 — um aumento de{' '}
              <span className="font-semibold" style={{ color: PURPLE }}>
                {(((fiscalData[2023].beneficios_seguridade + fiscalData[2023].beneficios_assistencia) / fiscalData[2023].despesa_total * 100) - ((fiscalData[2018].beneficios_seguridade + fiscalData[2018].beneficios_assistencia) / fiscalData[2018].despesa_total * 100)).toFixed(1)} p.p.
              </span>
            </p>
          </div>
        </ChartCard>
      </div>

      {/* Benefícios sphere notice */}
      {sphereFilter !== 'todas' && (
        <div className="p-2.5 rounded-lg border flex items-center gap-2" style={{ backgroundColor: `${BLUE}08`, borderColor: `${BLUE}25` }}>
          <Info className="size-4 flex-shrink-0" style={{ color: BLUE }} />
          <p className="text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">Benefícios com dados reais por esfera:</span> Os totais de benefícios utilizam dados reais do IBGE/CIG por esfera. A divisão entre Seguridade e Assistência é estimada pela proporção do Governo Geral.
          </p>
        </div>
      )}

      {/* SECTION 7: Despesa by Sphere (Donut) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Despesa por Esfera de Governo (2023)"
          description="Participação Federal, Estadual e Municipal na despesa total"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sphereDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={donutLabelRender}
                >
                  {sphereDonutData.map((entry: any, index: number) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                      style={{
                        opacity: sphereFilter !== 'todas' && entry.name !== sphereLabels[sphereFilter] ? 0.3 : 1,
                        transition: 'opacity 0.3s ease',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${formatBi(value)} (${((value / sphereDonutTotal) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value: string) => <span className="text-foreground">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Evolução da Despesa por Esfera"
          description="Comparação temporal: Federal, Estadual e Municipal (2018-2023)"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={years.map((y) => ({
                  year: y,
                  Federal: applyView(fiscalData[y].despesa_federal, y),
                  Estadual: applyView(fiscalData[y].despesa_estadual, y),
                  Municipal: applyView(fiscalData[y].despesa_municipal, y),
                }))}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip content={<GenericTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Federal" fill={sphereColors.federal.primary} name="Federal" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Estadual" fill={sphereColors.estadual.primary} name="Estadual" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Municipal" fill={sphereColors.municipal.primary} name="Municipal" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Federal', data18: fiscalData[2018].despesa_federal, data23: fiscalData[2023].despesa_federal, color: sphereColors.federal.primary },
              { label: 'Estadual', data18: fiscalData[2018].despesa_estadual, data23: fiscalData[2023].despesa_estadual, color: sphereColors.estadual.primary },
              { label: 'Municipal', data18: fiscalData[2018].despesa_municipal, data23: fiscalData[2023].despesa_municipal, color: sphereColors.municipal.primary },
            ].map((s) => {
              const growth = getVariation(s.data18, s.data23);
              return (
                <div key={s.label} className="p-2 rounded-lg border text-center" style={{ borderColor: `${s.color}30`, backgroundColor: `${s.color}08` }}>
                  <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-lg font-bold" style={{ color: s.color }}>+{growth.toFixed(0)}%</p>
                  <p className="text-[10px] text-muted-foreground">2018→2023</p>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Back to top link */}
      <div className="flex justify-center pt-4 pb-2">
        <Link href="#top" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="size-3 rotate-90" />
          Voltar ao topo
        </Link>
      </div>
    </>
  );
}
