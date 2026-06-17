'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { benchmarkData, dbggData } from '@/lib/brazil-data';
import { useLiveDataContext } from '@/components/dashboard/LiveDataProvider';

// ─── Colors ──────────────────────────────────────────────────────────────────
const BRAZIL_GREEN = '#009C3B';
const DEFAULT_BAR = '#94a3b8'; // slate-400
const HIGHLIGHT_BAR = '#009C3B';

// ─── Indicator definitions ───────────────────────────────────────────────────
interface IndicatorDef {
  key: keyof Pick<typeof benchmarkData, 'publicDebt' | 'primaryBalance' | 'interestOnExpense' | 'taxBurden' | 'publicInvestmentGDP'>;
  title: string;
  description: string;
  unit: string;
  higherIsBetter: boolean; // for color-coding context in tooltip
}

const indicators: IndicatorDef[] = [
  {
    key: 'publicDebt',
    title: 'Dívida Bruta / PIB (DBGG)',
    description: 'Dívida bruta do governo geral como percentual do PIB',
    unit: '% PIB',
    higherIsBetter: false,
  },
  {
    key: 'primaryBalance',
    title: 'Resultado Primário / PIB',
    description: 'Saldo primário como percentual do PIB (positivo = superávit)',
    unit: '% PIB',
    higherIsBetter: true,
  },
  {
    key: 'interestOnExpense',
    title: 'Juros sobre Despesa Total',
    description: 'Participação dos juros na despesa total do governo',
    unit: '%',
    higherIsBetter: false,
  },
  {
    key: 'taxBurden',
    title: 'Carga Tributária / PIB',
    description: 'Arrecadação tributária como percentual do PIB',
    unit: '% PIB',
    higherIsBetter: false, // neutral but leaning negative for Brazil's context
  },
  {
    key: 'publicInvestmentGDP',
    title: 'Investimento Público / PIB',
    description: 'Investimento público como percentual do PIB',
    unit: '% PIB',
    higherIsBetter: true,
  },
];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
interface ComparisonTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { country: string; value: number; isBrazil: boolean; label: string } }>;
  unit?: string;
}

function ComparisonTooltip({ active, payload, unit }: ComparisonTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-foreground flex items-center gap-1.5">
        {d.isBrazil && '🇧🇷 '}{d.country}
        {d.isBrazil && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: BRAZIL_GREEN, color: 'white' }}>
            BR
          </span>
        )}
      </p>
      <p className="text-xs text-muted-foreground">
        {d.value.toFixed(1)}{unit ? ` ${unit}` : ''}
      </p>
      {d.isBrazil && d.label && (
        <p className="text-[10px] text-blue-500 mt-0.5">{d.label}</p>
      )}
    </div>
  );
}

// ─── Fade-in Hook ────────────────────────────────────────────────────────────
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

// ─── Chart Card Wrapper ──────────────────────────────────────────────────────
function IndicatorChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { ref, visible } = useFadeIn();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InternationalComparisonSection() {
  const { dbgg } = useLiveDataContext();

  // Get the live DBGG value for Brazil if available
  const liveDbgg = dbgg.latest?.value;
  const hasLiveData = liveDbgg !== null && liveDbgg !== undefined && dbgg.state !== 'error';

  const chartData = useMemo(() => {
    return indicators.map((ind) => {
      const values = benchmarkData[ind.key] as number[];

      // For publicDebt indicator, replace Brazil's value with live data if available
      const adjustedValues = values.map((val, i) => {
        if (ind.key === 'publicDebt' && benchmarkData.countries[i] === 'Brasil' && hasLiveData && liveDbgg) {
          return liveDbgg;
        }
        return val;
      });

      return {
        ...ind,
        data: benchmarkData.countries.map((country, i) => ({
          country,
          value: adjustedValues[i],
          isBrazil: country === 'Brasil',
          // Add special label for Brazil
          label: country === 'Brasil'
            ? (ind.key === 'publicDebt' && hasLiveData
              ? '🇧🇷 Brasil — ao vivo (BCB)'
              : '🇧🇷 Brasil (FMI, 2023)')
            : `${country} (FMI, 2023)`,
        })).sort((a, b) => b.value - a.value), // sort descending for horizontal bars
      };
    });
  }, [hasLiveData, liveDbgg]);

  return (
    <section id="comparacao-internacional" className="py-8 px-4 md:px-8 scroll-mt-24">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Comparação Internacional Expandida
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          Brasil comparado com países da América Latina e economias avançadas em indicadores fiscais-chave
        </p>
        <p className="mt-1 text-xs text-muted-foreground italic">
          Fonte: FMI (World Economic Outlook) e OCDE
          {hasLiveData && (
            <span className="text-green-600 font-medium"> · DBGG Brasil: BCB (ao vivo)</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {chartData.map((indicator) => (
          <IndicatorChartCard
            key={indicator.key}
            title={indicator.title}
            description={indicator.description}
          >
            <div className="h-[360px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={indicator.data}
                  layout="vertical"
                  margin={{ top: 5, right: 40, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="country"
                    tick={{ fontSize: 12 }}
                    width={75}
                    tickFormatter={(v: string) => v}
                  />
                  <Tooltip content={<ComparisonTooltip unit={indicator.unit} />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} name={indicator.title} barSize={24}>
                    {indicator.data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.isBrazil ? HIGHLIGHT_BAR : DEFAULT_BAR}
                        stroke={entry.isBrazil ? '#006625' : 'none'}
                        strokeWidth={entry.isBrazil ? 2 : 0}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v: number) => `${v.toFixed(1)}%`}
                      style={{ fontSize: 11, fill: '#555' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </IndicatorChartCard>
        ))}
      </div>

      {/* Legend / Explanation */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-6 rounded" style={{ backgroundColor: HIGHLIGHT_BAR }} />
          <span className="font-medium">🇧🇷 Brasil {hasLiveData ? '(ao vivo — BCB)' : '(destaque)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-6 rounded" style={{ backgroundColor: DEFAULT_BAR }} />
          <span>Outros países (FMI, 2023)</span>
        </div>
      </div>
    </section>
  );
}
