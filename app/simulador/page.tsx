'use client';

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calculator,
  RotateCcw,
  Share2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ─── 2023 Base Values (R$ Milhões) ───────────────────────────────────────────
const BASE = {
  receitaTotal: 4_114_353.21,
  despesaTotal: 4_912_999.12,
  jurosDivida: 890_366.13,
  beneficiosPrev: 975_032.74,
  remuneracaoServ: 1_181_208.30,
  fbcf: 214_461.26,
  rol: -798_645.91,
} as const;

// ─── Slider Definitions ───────────────────────────────────────────────────────
interface SliderDef {
  key: string;
  label: string;
  baseValue: number;
  min: number;
  max: number;
  step: number;
  color: string;
  urlKey: string;
}

const SLIDERS: SliderDef[] = [
  {
    key: 'juros',
    label: 'Reduzir/Aumentar juros',
    baseValue: BASE.jurosDivida,
    min: -50,
    max: 50,
    step: 1,
    color: '#E74C3C',
    urlKey: 'juros',
  },
  {
    key: 'fbcf',
    label: 'Reduzir/Ampliar investimento',
    baseValue: BASE.fbcf,
    min: -30,
    max: 100,
    step: 1,
    color: '#009C3B',
    urlKey: 'fbcf',
  },
  {
    key: 'receita',
    label: 'Queda/Aumento de arrecadação',
    baseValue: BASE.receitaTotal,
    min: -20,
    max: 30,
    step: 1,
    color: '#002776',
    urlKey: 'receita',
  },
  {
    key: 'beneficios',
    label: 'Reforma/Expansão previdenciária',
    baseValue: BASE.beneficiosPrev,
    min: -20,
    max: 30,
    step: 1,
    color: '#D4A017',
    urlKey: 'prev',
  },
  {
    key: 'remuneracao',
    label: 'Reduzir/Aumentar folha pública',
    baseValue: BASE.remuneracaoServ,
    min: -20,
    max: 20,
    step: 1,
    color: '#8B5CF6',
    urlKey: 'serv',
  },
];

// ─── Formatters ───────────────────────────────────────────────────────────────
function fmtBi(valueInMillions: number): string {
  const bi = valueInMillions / 1000;
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return formatter.format(bi);
}

function fmtPct(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
}

type SliderValues = Record<string, number>;

// ─── Main Content ─────────────────────────────────────────────────────────────
function SimuladorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialValues = useCallback((): SliderValues => {
    const vals: SliderValues = {};
    for (const s of SLIDERS) {
      const urlVal = searchParams.get(s.urlKey);
      if (urlVal !== null) {
        const parsed = parseInt(urlVal, 10);
        if (!isNaN(parsed) && parsed >= s.min && parsed <= s.max) {
          vals[s.key] = parsed;
        } else {
          vals[s.key] = 0;
        }
      } else {
        vals[s.key] = 0;
      }
    }
    return vals;
  }, [searchParams]);

  const [sliderValues, setSliderValues] = useState<SliderValues>(getInitialValues);

  // Adjusted values
  const adjustedValues = useMemo(() => {
    const result: Record<string, number> = {};
    for (const s of SLIDERS) {
      const pct = sliderValues[s.key] || 0;
      result[s.key] = s.baseValue * (1 + pct / 100);
    }
    return result;
  }, [sliderValues]);

  // Calculate results
  const calc = useMemo(() => {
    const newJuros = adjustedValues['juros'];
    const newFbcf = adjustedValues['fbcf'];
    const newBeneficios = adjustedValues['beneficios'];
    const newRemuneracao = adjustedValues['remuneracao'];
    const newReceita = adjustedValues['receita'];

    const deltaJuros = newJuros - BASE.jurosDivida;
    const deltaFbcf = newFbcf - BASE.fbcf;
    const deltaBeneficios = newBeneficios - BASE.beneficiosPrev;
    const deltaRemuneracao = newRemuneracao - BASE.remuneracaoServ;

    const newDespesa = BASE.despesaTotal + deltaJuros + deltaFbcf + deltaBeneficios + deltaRemuneracao;
    const newRol = newReceita - newDespesa;
    const deficitBi = newRol / 1000;
    const interestPct = (newJuros / newDespesa) * 100;

    let status: 'insustentavel' | 'atencao' | 'equilibrado' = 'equilibrado';
    if (deficitBi < -1000) {
      status = 'insustentavel';
    } else if (deficitBi < -200) {
      status = 'atencao';
    }

    return {
      newReceita,
      newDespesa,
      newRol,
      newJuros,
      deficitBi,
      interestPct,
      status,
      deltaRol: newRol - BASE.rol,
    };
  }, [adjustedValues]);

  const handleSliderChange = (key: string, value: number[]) => {
    setSliderValues((prev) => ({ ...prev, [key]: value[0] }));
  };

  const handleReset = () => {
    const reset: SliderValues = {};
    for (const s of SLIDERS) {
      reset[s.key] = 0;
    }
    setSliderValues(reset);
    router.push('/simulador');
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    for (const s of SLIDERS) {
      const val = sliderValues[s.key];
      if (val !== 0) {
        params.set(s.urlKey, String(val));
      }
    }
    const url = `${window.location.origin}/simulador${params.toString() ? '?' + params.toString() : ''}`;
    navigator.clipboard.writeText(url).then(() => {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 bg-[#002776] text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium';
      toast.textContent = 'Link copiado para a área de transferência!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    });
  };

  const statusConfig = {
    insustentavel: {
      icon: <XCircle className="size-6" />,
      label: 'Insustentável',
      color: '#E74C3C',
      bg: '#FEE2E2',
      emoji: '🔴',
      description: 'ROL pior que -R$ 1.000 bi',
    },
    atencao: {
      icon: <AlertTriangle className="size-6" />,
      label: 'Atenção',
      color: '#D4A017',
      bg: '#FEF3C7',
      emoji: '🟡',
      description: 'ROL entre -R$ 999 bi e -R$ 200 bi',
    },
    equilibrado: {
      icon: <CheckCircle2 className="size-6" />,
      label: 'Equilibrado',
      color: '#009C3B',
      bg: '#DCFCE7',
      emoji: '🟢',
      description: 'ROL melhor que -R$ 200 bi',
    },
  };

  const currentStatus = statusConfig[calc.status];
  const isAnySliderMoved = Object.values(sliderValues).some((v) => v !== 0);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <section className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#002776] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Voltar ao Dashboard
          </Link>
        </div>
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-xl shadow-sm"
            style={{ backgroundColor: '#002776' }}
          >
            <Calculator className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Simulador de Política Fiscal
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Ajuste os parâmetros e veja o impacto nas contas públicas em tempo real
            </p>
          </div>
        </div>
      </section>

      {/* 2023 Baseline Reference */}
      <Card className="border-l-4" style={{ borderLeftColor: '#002776' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-xl">📊</span> Valores Base (ano 2023 — referência)
          </CardTitle>
          <CardDescription>
            Valores reais de 2023 utilizados como ponto de partida. Não são editáveis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Receita Total', value: BASE.receitaTotal, color: '#009C3B' },
              { label: 'Despesa Total', value: BASE.despesaTotal, color: '#E74C3C' },
              { label: 'Juros da Dívida', value: BASE.jurosDivida, color: '#E74C3C' },
              { label: 'Benefícios Prev.', value: BASE.beneficiosPrev, color: '#D4A017' },
              { label: 'Remun. Servidores', value: BASE.remuneracaoServ, color: '#8B5CF6' },
              { label: 'Investimento (FBCF)', value: BASE.fbcf, color: '#009C3B' },
              { label: 'ROL base', value: BASE.rol, color: '#6b7280' },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-gray-50 border">
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">{item.label}</div>
                <div className="text-xs sm:text-sm font-bold" style={{ color: item.color }}>
                  {fmtBi(item.value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sliders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-xl">🎛️</span> Simulação de Política Fiscal
          </CardTitle>
          <CardDescription>
            Mova os sliders para ajustar cada variável e observe o impacto em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {SLIDERS.map((s) => {
            const currentPct = sliderValues[s.key] || 0;
            const adjustedVal = adjustedValues[s.key];

            return (
              <div key={s.key} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium text-gray-700 truncate cursor-help">
                            {s.label}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>Base 2023: {fmtBi(s.baseValue)}</p>
                          <p>Ajuste: {fmtPct(currentPct)} = {fmtBi(adjustedVal)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono"
                      style={{
                        borderColor: s.color,
                        color: s.color,
                      }}
                    >
                      {fmtPct(currentPct)}
                    </Badge>
                    <span className="text-sm font-bold text-gray-900 min-w-[100px] text-right">
                      {fmtBi(adjustedVal)}
                    </span>
                  </div>
                </div>
                <Slider
                  value={[currentPct]}
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  onValueChange={(val) => handleSliderChange(s.key, val)}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>{fmtPct(s.min)}</span>
                  <span className="text-gray-500 font-medium">0% (real 2023)</span>
                  <span>{fmtPct(s.max)}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2"
          disabled={!isAnySliderMoved}
        >
          <RotateCcw className="size-4" />
          ↺ Resetar para 2023
        </Button>
        <Button
          onClick={handleShare}
          className="gap-2 text-white"
          style={{ backgroundColor: '#002776' }}
        >
          <Share2 className="size-4" />
          🔗 Compartilhar cenário
        </Button>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Indicator */}
        <Card
          className="lg:col-span-1 border-2"
          style={{
            borderColor: currentStatus.color,
            backgroundColor: currentStatus.bg,
          }}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div style={{ color: currentStatus.color }}>{currentStatus.icon}</div>
            <div>
              <div
                className="text-2xl font-bold"
                style={{ color: currentStatus.color }}
              >
                {currentStatus.emoji} {currentStatus.label}
              </div>
              <div className="text-xs mt-1 opacity-70">{currentStatus.description}</div>
            </div>
            <Separator className="my-2" />
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Novo ROL</div>
              <div
                className="text-xl font-bold"
                style={{ color: currentStatus.color }}
              >
                {fmtBi(calc.newRol)}
              </div>
              {isAnySliderMoved && (
                <div
                  className="text-xs mt-1 font-medium"
                  style={{
                    color: calc.deltaRol > 0 ? '#009C3B' : '#E74C3C',
                  }}
                >
                  {calc.deltaRol > 0 ? '+' : ''}
                  {fmtBi(calc.deltaRol)} vs 2023
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">📋</span> Painel de Resultados
            </CardTitle>
            <CardDescription>
              Atualiza instantaneamente a cada ajuste de slider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Novo ROL */}
              <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">Novo ROL</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: calc.deficitBi >= 0 ? '#009C3B' : '#E74C3C' }}
                >
                  {fmtBi(calc.newRol)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {calc.deficitBi >= 0 ? 'Superávit' : 'Déficit'} em R$ bilhões
                </div>
              </div>

              {/* Nova Despesa Total */}
              <div className="p-4 rounded-lg border border-gray-100 bg-red-50/50">
                <div className="text-xs text-gray-500 mb-1">Nova Despesa Total</div>
                <div className="text-lg font-bold text-[#E74C3C]">
                  {fmtBi(calc.newDespesa)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Real 2023: {fmtBi(BASE.despesaTotal)}
                </div>
              </div>

              {/* Juros sobre Despesa */}
              <div className="p-4 rounded-lg border border-gray-100 bg-amber-50/50">
                <div className="text-xs text-gray-500 mb-1">Juros sobre Despesa</div>
                <div className="text-lg font-bold text-[#D4A017]">
                  {calc.interestPct.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Juros ajustados / Despesa ajustada × 100
                </div>
              </div>

              {/* Nova Receita */}
              <div className="p-4 rounded-lg border border-gray-100 bg-green-50/50">
                <div className="text-xs text-gray-500 mb-1">Nova Receita Total</div>
                <div className="text-lg font-bold text-[#009C3B]">
                  {fmtBi(calc.newReceita)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Real 2023: {fmtBi(BASE.receitaTotal)}
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <Separator className="my-4" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500 font-medium">Variável</th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">2023 Real</th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">Ajuste</th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">Simulado</th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  {SLIDERS.map((s) => {
                    const realVal = s.baseValue;
                    const simVal = adjustedValues[s.key];
                    const diff = simVal - realVal;
                    return (
                      <tr key={s.key} className="border-b border-gray-50">
                        <td className="py-2 px-2 flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label}
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-xs">
                          {fmtBi(realVal)}
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-xs">
                          {fmtPct(sliderValues[s.key] || 0)}
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-xs font-bold">
                          {fmtBi(simVal)}
                        </td>
                        <td
                          className="text-right py-2 px-2 font-mono text-xs font-medium"
                          style={{ color: diff > 0 ? '#E74C3C' : diff < 0 ? '#009C3B' : '#6b7280' }}
                        >
                          {diff > 0 ? '+' : ''}{fmtBi(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-4">
          <div className="flex gap-2 text-xs text-gray-500">
            <Info className="size-4 flex-shrink-0 mt-0.5" />
            <span>
              Simulação simplificada para fins educativos. Não considera efeitos de segunda ordem, multiplicadores fiscais ou variações no PIB.
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function SimuladorPage() {
  return (
    <Suspense fallback={
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-80 bg-gray-200 rounded" />
        </div>
      </main>
    }>
      <SimuladorContent />
    </Suspense>
  );
}
