'use client';

import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  BarChart3,
  Award,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { fiscalData, years, calculateIndices } from '@/lib/brazil-data';
import SectionAnchor from '@/components/dashboard/SectionAnchor';

// ─── Types ───────────────────────────────────────────────────────────

interface IndexConfig {
  key: 'indiceDesenvolvimento' | 'indiceRisco' | 'indiceEstabilidade' | 'indiceAtratividade';
  title: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  methodology: string;
  invertRisk?: boolean;
}

// ─── Index Configurations ────────────────────────────────────────────

const indexConfigs: IndexConfig[] = [
  {
    key: 'indiceDesenvolvimento',
    title: 'Índice de Desenvolvimento Fiscal',
    icon: <TrendingUp className="size-5" />,
    color: '#009C3B',
    bgLight: '#dcfce7',
    methodology:
      'Calculado a partir de 3 componentes com pesos: Diversificação de Receitas (35%) — mede a proporção de impostos sobre a receita total, indicando base tributária diversificada; Capacidade de Investimento (30%) — avalia o FBCF como proporção da despesa, indicando compromisso com investimentos; Equilíbrio Fiscal (35%) — combina o ROL com a despesa total para medir sustentabilidade fiscal. Cada componente é normalizado para 0-100 antes da ponderação.',
  },
  {
    key: 'indiceRisco',
    title: 'Índice de Risco Econômico',
    icon: <TrendingDown className="size-5" />,
    color: '#dc2626',
    bgLight: '#fef2f2',
    invertRisk: true,
    methodology:
      'Mede o risco econômico-fiscal a partir de 3 indicadores normalizados contra benchmarks realistas (0–30%): Razão de Déficit (35%) — ROL negativo como proporção da despesa; Serviço da Dívida (40%) — juros como proporção da despesa, indicando comprometimento com pagamentos; Volatilidade de Receita (25%) — diferença entre receita e despesa como proporção da despesa. Fórmula: (Déficit/0,30 × 100) × 0,35 + (Juros/Desp ÷ 0,30 × 100) × 0,40 + (Volatilidade/0,30 × 100) × 0,25. Valores mais altos indicam MAIOR risco. Na exibição, invertemos a escala (100 − risco) para facilitar a leitura: quanto maior o número visível, melhor.',
  },
  {
    key: 'indiceEstabilidade',
    title: 'Índice de Estabilidade',
    icon: <Shield className="size-5" />,
    color: '#002776',
    bgLight: '#eff6ff',
    methodology:
      'Avalia a estabilidade das contas públicas com dois componentes: Controle de Despesa (50%) — mede a razão despesa/receita, penalizando quando a despesa excede a receita; Estabilidade de Receita (50%) — avalia a proporção de contribuições sociais na receita, indicando fontes de receita mais estáveis e previsíveis. Ambos normalizados para 0-100.',
  },
  {
    key: 'indiceAtratividade',
    title: 'Índice de Atratividade para Investimento',
    icon: <Award className="size-5" />,
    color: '#FFDF00',
    bgLight: '#fefce8',
    methodology:
      'Compõe a atratividade do Brasil para investidores a partir de: Tamanho de Mercado (30%) — VAB/PIB como indicador de escala econômica; Infraestrutura (30%) — FBCF como proporção, indicando investimento em capital; Investimento Social (15%) — benefícios sociais como proporção da despesa, indicando desenvolvimento humano; Risco Complementar (25%) — complementa com o inverso do Índice de Risco Econômico, premiando menor risco.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 70) return '#009C3B';
  if (score >= 50) return '#86efac';
  if (score >= 30) return '#FFDF00';
  return '#dc2626';
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'Bom';
  if (score >= 50) return 'Moderado';
  if (score >= 30) return 'Atenção';
  return 'Crítico';
}

function getScoreBg(score: number): string {
  if (score >= 70) return '#dcfce7';
  if (score >= 50) return '#bbf7d0';
  if (score >= 30) return '#fefce8';
  return '#fef2f2';
}

// SVG Circular Progress Component
function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function IndicesSection() {
  // Calculate indices for all years
  const indicesByYear = useMemo(() => {
    return years.map((year) => ({
      year,
      ...calculateIndices(fiscalData[year]),
    }));
  }, []);

  const latestIndices = indicesByYear[indicesByYear.length - 1];

  // Build sparkline data
  const sparklineData = useMemo(() => {
    return indexConfigs.map((config) => {
      const data = indicesByYear.map((item) => ({
        year: item.year,
        value: config.invertRisk ? 100 - item[config.key] : item[config.key],
      }));
      return { key: config.key, data };
    });
  }, [indicesByYear]);

  // General score (average of all 4, with risk inverted)
  const generalScore = useMemo(() => {
    const values = indexConfigs.map((config) => {
      const raw = latestIndices[config.key];
      return config.invertRisk ? 100 - raw : raw;
    });
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  }, [latestIndices]);

  return (
    <section id="indices" className="scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: '#009C3B' }}
        >
          <BarChart3 className="size-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group">
            Índices Compostos
            <SectionAnchor id="indices" />
          </h2>
          <p className="text-sm text-gray-500">
            Indicadores agregados para avaliação fiscal do Brasil
          </p>
        </div>
      </div>

      {/* Index Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {indexConfigs.map((config, idx) => {
          const rawScore = latestIndices[config.key];
          const displayScore = config.invertRisk ? Math.round((100 - rawScore) * 10) / 10 : rawScore;
          const scoreColor = getScoreColor(displayScore);
          const scoreLabel = getScoreLabel(displayScore);
          const spark = sparklineData.find((s) => s.key === config.key);

          return (
            <Card
              key={config.key}
              className="relative overflow-hidden py-0 gap-0 transition-all duration-300 hover:shadow-lg"
              style={{ borderTop: `3px solid ${config.color}` }}
            >
              <CardHeader className="pt-5 pb-2 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: config.bgLight }}
                    >
                      <span style={{ color: config.color }}>{config.icon}</span>
                    </div>
                    <CardTitle
                      className="text-sm sm:text-base font-bold"
                      style={{ color: config.color }}
                    >
                      {config.title}
                    </CardTitle>
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: getScoreBg(displayScore),
                      color: scoreColor,
                    }}
                  >
                    {scoreLabel}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="px-4 sm:px-6 pb-5">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Circular Progress */}
                  <div className="relative flex-shrink-0">
                    <CircularProgress
                      value={displayScore}
                      size={100}
                      strokeWidth={7}
                      color={scoreColor}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="text-2xl font-black"
                        style={{ color: scoreColor }}
                      >
                        {displayScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        /100
                      </span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="flex-1 min-w-0 h-16">
                    {spark && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={spark.data}>
                          <XAxis
                            dataKey="year"
                            tick={{ fontSize: 9, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip
                            contentStyle={{
                              fontSize: 11,
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                            formatter={(value: number) => [
                              value.toFixed(1),
                              config.invertRisk ? 'Segurança' : 'Score',
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={config.color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: config.color, strokeWidth: 0 }}
                            activeDot={{ r: 4, stroke: config.color, strokeWidth: 2, fill: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Accordion for methodology */}
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="methodology" className="border-b-0">
                    <AccordionTrigger className="py-2 text-xs font-medium text-gray-500 hover:no-underline hover:text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Info className="size-3.5" />
                        Como é calculado
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {config.methodology}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Score Geral do Brasil */}
      <Card
        className="relative overflow-hidden py-0 gap-0 border-2"
        style={{ borderColor: '#009C3B' }}
      >
        <div
          className="h-2 w-full"
          style={{
            background: 'linear-gradient(90deg, #009C3B 0%, #FFDF00 33%, #002776 66%, #dc2626 100%)',
          }}
        />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Circular Progress */}
            <div className="relative flex-shrink-0">
              <CircularProgress
                value={generalScore}
                size={140}
                strokeWidth={10}
                color={getScoreColor(generalScore)}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-4xl font-black"
                  style={{ color: getScoreColor(generalScore) }}
                >
                  {generalScore.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  /100
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Award className="size-6" style={{ color: '#009C3B' }} />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Score Geral do Brasil
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Média ponderada dos quatro índices compostos, oferecendo uma visão consolidada
                da saúde fiscal brasileira. O índice de risco é invertido para que valores mais
                altos sempre indiquem melhor situação.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: getScoreBg(generalScore),
                    color: getScoreColor(generalScore),
                  }}
                >
                  {getScoreLabel(generalScore)}
                </span>
                <span className="text-xs text-gray-400">
                  Baseado em dados de {years[years.length - 1]}
                </span>
              </div>

              {/* Mini breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {indexConfigs.map((config) => {
                  const raw = latestIndices[config.key];
                  const displayVal = config.invertRisk
                    ? Math.round((100 - raw) * 10) / 10
                    : raw;
                  return (
                    <div
                      key={config.key}
                      className="rounded-lg px-3 py-2 text-center"
                      style={{ backgroundColor: config.bgLight }}
                    >
                      <p
                        className="text-lg font-bold"
                        style={{ color: config.color }}
                      >
                        {displayVal.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                        {config.title.split(' ').slice(-2).join(' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
