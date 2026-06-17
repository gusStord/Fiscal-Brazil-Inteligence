'use client';

import React from 'react';
import {
  ComposedChart,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  Cell,
} from 'recharts';
import {
  fiscalData,
  getVariation,
  sphereColors,
} from '@/lib/brazil-data';
import {
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  ChartCard,
  DualAxisTooltip,
  GenericTooltip,
  formatBi,
  COLORS,
  type SphereFilter,
  type ViewMode,
} from './despesas-helpers';

const { RED, GREEN, DARK_ORANGE, LIGHT_GREEN, BLUE, YELLOW, ORANGE, PURPLE, GRAY } = COLORS;

// ─── Props ──────────────────────────────────────────────────────────────────
interface DespesasCharts1Props {
  sphereFilter: SphereFilter;
  viewMode: ViewMode;
  consumoInvestData: any[];
  compositionData: any[];
  cigData: any[];
  waterfallData: any[];
  yAxisFormatter: (value: number) => string;
  applyView: (value: number, year: number) => number;
}

export default function DespesasCharts1({
  sphereFilter,
  viewMode,
  consumoInvestData,
  compositionData,
  cigData,
  waterfallData,
  yAxisFormatter,
  applyView,
}: DespesasCharts1Props) {
  return (
    <>
      {/* SECTION 3: KEY CHART - Consumo de Governo vs Investimento Público */}
      <section>
        <ChartCard
          title="Consumo de Governo vs. Investimento Público"
          description="Evolução temporal: consumo (remuneração + bens/serviços) cresce mais rápido que investimento (FBCF), revelando a divergência estrutural"
          colSpan2
        >
          <div className="h-[360px] md:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={consumoInvestData}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="gradConsumo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RED} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradInvest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={yAxisFormatter}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: viewMode === 'percapita' ? 'R$/hab' : 'R$ bi',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: 'Variação %',
                    angle: 90,
                    position: 'insideRight',
                    offset: 10,
                    fontSize: 11,
                  }}
                />
                <Tooltip content={<DualAxisTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area yAxisId="left" type="monotone" dataKey="consumo_governo" stroke="none" fill="url(#gradConsumo)" name="Consumo de Gov." />
                <Area yAxisId="left" type="monotone" dataKey="investimento_publico" stroke="none" fill="url(#gradInvest)" name="Investimento (FBCF)" />
                <Line yAxisId="left" type="monotone" dataKey="consumo_governo" stroke={RED} strokeWidth={3} dot={{ r: 5, fill: RED, stroke: 'white', strokeWidth: 2 }} name="Consumo de Gov." />
                <Line yAxisId="left" type="monotone" dataKey="investimento_publico" stroke={GREEN} strokeWidth={3} dot={{ r: 5, fill: GREEN, stroke: 'white', strokeWidth: 2 }} name="Investimento (FBCF)" />
                <Line yAxisId="right" type="monotone" dataKey="consumo_growth" stroke={DARK_ORANGE} strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: DARK_ORANGE }} name="Variação Consumo %" />
                <Line yAxisId="right" type="monotone" dataKey="investimento_growth" stroke={LIGHT_GREEN} strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: LIGHT_GREEN }} name="Variação Invest. %" />
                <ReferenceLine yAxisId="left" x={2020} stroke="#999" strokeDasharray="3 3" label={{ value: 'Pandemia', position: 'top', fontSize: 10, fill: '#999' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Narrative insight box */}
          <div className="mt-4 p-3 rounded-lg border flex items-start gap-3" style={{ backgroundColor: `${RED}08`, borderColor: `${RED}30` }}>
            <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Divergência Estrutural:</span>{' '}
              O consumo de governo (remuneração + bens/serviços) cresceu{' '}
              <span className="font-semibold" style={{ color: RED }}>
                {getVariation(fiscalData[2018].remuneracao_empregados + fiscalData[2018].uso_bens_servicos, fiscalData[2023].remuneracao_empregados + fiscalData[2023].uso_bens_servicos).toFixed(1)}%
              </span>{' '}
              de 2018 a 2023, enquanto o investimento público (FBCF) cresceu{' '}
              <span className="font-semibold" style={{ color: GREEN }}>
                {getVariation(fiscalData[2018].fbcf, fiscalData[2023].fbcf).toFixed(1)}%
              </span>{' '}
              no mesmo período. O consumo representa{' '}
              <span className="font-semibold" style={{ color: RED }}>
                {((fiscalData[2023].remuneracao_empregados + fiscalData[2023].uso_bens_servicos) / fiscalData[2023].despesa_total * 100).toFixed(1)}%
              </span>{' '}
              da despesa total em 2023, contra apenas{' '}
              <span className="font-semibold" style={{ color: GREEN }}>
                {(fiscalData[2023].fbcf / fiscalData[2023].despesa_total * 100).toFixed(1)}%
              </span>{' '}
              para investimento.
            </div>
          </div>

          {sphereFilter !== 'todas' && (
            <div className="mt-3 p-2 rounded-md border flex items-center gap-2" style={{ backgroundColor: `${sphereColors[sphereFilter].primary}08`, borderColor: `${sphereColors[sphereFilter].primary}25` }}>
              <Info className="size-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-[10px] text-muted-foreground">
                <span className="font-semibold">Dados reais por esfera</span> \u2014 Fonte: IBGE/CIG
              </p>
            </div>
          )}
        </ChartCard>
      </section>

      {/* SECTION 4: Despesa Composition Breakdown (Stacked Bar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Composição da Despesa"
          description="Evolução da composição: Remuneração, Juros, Benefícios, Bens/Serviços, Subsídios, FBCF e Outras"
          colSpan2
        >
          <div className="h-[340px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compositionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip content={<GenericTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="remuneracao" stackId="a" fill={BLUE} name="Remuneração" />
                <Bar dataKey="juros" stackId="a" fill={RED} name="Juros" />
                <Bar dataKey="beneficios_sociais" stackId="a" fill={YELLOW} name="Benefícios Sociais" />
                <Bar dataKey="bens_servicos" stackId="a" fill={ORANGE} name="Bens e Serviços" />
                <Bar dataKey="subsidios" stackId="a" fill={PURPLE} name="Subsídios" />
                <Bar dataKey="fbcf" stackId="a" fill={GREEN} name="FBCF" />
                <Bar dataKey="outras" stackId="a" fill={GRAY} name="Outras" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {sphereFilter !== 'todas' && (
            <div className="mt-2 p-2 rounded-md border flex items-center gap-2" style={{ backgroundColor: `${sphereColors[sphereFilter].primary}08`, borderColor: `${sphereColors[sphereFilter].primary}25` }}>
              <Info className="size-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-[10px] text-muted-foreground">
                <span className="font-semibold">Dados reais por esfera</span> \u2014 Fonte: IBGE/CIG
              </p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* SECTION 5: Consumo Intermediário vs VAB (CIG) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Produção → Consumo Intermediário → VAB"
          description="Dados CIG: a relação entre produção total, consumo intermediário e valor adicionado bruto do setor público"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cigData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradProducao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip content={<DualAxisTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="producao" stroke={BLUE} fill="url(#gradProducao)" strokeWidth={2} name="Produção" />
                <Line type="monotone" dataKey="consumo_intermediario" stroke={RED} strokeWidth={2.5} dot={{ r: 4, fill: RED }} name="Consumo Interm." />
                <Line type="monotone" dataKey="vab_pib" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4, fill: GREEN }} name="VAB/PIB" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Decomposição CIG 2023"
          description="Waterfall: Produção total → Consumo Intermediário (dedução) → VAB/PIB (resultado)"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const absVal = Math.abs(value);
                    return [formatBi(absVal), name];
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Valor">
                  {waterfallData.map((entry: any, index: number) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Produção', value: fiscalData[2023].producao, color: BLUE, pct: '100%' },
              { label: 'Consumo Interm.', value: fiscalData[2023].consumo_intermediario, color: RED, pct: `${(fiscalData[2023].consumo_intermediario / fiscalData[2023].producao * 100).toFixed(1)}%` },
              { label: 'VAB/PIB', value: fiscalData[2023].vab_pib, color: GREEN, pct: `${(fiscalData[2023].vab_pib / fiscalData[2023].producao * 100).toFixed(1)}%` },
            ].map((item) => (
              <div key={item.label} className="p-2 rounded-lg border" style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}08` }}>
                <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                <p className="text-sm font-bold" style={{ color: item.color }}>{formatBi(applyView(item.value, 2023))}</p>
                <p className="text-[10px] text-muted-foreground">{item.pct} da produção</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* CIG sphere notice */}
      {sphereFilter !== 'todas' && (
        <div className="p-2.5 rounded-lg border flex items-center gap-2" style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac40' }}>
          <Info className="size-4 text-green-600 flex-shrink-0" />
          <p className="text-[10px] text-green-800">
            <span className="font-semibold">Dados CIG consolidados:</span> Produção, Consumo Intermediário e VAB refletem o Governo Geral (não disponíveis por esfera). Os demais componentes utilizam dados reais por esfera \u2014 Fonte: IBGE/CIG.
          </p>
        </div>
      )}
    </>
  );
}
