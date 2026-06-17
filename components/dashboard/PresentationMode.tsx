'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  fiscalData,
  years,
  presentationSlides,
  getVariation,
  calculateIndices,
  benchmarkData,
  timelineEvents,
} from '@/lib/brazil-data';
import type { SlideDef } from '@/lib/brazil-data';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────
function formatBi(value: number): string {
  return `R$ ${(value / 1000).toFixed(1)} bi`;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ─── Slide Content Components ────────────────────────────────────────

function KPISlide() {
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const latest = fiscalData[latestYear];
  const prev = fiscalData[prevYear];

  const kpis = [
    {
      label: 'Receita Total',
      value: formatBi(latest.receita_total),
      change: getVariation(prev.receita_total, latest.receita_total),
      color: '#009C3B',
    },
    {
      label: 'Despesa Total',
      value: formatBi(latest.despesa_total),
      change: getVariation(prev.despesa_total, latest.despesa_total),
      color: '#E74C3C',
    },
    {
      label: 'Resultado Primário (ROL)',
      value: formatBi(latest.rol),
      change: null,
      color: '#dc2626',
    },
    {
      label: 'Carga Tributária',
      value: formatPct((latest.impostos_total / latest.despesa_total) * 100),
      change: null,
      color: '#FFDF00',
    },
    {
      label: 'Juros da Dívida',
      value: formatBi(latest.juros_despesa),
      change: getVariation(prev.juros_despesa, latest.juros_despesa),
      color: '#E74C3C',
    },
    {
      label: 'Investimento (FBCF)',
      value: formatBi(latest.fbcf),
      change: getVariation(prev.fbcf, latest.fbcf),
      color: '#009C3B',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
        KPIs Principais — {latestYear}
      </h2>
      <p className="text-lg text-white/60 mb-8">Indicadores-chave do Governo Geral</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-5 text-center border-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderColor: kpi.color,
            }}
          >
            <p className="text-sm text-white/60 mb-1 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-3xl sm:text-4xl font-black" style={{ color: kpi.color }}>
              {kpi.value}
            </p>
            {kpi.change !== null && (
              <p className="text-sm mt-1" style={{ color: kpi.change >= 0 ? '#4ade80' : '#f87171' }}>
                {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change).toFixed(1)}% vs {prevYear}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReceitaDespesaSlide() {
  const data = years.map((y) => ({
    year: y,
    receita: fiscalData[y].receita_total,
    despesa: fiscalData[y].despesa_total,
  }));

  const maxVal = Math.max(...data.map((d) => Math.max(d.receita, d.despesa)));

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Receita vs Despesa</h2>
      <p className="text-lg text-white/60 mb-8">Evolução temporal 2018–2023</p>
      <div className="w-full max-w-5xl space-y-4">
        {data.map((d) => (
          <div key={d.year} className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-white/80 w-12 text-right font-bold">{d.year}</span>
              <div className="flex-1 space-y-1">
                <div
                  className="h-6 rounded-l-md flex items-center px-3"
                  style={{
                    width: `${(d.receita / maxVal) * 100}%`,
                    backgroundColor: '#009C3B',
                    minWidth: '40px',
                  }}
                >
                  <span className="text-xs text-white font-bold">{formatBi(d.receita)}</span>
                </div>
                <div
                  className="h-6 rounded-l-md flex items-center px-3"
                  style={{
                    width: `${(d.despesa / maxVal) * 100}%`,
                    backgroundColor: '#E74C3C',
                    minWidth: '40px',
                  }}
                >
                  <span className="text-xs text-white font-bold">{formatBi(d.despesa)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-6 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#009C3B' }} />
            <span className="text-white/80 text-sm">Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E74C3C' }} />
            <span className="text-white/80 text-sm">Despesa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposicaoSlide() {
  const d = fiscalData[2023];
  const total = d.despesa_total;
  const items = [
    { label: 'Remuneração', value: d.remuneracao_empregados, color: '#009C3B' },
    { label: 'Juros', value: d.juros_despesa, color: '#E74C3C' },
    { label: 'Benefícios Sociais', value: d.beneficios_sociais, color: '#FFDF00' },
    { label: 'Bens e Serviços', value: d.uso_bens_servicos, color: '#002776' },
    { label: 'Subsídios', value: d.subsidios, color: '#F39C12' },
    { label: 'FBCF', value: d.fbcf, color: '#C4E538' },
  ].filter((item) => item.value > 0);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Composição da Despesa 2023</h2>
      <p className="text-lg text-white/60 mb-8">Distribuição percentual por categoria</p>
      <div className="w-full max-w-5xl space-y-3">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          return (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-white/80 w-40 text-right text-sm font-medium">{item.label}</span>
              <div className="flex-1 h-8 bg-white/10 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center px-3 transition-all"
                  style={{ width: `${pct}%`, backgroundColor: item.color, minWidth: '40px' }}
                >
                  <span className="text-xs text-white font-bold">
                    {pct.toFixed(1)}% — {formatBi(item.value)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JurosSlide() {
  const data = years.map((y) => ({
    year: y,
    juros: fiscalData[y].juros_despesa,
    pct: (fiscalData[y].juros_despesa / fiscalData[y].despesa_total) * 100,
  }));

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Juros da Dívida ao Longo do Tempo</h2>
      <p className="text-lg text-white/60 mb-8">O dragão fiscal — de R$ 526 bi (2019) para R$ 890 bi (2023)</p>
      <div className="w-full max-w-5xl space-y-5">
        {data.map((d) => (
          <div key={d.year} className="flex items-center gap-4">
            <span className="text-white/80 w-12 text-right font-bold">{d.year}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 rounded-md flex items-center px-3"
                  style={{
                    width: `${(d.juros / 1000000) * 100}%`,
                    backgroundColor: '#E74C3C',
                    minWidth: '50px',
                  }}
                >
                  <span className="text-xs text-white font-bold">{formatBi(d.juros)}</span>
                </div>
                <span className="text-white/60 text-sm font-medium">{d.pct.toFixed(1)}% da despesa</span>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 p-4 rounded-lg border-2 border-red-500/50 bg-red-500/10">
          <p className="text-white text-sm">
            Em 2023, os juros consumiram <span className="font-bold text-red-400">18,1%</span> de toda a despesa
            pública — o maior custo isolado após benefícios sociais.
          </p>
        </div>
      </div>
    </div>
  );
}

function InvestimentoSlide() {
  const data = years.map((y) => ({
    year: y,
    fbcf: fiscalData[y].fbcf,
    investLiquido: fiscalData[y].investimento_liquido,
  }));
  const maxFbcf = Math.max(...data.map((d) => d.fbcf));

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Evolução do Investimento (FBCF)</h2>
      <p className="text-lg text-white/60 mb-8">Consumo vs investimento — crescimento de +131% desde 2018</p>
      <div className="w-full max-w-5xl space-y-4">
        {data.map((d) => (
          <div key={d.year} className="flex items-center gap-4">
            <span className="text-white/80 w-12 text-right font-bold">{d.year}</span>
            <div className="flex-1 space-y-1">
              <div
                className="h-7 rounded-md flex items-center px-3"
                style={{
                  width: `${(d.fbcf / maxFbcf) * 100}%`,
                  backgroundColor: '#009C3B',
                  minWidth: '50px',
                }}
              >
                <span className="text-xs text-white font-bold">FBCF: {formatBi(d.fbcf)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{ color: d.investLiquido >= 0 ? '#4ade80' : '#f87171' }}
                >
                  Inv. Líquido: {formatBi(d.investLiquido)} {d.investLiquido >= 0 ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 p-4 rounded-lg border-2 border-green-500/50 bg-green-500/10">
          <p className="text-white text-sm">
            Após anos de investimento líquido negativo, o Brasil voltou a investir positivamente
            em 2022 e 2023. Porém, FBCF representa apenas <span className="font-bold text-green-400">4,4%</span> da
            despesa total.
          </p>
        </div>
      </div>
    </div>
  );
}

function ComparacaoSlide() {
  const countries = benchmarkData.countries;
  const taxBurden = benchmarkData.taxBurden;
  const maxTax = Math.max(...taxBurden);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Comparação Internacional</h2>
      <p className="text-lg text-white/60 mb-8">Carga tributária e indicadores — Brasil vs mundo</p>
      <div className="w-full max-w-5xl space-y-3">
        {countries.map((country, i) => {
          const isBrazil = country === 'Brasil';
          return (
            <div key={country} className="flex items-center gap-4">
              <span
                className={`w-28 text-right text-sm font-bold ${isBrazil ? 'text-[#FFDF00]' : 'text-white/70'}`}
              >
                {country}
              </span>
              <div className="flex-1 h-7 bg-white/5 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center px-3"
                  style={{
                    width: `${(taxBurden[i] / maxTax) * 100}%`,
                    backgroundColor: isBrazil ? '#009C3B' : 'rgba(255,255,255,0.15)',
                    minWidth: '40px',
                  }}
                >
                  <span className={`text-xs font-bold ${isBrazil ? 'text-white' : 'text-white/70'}`}>
                    {taxBurden[i].toFixed(1)}% PIB
                  </span>
                </div>
              </div>
              <span className="text-white/50 text-xs w-20">
                {benchmarkData.investmentGrade[i]}
              </span>
            </div>
          );
        })}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-white/5 text-center">
            <p className="text-[#FFDF00] text-2xl font-black">33.1%</p>
            <p className="text-white/50 text-xs">Carga Tributária</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-center">
            <p className="text-red-400 text-2xl font-black">78.6%</p>
            <p className="text-white/50 text-xs">Dívida/PIB</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-center">
            <p className="text-green-400 text-2xl font-black">2.1%</p>
            <p className="text-white/50 text-xs">Invest. Público/PIB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndicesSlide() {
  const latestYear = years[years.length - 1];
  const indices = calculateIndices(fiscalData[latestYear]);

  const indexItems = [
    { label: 'Desenvolvimento Fiscal', value: indices.indiceDesenvolvimento, color: '#009C3B' },
    { label: 'Risco Econômico', value: 100 - indices.indiceRisco, color: '#dc2626', note: '(invertido)' },
    { label: 'Estabilidade', value: indices.indiceEstabilidade, color: '#002776' },
    { label: 'Atratividade', value: indices.indiceAtratividade, color: '#FFDF00' },
  ];

  const general = Math.round(
    (indexItems.reduce((sum, item) => sum + item.value, 0) / indexItems.length) * 10
  ) / 10;

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Índices Compostos</h2>
      <p className="text-lg text-white/60 mb-8">Score fiscal consolidado — {latestYear}</p>
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {indexItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-5 text-center border-2"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: item.color,
              }}
            >
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{item.label}</p>
              <p className="text-4xl font-black" style={{ color: item.color }}>
                {item.value.toFixed(1)}
              </p>
              <p className="text-xs text-white/40 mt-1">/100 {item.note || ''}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-6 border-2 text-center" style={{ borderColor: '#009C3B' }}>
          <p className="text-white/60 text-sm mb-2">Score Geral do Brasil</p>
          <p className="text-5xl font-black text-[#009C3B]">{general.toFixed(1)}</p>
          <p className="text-white/40 text-xs mt-1">/100</p>
        </div>
      </div>
    </div>
  );
}

function TimelineSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Linha do Tempo Narrativa</h2>
      <p className="text-lg text-white/60 mb-8">A história das contas públicas brasileiras</p>
      <div className="w-full max-w-5xl max-h-[60vh] overflow-y-auto pr-2 space-y-4">
        {timelineEvents.map((event) => (
          <div
            key={event.year}
            className="flex items-start gap-4 rounded-lg p-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderLeft: `4px solid ${event.color}`,
            }}
          >
            <div className="flex-shrink-0 text-center">
              <span className="text-2xl">{event.icon}</span>
              <p className="text-white font-bold text-lg">{event.year}</p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{event.title}</h3>
              <p className="text-white/70 text-sm mt-1">{event.description}</p>
              <p className="text-white/50 text-xs mt-2 italic">{event.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide Content Map ───────────────────────────────────────────────

function getSlideContent(slide: SlideDef): React.ReactNode {
  switch (slide.id) {
    case 'kpis':
      return <KPISlide />;
    case 'receita-despesa':
      return <ReceitaDespesaSlide />;
    case 'composicao':
      return <ComposicaoSlide />;
    case 'juros':
      return <JurosSlide />;
    case 'investimento':
      return <InvestimentoSlide />;
    case 'comparacao':
      return <ComparacaoSlide />;
    case 'indices':
      return <IndicesSlide />;
    case 'timeline':
      return <TimelineSlide />;
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-2xl">{slide.title}</p>
        </div>
      );
  }
}

// ─── Main Presentation Mode Component ────────────────────────────────
// Note: Parent passes a unique `key` each time the presentation opens,
// so this component remounts with fresh state automatically.

export default function PresentationMode({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slides = presentationSlides;

  // Auto-advance every 12 seconds
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev < slides.length - 1) return prev + 1;
        return 0; // loop back to start
      });
    }, 12000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, slides.length]);

  // Fullscreen API
  useEffect(() => {
    if (!isOpen) return;

    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {
        // Fullscreen may be blocked by browser, that's OK
      });
    }

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isOpen]);

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentSlide((prev) => Math.max(prev - 1, 0));
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, slides.length, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: '#0f172a' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/40">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-sm">Brazil Fiscal Intelligence</span>
          <span className="text-white/20">|</span>
          <span className="text-white/60 text-sm font-medium">Modo Apresentação</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/60 hover:text-white hover:bg-white/10"
            aria-label={isPlaying ? 'Pausar' : 'Retomar'}
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            <span className="ml-1.5 text-xs">{isPlaying ? 'Pausar' : 'Retomar'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))}
            className="text-white/60 hover:text-white hover:bg-white/10"
            disabled={currentSlide === 0}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1))}
            className="text-white/60 hover:text-white hover:bg-white/10"
            disabled={currentSlide === slides.length - 1}
            aria-label="Próximo slide"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-red-400 hover:bg-white/10"
            aria-label="Sair da apresentação"
          >
            <X className="size-4" />
            <span className="ml-1.5 text-xs">Sair</span>
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-auto">
        {getSlideContent(slide)}
      </div>

      {/* Bottom Progress Bar */}
      <div className="bg-black/40 px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm font-medium whitespace-nowrap">
            Slide {currentSlide + 1} de {slides.length}
          </span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #009C3B, #FFDF00, #002776)',
              }}
            />
          </div>
          {slide.subtitle && (
            <span className="text-white/40 text-xs hidden sm:block">{slide.subtitle}</span>
          )}
        </div>
        {/* Keyboard hints */}
        <div className="flex items-center gap-4 mt-2 text-white/25 text-[10px]">
          <span>← → Navegar</span>
          <span>Espaço Pausar/Retomar</span>
          <span>Esc Sair</span>
        </div>
      </div>
    </div>
  );
}
