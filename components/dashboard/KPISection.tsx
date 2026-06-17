'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  CreditCard,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Landmark,
} from 'lucide-react';
import { fiscalData, years, getVariation, dbggData, gcData } from '@/lib/brazil-data';
import { useLiveDataContext, DataStatusBadge } from '@/components/dashboard/LiveDataProvider';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Types ───────────────────────────────────────────────────────────

interface KPICardData {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  changePercent: number | null;
  icon: React.ReactNode;
  sentiment: 'positive' | 'negative' | 'neutral';
  accentColor: string;
  tooltip?: string;
  subtitle?: string;
  statusBadge?: React.ReactNode;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatR$Bi(value: number): string {
  const bi = value / 1000;
  const sign = bi < 0 ? '-' : '';
  return `${sign}R$ ${Math.abs(bi).toFixed(1)} bi`;
}

function getSentiment(value: number, invert = false): 'positive' | 'negative' | 'neutral' {
  // For values where negative is bad (most cases)
  if (invert) {
    // For metrics where negative is expected/okay (like ROL which is always negative)
    return 'neutral';
  }
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

function getChangeSentiment(change: number | null, invert = false): 'positive' | 'negative' | 'neutral' {
  if (change === null) return 'neutral';
  if (invert) {
    // For metrics where decrease is good (e.g., despesa, juros)
    if (change < 0) return 'positive';
    if (change > 0) return 'negative';
    return 'neutral';
  }
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
}

// ─── KPI Data Builder ────────────────────────────────────────────────

function buildKPICards(): KPICardData[] {
  const latestYear = years[years.length - 1]; // 2023
  const prevYear = years[years.length - 2]; // 2022
  const latest = fiscalData[latestYear];
  const prev = fiscalData[prevYear];

  if (!latest || !prev) return [];

  const receitaChange = getVariation(prev.receita_total, latest.receita_total);
  const despesaChange = getVariation(prev.despesa_total, latest.despesa_total);
  const rolChange = getVariation(Math.abs(prev.rol), Math.abs(latest.rol));
  const cargaTributaria = (latest.impostos_total / latest.despesa_total) * 100;
  const cargaTributariaPrev = (prev.impostos_total / prev.despesa_total) * 100;
  const cargaChange = cargaTributaria - cargaTributariaPrev;
  const jurosChange = getVariation(prev.juros_despesa, latest.juros_despesa);
  const fbcfChange = getVariation(prev.fbcf, latest.fbcf);

  return [
    {
      id: 'receita',
      title: 'Receita Total',
      value: formatR$Bi(latest.receita_total),
      rawValue: latest.receita_total,
      changePercent: receitaChange,
      icon: <DollarSign className="size-5" />,
      sentiment: getChangeSentiment(receitaChange),
      accentColor: '#009C3B',
    },
    {
      id: 'despesa',
      title: 'Despesa Total',
      value: formatR$Bi(latest.despesa_total),
      rawValue: latest.despesa_total,
      changePercent: despesaChange,
      icon: <CreditCard className="size-5" />,
      sentiment: getChangeSentiment(despesaChange, true),
      accentColor: '#dc2626',
    },
    {
      id: 'rol',
      title: 'Resultado Primário (ROL)',
      value: formatR$Bi(latest.rol),
      rawValue: latest.rol,
      changePercent: rolChange,
      icon: <TrendingDown className="size-5" />,
      sentiment: 'negative',
      accentColor: '#dc2626',
    },
    {
      id: 'carga',
      title: 'Impostos / Despesa',
      value: `${cargaTributaria.toFixed(1)}%`,
      rawValue: cargaTributaria,
      changePercent: cargaChange,
      icon: <Percent className="size-5" />,
      sentiment: getChangeSentiment(cargaChange),
      accentColor: '#FFDF00',
      tooltip: 'Percentual da despesa total coberto por arrecadação de impostos. Fórmula: Impostos ÷ Despesa Total × 100',
      subtitle: 'Impostos como % da despesa total',
    },
    {
      id: 'juros',
      title: 'Juros da Dívida',
      value: formatR$Bi(latest.juros_despesa),
      rawValue: latest.juros_despesa,
      changePercent: jurosChange,
      icon: <AlertTriangle className="size-5" />,
      sentiment: getChangeSentiment(jurosChange, true),
      accentColor: '#dc2626',
    },
    {
      id: 'fbcf',
      title: 'Investimento (FBCF)',
      value: formatR$Bi(latest.fbcf),
      rawValue: latest.fbcf,
      changePercent: fbcfChange,
      icon: <Building2 className="size-5" />,
      sentiment: getChangeSentiment(fbcfChange),
      accentColor: '#009C3B',
    },
  ];
}

// ─── Auto-generated Insights ─────────────────────────────────────────

function generateInsights(rtnAcumulado: { resultadoPrimario: number; receitaTotal: number; despesaTotal: number } | null, rtnMesRef: string): string[] {
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const latest = fiscalData[latestYear];
  const prev = fiscalData[prevYear];
  const first = fiscalData[years[0]];

  if (!latest || !prev || !first) return [];

  const insights: string[] = [];

  // Insight 1: Revenue vs Expenditure gap
  const gap = latest.despesa_total - latest.receita_total;
  const gapBi = (gap / 1000).toFixed(1);
  const firstGap = first.despesa_total - first.receita_total;
  const firstGapBi = (firstGap / 1000).toFixed(0);
  const gapGrowthPct = getVariation(firstGap, gap);
  insights.push(
    `O déficit entre receita e despesa em ${latestYear} foi de R$ ${gapBi} bilhões — ${Math.abs(gapGrowthPct).toFixed(1)}% maior do que o déficit de R$ ${firstGapBi} bilhões registrado em ${years[0]}, evidenciando um desequilíbrio estrutural que se aprofundou no período.`
  );

  // Insight 2: Interest expense trend
  const jurosShare = ((latest.juros_despesa / latest.despesa_total) * 100).toFixed(1);
  const jurosGrowth = getVariation(prev.juros_despesa, latest.juros_despesa);
  insights.push(
    `Os juros da dívida consumiram ${jurosShare}% da despesa total em ${latestYear}, com crescimento de ${jurosGrowth.toFixed(1)}% em relação a ${prevYear} — o maior custo isolado após benefícios sociais.`
  );

  // Insight 3: Investment recovery
  const fbcfGrowth = getVariation(first.fbcf, latest.fbcf);
  const invLiquidoPositive = latest.investimento_liquido > 0;
  insights.push(
    `O investimento público (FBCF) cresceu ${fbcfGrowth.toFixed(0)}% no período, e o investimento líquido ${invLiquidoPositive ? 'voltou ao território positivo' : 'permanece negativo'} em ${latestYear} (${formatR$Bi(latest.investimento_liquido)}).`
  );

  // Insight 4: Impostos / Despesa
  const cargaAtual = ((latest.impostos_total / latest.despesa_total) * 100).toFixed(1);
  insights.push(
    `A relação impostos/despesa atingiu ${cargaAtual}% em ${latestYear} — ou seja, a arrecadação de impostos cobre ${cargaAtual}% da despesa total —, ${latest.impostos_total > prev.impostos_total ? 'superando' : 'abaixo de'} o ano anterior, refletindo ${latest.impostos_total > prev.impostos_total ? 'a expansão da arrecadação' : 'a queda na arrecadação'}.`
  );

  // Insight 5: RTN live data (if available)
  if (rtnAcumulado && rtnMesRef) {
    const rpBi = (rtnAcumulado.resultadoPrimario / 1000).toFixed(1);
    const isPositivo = rtnAcumulado.resultadoPrimario > 0;
    const gdp2025Approx = 11_500_000; // R$ milhões
    const rpPctPIB = ((rtnAcumulado.resultadoPrimario / gdp2025Approx) * 100).toFixed(2);
    insights.push(
      `Em ${rtnMesRef}, o resultado primário acumulado do Governo Central é de ${isPositivo ? '+' : '-'}R$ ${Math.abs(parseFloat(rpBi)).toFixed(1)} bi (${rpPctPIB}% do PIB), ${isPositivo ? 'acima' : 'abaixo'} da meta do arcabouço fiscal (déficit zero ± 0,25% do PIB). Fonte: RTN/STN.`
    );
  }

  return insights;
}

// ─── KPI Card Component ──────────────────────────────────────────────

function KPICard({ data }: { data: KPICardData & { tooltip?: string } }) {
  const changeColor =
    data.sentiment === 'positive'
      ? 'text-green-600'
      : data.sentiment === 'negative'
      ? 'text-red-600'
      : 'text-amber-600';

  const changeBg =
    data.sentiment === 'positive'
      ? 'bg-green-50'
      : data.sentiment === 'negative'
      ? 'bg-red-50'
      : 'bg-amber-50';

  const ChangeIcon =
    data.changePercent !== null && data.changePercent > 0
      ? ArrowUpRight
      : data.changePercent !== null && data.changePercent < 0
      ? ArrowDownRight
      : Minus;

  return (
    <Card className="group relative overflow-hidden py-0 gap-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] cursor-default">
      {/* Color accent bar at top */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: data.accentColor }}
      />

      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
            {data.title}
            {data.tooltip && (
              <span className="ml-1 inline-flex items-center" title={data.tooltip}>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-gray-400 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {data.statusBadge}
          </span>
          <div
            className={`flex-shrink-0 p-1.5 rounded-lg ${changeBg}`}
          >
            <span className={changeColor}>{data.icon}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4 px-4">
        {/* Value */}
        <div className="flex items-baseline gap-2">
          <span
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              data.id === 'rol' ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {data.value}
          </span>
        </div>
        {/* Subtitle for Impostos/Despesa card */}
        {data.subtitle && (
          <p className="text-[10px] text-gray-400 mt-0.5">{data.subtitle}</p>
        )}

        {/* Change indicator */}
        {data.changePercent !== null && (
          <div className="flex items-center gap-1 mt-1.5">
            <ChangeIcon className={`size-3.5 ${changeColor}`} />
            <span className={`text-xs font-semibold ${changeColor}`}>
              {Math.abs(data.changePercent).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400 ml-0.5">vs ano anterior</span>
          </div>
        )}

        {/* Negative indicator for ROL */}
        {data.id === 'rol' && (
          <div className="mt-2 flex items-center gap-1.5 bg-red-50 rounded-md px-2 py-1">
            <TrendingDown className="size-3.5 text-red-500" />
            <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wide">
              Déficit Operacional
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── DBGG KPI Card (Live) ────────────────────────────────────────────

function DBGGKPICard() {
  const { dbgg, isLoading } = useLiveDataContext();

  // Determine the value to display
  const liveValue = dbgg.latest?.value;
  const staticValue = dbggData[2025]; // Fallback from static data

  const displayValue = liveValue ?? staticValue;
  const prevValue = dbggData[2024]; // Previous year for comparison
  const changePercent = displayValue && prevValue ? ((displayValue - prevValue) / prevValue) * 100 : null;

  // Color coding: red if > 90%, amber if 80-90%, green if < 80%
  const getAccentColor = (val: number | null | undefined) => {
    if (!val) return '#6b7280';
    if (val > 90) return '#dc2626';
    if (val > 80) return '#D4A017';
    return '#009C3B';
  };

  const cardData: KPICardData = {
    id: 'dbgg',
    title: 'Dívida Bruta / PIB',
    value: isLoading ? '—' : `${displayValue?.toFixed(1)}%`,
    rawValue: displayValue ?? 0,
    changePercent,
    icon: <Landmark className="size-5" />,
    sentiment: changePercent !== null ? getChangeSentiment(changePercent, true) : 'neutral',
    accentColor: getAccentColor(displayValue),
    tooltip: 'Dívida Bruta do Governo Geral como percentual do PIB (BCB SGS 13762)',
    statusBadge: <DataStatusBadge state={dbgg.state} cachedAt={dbgg.cachedAt} />,
  };

  // Get reference info
  const refDate = dbgg.latest?.date
    ? new Date(dbgg.latest.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : '2025';

  return (
    <Card className="group relative overflow-hidden py-0 gap-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] cursor-default">
      <div className="h-1.5 w-full" style={{ backgroundColor: cardData.accentColor }} />
      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
            {cardData.title}
            <span className="ml-1 inline-flex items-center" title={cardData.tooltip}>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-gray-400 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
            {cardData.statusBadge}
          </span>
          <div className={`flex-shrink-0 p-1.5 rounded-lg ${
            displayValue && displayValue > 90 ? 'bg-red-50' : displayValue && displayValue > 80 ? 'bg-amber-50' : 'bg-green-50'
          }`}>
            <span className={
              displayValue && displayValue > 90 ? 'text-red-600' : displayValue && displayValue > 80 ? 'text-amber-600' : 'text-green-600'
            }>
              {cardData.icon}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4 px-4">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              {cardData.value}
            </span>
          </div>
        )}
        {/* Change indicator */}
        {changePercent !== null && !isLoading && (
          <div className="flex items-center gap-1 mt-1.5">
            {changePercent > 0 ? <ArrowUpRight className="size-3.5 text-red-600" /> : <ArrowDownRight className="size-3.5 text-green-600" />}
            <span className={`text-xs font-semibold ${changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {Math.abs(changePercent).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400 ml-0.5">vs 2024</span>
          </div>
        )}
        {/* Reference info */}
        <p className="text-[10px] text-gray-400 mt-1.5">
          Referência: {refDate} · BCB
        </p>
        {/* Risk zone indicator */}
        {displayValue && !isLoading && (
          <div className={`mt-1.5 flex items-center gap-1.5 rounded-md px-2 py-1 ${
            displayValue > 90 ? 'bg-red-50' : displayValue > 80 ? 'bg-amber-50' : 'bg-green-50'
          }`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wide ${
              displayValue > 90 ? 'text-red-600' : displayValue > 80 ? 'text-amber-600' : 'text-green-600'
            }`}>
              {displayValue > 90 ? '🔴 Zona de Risco' : displayValue > 80 ? '🟡 Atenção' : '🟢 Controlada'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main KPI Section ────────────────────────────────────────────────

export default function KPISection() {
  const { rtn } = useLiveDataContext();
  const kpiCards = buildKPICards();
  const insights = generateInsights(
    rtn.state !== 'error' && rtn.acumuladoAno ? rtn.acumuladoAno : null,
    rtn.mesReferencia
  );
  const latestYear = years[years.length - 1];

  return (
    <section id="visao-executiva" className="scroll-mt-24">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-4">
        {kpiCards.map((card) => (
          <KPICard key={card.id} data={card} />
        ))}
        {/* Live DBGG KPI Card */}
        <DBGGKPICard />
      </div>

      {/* Resumo Executivo */}
      <Card className="mt-6 overflow-hidden border-l-4" style={{ borderLeftColor: '#002776' }}>
        <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#002776' }}>
              <TrendingUp className="size-4 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Resumo Executivo — {latestYear}
              {rtn.state !== 'error' && rtn.mesReferencia && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (+ RTN {rtn.mesReferencia})
                </span>
              )}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-0 px-4 sm:px-6">
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                  style={{ backgroundColor: index % 2 === 0 ? '#009C3B' : '#002776' }}
                >
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
