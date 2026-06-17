'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, X, Clock, MessageCircle } from 'lucide-react';

// ─── Storage ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'brazil-fiscal-professor-mode';

// ─── Lesson Step Data ────────────────────────────────────────────────

type StepCategory = 'intro' | 'content' | 'interactive' | 'conclusion';

interface LessonStep {
  id: number;
  time: string;
  title: string;
  instructions: string;
  question: string;
  category: StepCategory;
}

const lessonSteps: LessonStep[] = [
  {
    id: 1,
    time: '0\u20133 min',
    title: 'Introdu\u00E7\u00E3o',
    instructions:
      'Mostre os 6 KPIs do topo. Pergunta: "Qual desses n\u00FAmeros te surpreende mais?" Espere respostas antes de continuar.',
    question: 'Qual desses n\u00FAmeros te surpreende mais?',
    category: 'intro',
  },
  {
    id: 2,
    time: '3\u20138 min',
    title: 'Receita vs Despesa',
    instructions:
      'Clique no gr\u00E1fico "Receita vs Despesa". Destaque 2020. Pergunta: "O que aconteceu nesse ano? Por qu\u00EA?"',
    question: 'O que aconteceu nesse ano? Por qu\u00EA?',
    category: 'content',
  },
  {
    id: 3,
    time: '8\u201313 min',
    title: 'O problema dos juros',
    instructions:
      'V\u00E1 ao gr\u00E1fico "Juros da D\u00EDvida". Mostre que R$ 890 bi = 18% de tudo que o governo gasta. Compare com FBCF (R$ 214 bi). Pergunta: "O que voc\u00EA preferia que o governo fizesse com esse dinheiro?"',
    question: 'O que voc\u00EA preferia que o governo fizesse com esse dinheiro?',
    category: 'content',
  },
  {
    id: 4,
    time: '13\u201318 min',
    title: 'Simulador',
    instructions:
      'Acesse /simulador. Pe\u00E7a a um aluno para mover os sliders. Deixe a turma debater: "O que cortaria? O que ampliaria?"',
    question: 'O que cortaria? O que ampliaria?',
    category: 'interactive',
  },
  {
    id: 5,
    time: '18\u201323 min',
    title: 'Compara\u00E7\u00E3o Internacional',
    instructions:
      'Mostre o gr\u00E1fico "Brasil vs Benchmarks". Pergunta: "Por que o Brasil tem mais juros que os vizinhos?"',
    question: 'Por que o Brasil tem mais juros que os vizinhos?',
    category: 'content',
  },
  {
    id: 6,
    time: '23\u201328 min',
    title: 'Quiz',
    instructions:
      'Abra o Quiz Fiscal. Deixe a turma responder em conjunto.',
    question: '',
    category: 'interactive',
  },
  {
    id: 7,
    time: '28\u201330 min',
    title: 'Conclus\u00E3o',
    instructions:
      'Mostre o Score Geral (39.8/100). Pergunta: "Com base no que vimos, o que voc\u00EA mudaria nas contas p\u00FAblicas?"',
    question: 'Com base no que vimos, o que voc\u00EA mudaria nas contas p\u00FAblicas?',
    category: 'conclusion',
  },
];

// ─── Category Colors ─────────────────────────────────────────────────

const categoryColors: Record<
  StepCategory,
  { border: string; badge: string; badgeText: string; activeBg: string }
> = {
  intro: {
    border: 'border-l-green-500',
    badge: 'bg-green-100',
    badgeText: 'text-green-700',
    activeBg: 'bg-green-50 ring-2 ring-green-400',
  },
  content: {
    border: 'border-l-blue-500',
    badge: 'bg-blue-100',
    badgeText: 'text-blue-700',
    activeBg: 'bg-blue-50 ring-2 ring-blue-400',
  },
  interactive: {
    border: 'border-l-yellow-500',
    badge: 'bg-yellow-100',
    badgeText: 'text-yellow-700',
    activeBg: 'bg-yellow-50 ring-2 ring-yellow-400',
  },
  conclusion: {
    border: 'border-l-red-500',
    badge: 'bg-red-100',
    badgeText: 'text-red-700',
    activeBg: 'bg-red-50 ring-2 ring-red-400',
  },
};

const categoryLabels: Record<StepCategory, string> = {
  intro: 'Introdu\u00E7\u00E3o',
  content: 'Conte\u00FAdo',
  interactive: 'Interativo',
  conclusion: 'Conclus\u00E3o',
};

// ─── Hook: useProfessorMode ──────────────────────────────────────────

export function useProfessorMode() {
  const [isActive, setIsActive] = useState(false);

  // Read from sessionStorage after hydration to avoid mismatch
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate: reading sessionStorage after hydration
        setIsActive(true);
      }
    } catch {
      // sessionStorage may not be available
    }
  }, []);

  const toggle = useCallback(() => {
    setIsActive((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  // Sync with sessionStorage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setIsActive(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { isActive, toggle };
}

// ─── Step Card Component ─────────────────────────────────────────────

function StepCard({
  step,
  isStepActive,
  onClick,
}: {
  step: LessonStep;
  isStepActive: boolean;
  onClick: () => void;
}) {
  const colors = categoryColors[step.category];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-lg border border-l-4 p-4 transition-all duration-200 cursor-pointer
        hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${colors.border}
        ${isStepActive ? colors.activeBg : 'bg-white hover:bg-gray-50'}
      `}
      aria-label={`Passo ${step.id}: ${step.title}`}
    >
      {/* Time badge + category */}
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className={`text-[10px] font-bold px-2 py-0.5 border-0 ${colors.badge} ${colors.badgeText}`}
        >
          <Clock className="size-3 mr-0.5" />
          {step.time}
        </Badge>
        <Badge
          variant="outline"
          className={`text-[10px] font-medium px-2 py-0.5 border-0 ${colors.badge} ${colors.badgeText}`}
        >
          {categoryLabels[step.category]}
        </Badge>
        {isStepActive && (
          <span className="ml-auto flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
        )}
      </div>

      {/* Title */}
      <h4
        className={`text-sm font-bold mb-1.5 ${
          isStepActive ? 'text-gray-900' : 'text-gray-800'
        }`}
      >
        {step.id}. {step.title}
      </h4>

      {/* Instructions */}
      <p className="text-xs text-gray-600 leading-relaxed mb-2">
        {step.instructions}
      </p>

      {/* Discussion question */}
      {step.question && (
        <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-gray-200/60">
          <MessageCircle className="size-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-medium text-amber-700 italic leading-relaxed">
            {step.question}
          </p>
        </div>
      )}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function ProfessorMode({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Keyboard: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onToggle]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        onClick={onToggle}
        className={
          isActive
            ? 'gap-1.5 text-xs font-semibold shadow-md'
            : 'gap-1.5 text-xs font-semibold'
        }
        style={
          isActive
            ? { backgroundColor: '#15803d', color: 'white', borderColor: '#15803d' }
            : { borderColor: '#15803d', color: '#15803d' }
        }
        aria-label={isActive ? 'Fechar Roteiro de Aula' : 'Abrir Roteiro de Aula'}
        title={isActive ? 'Fechar Roteiro de Aula' : 'Abrir Roteiro de Aula'}
      >
        {isActive ? (
          <>
            <X className="size-3.5" />
            <span className="hidden sm:inline">Fechar Roteiro</span>
          </>
        ) : (
          <>
            <GraduationCap className="size-3.5" />
            <span className="hidden sm:inline">Roteiro de Aula</span>
          </>
        )}
      </Button>

      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-300 ${
          isActive
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
        aria-hidden="true"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
      />

      {/* Side Panel - always rendered, slides in/out via CSS transform */}
      <div
        className={`
          fixed top-0 right-0 z-[60] h-full
          w-full sm:w-[400px]
          bg-white shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isActive ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal={isActive ? 'true' : undefined}
        aria-label="Roteiro de Aula"
      >
        {/* Panel Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100">
                <GraduationCap className="size-5 text-green-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {'Roteiro de Aula'}
                </h2>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Script de 30 minutos para apresentação em sala de aula
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 -mr-1"
              aria-label="Fechar painel"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-gray-500">
                Progresso da aula
              </span>
              <span className="text-[11px] font-bold text-green-700">
                {activeStep}/{lessonSteps.length} etapas
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(activeStep / lessonSteps.length) * 100}%`,
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Steps List */}
        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="p-4 space-y-3">
            {lessonSteps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                isStepActive={activeStep === step.id}
                onClick={() => setActiveStep(step.id)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Panel Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
              disabled={activeStep === 1}
              className="flex-1 text-xs"
            >
              Anterior
            </Button>
            <Button
              size="sm"
              onClick={() =>
                setActiveStep((prev) => Math.min(prev + 1, lessonSteps.length))
              }
              disabled={activeStep === lessonSteps.length}
              className="flex-1 text-xs"
              style={{ backgroundColor: '#15803d' }}
            >
              Próxima Etapa
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
