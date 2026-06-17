'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  ChevronRight,
  Lightbulb,
  Star,
} from 'lucide-react';
import { quizQuestions, type QuizQuestion } from '@/lib/brazil-data';

// ─── Types ───────────────────────────────────────────────────────────

type AnswerState = 'unanswered' | 'correct' | 'wrong';

interface QuizState {
  currentIndex: number;
  selectedOption: number | null;
  answerState: AnswerState;
  score: number;
  answered: boolean;
  completed: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function getDifficultyConfig(difficulty: QuizQuestion['difficulty']) {
  switch (difficulty) {
    case 'facil':
      return { label: 'Fácil', color: '#009C3B', bg: '#dcfce7', textColor: '#166534' };
    case 'medio':
      return { label: 'Médio', color: '#FFDF00', bg: '#fefce8', textColor: '#854d0e' };
    case 'dificil':
      return { label: 'Difícil', color: '#dc2626', bg: '#fef2f2', textColor: '#991b1b' };
  }
}

function getProfile(score: number) {
  if (score <= 3) {
    return {
      level: 'Iniciante',
      color: '#dc2626',
      bg: '#fef2f2',
      description: 'Você precisa estudar mais sobre as contas públicas brasileiras. Recomendamos revisar os dados e tentar novamente!',
      icon: <Target className="size-8" />,
    };
  }
  if (score <= 6) {
    return {
      level: 'Intermediário',
      color: '#FFDF00',
      bg: '#fefce8',
      description: 'Bom entendimento das finanças públicas! Continue aprofundando seus conhecimentos para alcançar o próximo nível.',
      icon: <Star className="size-8" />,
    };
  }
  if (score <= 9) {
    return {
      level: 'Avançado',
      color: '#009C3B',
      bg: '#dcfce7',
      description: 'Forte habilidade analítica! Você domina os indicadores fiscais brasileiros. Falta pouco para a excelência!',
      icon: <Trophy className="size-8" />,
    };
  }
  return {
    level: 'Expert',
    color: '#002776',
    bg: '#eff6ff',
    description: 'Mestre da análise fiscal! Você tem conhecimento profundo sobre as contas públicas brasileiras. Parabéns!',
    icon: <Trophy className="size-8" />,
  };
}

// ─── Initial State ───────────────────────────────────────────────────

const initialState: QuizState = {
  currentIndex: 0,
  selectedOption: null,
  answerState: 'unanswered',
  score: 0,
  answered: false,
  completed: false,
};

// ─── Main Component ──────────────────────────────────────────────────

export default function QuizSection() {
  const [state, setState] = useState<QuizState>(initialState);

  const currentQuestion = quizQuestions[state.currentIndex];
  const progressPercent = (state.currentIndex / quizQuestions.length) * 100;
  const diffConfig = currentQuestion ? getDifficultyConfig(currentQuestion.difficulty) : null;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (state.answered) return;

      const isCorrect = optionIndex === currentQuestion.correctIndex;
      setState((prev) => ({
        ...prev,
        selectedOption: optionIndex,
        answerState: isCorrect ? 'correct' : 'wrong',
        score: isCorrect ? prev.score + 1 : prev.score,
        answered: true,
      }));
    },
    [state.answered, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (state.currentIndex < quizQuestions.length - 1) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedOption: null,
        answerState: 'unanswered',
        answered: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        completed: true,
      }));
    }
  }, [state.currentIndex]);

  const handleRestart = useCallback(() => {
    setState(initialState);
  }, []);

  // ─── Completed View ──────────────────────────────────────────────
  if (state.completed) {
    const profile = getProfile(state.score);
    return (
      <section id="quiz" className="scroll-mt-24">
        <Card className="relative overflow-hidden py-0 gap-0">
          <div
            className="h-2 w-full"
            style={{ backgroundColor: profile.color }}
          />
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div
                className="inline-flex p-4 rounded-full mb-4"
                style={{ backgroundColor: profile.bg }}
              >
                <span style={{ color: profile.color }}>{profile.icon}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Quiz Completo!
              </h2>
              <p className="text-gray-500 text-sm">Perfil do Investidor Analítico</p>
            </div>

            {/* Score Display */}
            <div
              className="inline-flex items-baseline gap-1 mb-6 rounded-2xl px-8 py-4"
              style={{ backgroundColor: profile.bg }}
            >
              <span
                className="text-5xl sm:text-6xl font-black"
                style={{ color: profile.color }}
              >
                {state.score}
              </span>
              <span className="text-xl text-gray-400 font-medium">/{quizQuestions.length}</span>
            </div>

            {/* Profile Badge */}
            <div className="mb-4">
              <Badge
                className="text-sm px-4 py-1.5 font-bold"
                style={{
                  backgroundColor: profile.color,
                  color: profile.color === '#FFDF00' ? '#1a1a1a' : '#ffffff',
                  borderColor: 'transparent',
                }}
              >
                {profile.level}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
              {profile.description}
            </p>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-8">
              <div className="bg-green-50 rounded-xl p-3">
                <CheckCircle2 className="size-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700">{state.score}</p>
                <p className="text-[10px] text-green-600 uppercase tracking-wider">Corretas</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <XCircle className="size-5 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-600">{quizQuestions.length - state.score}</p>
                <p className="text-[10px] text-red-500 uppercase tracking-wider">Erradas</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <Brain className="size-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600">{quizQuestions.length}</p>
                <p className="text-[10px] text-blue-500 uppercase tracking-wider">Total</p>
              </div>
            </div>

            <Button
              onClick={handleRestart}
              className="gap-2 font-semibold px-6"
              style={{ backgroundColor: '#009C3B' }}
            >
              <RotateCcw className="size-4" />
              Refazer Quiz
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // ─── Active Quiz View ────────────────────────────────────────────
  return (
    <section id="quiz" className="scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: '#002776' }}>
            <Brain className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Quiz Fiscal
            </h2>
            <p className="text-sm text-gray-500">
              Teste seus conhecimentos sobre as contas públicas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-50 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-green-600" />
            <span className="text-sm font-bold text-green-700">{state.score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium">
            Pergunta {state.currentIndex + 1} de {quizQuestions.length}
          </span>
          <span className="text-xs text-gray-400">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="relative overflow-hidden py-0 gap-0">
        {/* Accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: diffConfig?.color || '#002776' }}
        />

        <CardHeader className="pt-5 pb-3 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-3">
            <Badge
              className="text-xs font-semibold px-2.5 py-0.5"
              style={{
                backgroundColor: diffConfig?.bg,
                color: diffConfig?.textColor,
                borderColor: 'transparent',
              }}
            >
              {diffConfig?.label}
            </Badge>
            <span className="text-xs text-gray-400 font-medium">
              #{currentQuestion.id}
            </span>
          </div>
          <CardTitle className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-5">
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {currentQuestion.options.map((option, idx) => {
              let optionStyle: React.CSSProperties = {
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                color: '#374151',
              };
              let optionClass = 'transition-all duration-200 cursor-pointer';

              if (state.answered) {
                if (idx === currentQuestion.correctIndex) {
                  optionStyle = {
                    backgroundColor: '#dcfce7',
                    borderColor: '#009C3B',
                    color: '#166534',
                  };
                } else if (idx === state.selectedOption && state.answerState === 'wrong') {
                  optionStyle = {
                    backgroundColor: '#fef2f2',
                    borderColor: '#dc2626',
                    color: '#991b1b',
                  };
                } else {
                  optionStyle = {
                    backgroundColor: '#f9fafb',
                    borderColor: '#e5e7eb',
                    color: '#9ca3af',
                  };
                  optionClass = 'opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={state.answered}
                  className={`${optionClass} flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-default`}
                  style={optionStyle}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border"
                    style={{
                      borderColor: state.answered && idx === currentQuestion.correctIndex
                        ? '#009C3B'
                        : state.answered && idx === state.selectedOption && state.answerState === 'wrong'
                          ? '#dc2626'
                          : '#d1d5db',
                      backgroundColor: state.answered && idx === currentQuestion.correctIndex
                        ? '#009C3B'
                        : state.answered && idx === state.selectedOption && state.answerState === 'wrong'
                          ? '#dc2626'
                          : '#f3f4f6',
                      color: state.answered && (idx === currentQuestion.correctIndex || (idx === state.selectedOption && state.answerState === 'wrong'))
                        ? '#ffffff'
                        : '#6b7280',
                    }}
                  >
                    {state.answered && idx === currentQuestion.correctIndex ? (
                      <CheckCircle2 className="size-4" />
                    ) : state.answered && idx === state.selectedOption && state.answerState === 'wrong' ? (
                      <XCircle className="size-4" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {state.answered && (
            <div
              className="rounded-xl p-4 border transition-all duration-300"
              style={{
                backgroundColor: state.answerState === 'correct' ? '#f0fdf4' : '#fef2f2',
                borderColor: state.answerState === 'correct' ? '#bbf7d0' : '#fecaca',
              }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb
                  className="size-4 flex-shrink-0 mt-0.5"
                  style={{ color: state.answerState === 'correct' ? '#009C3B' : '#dc2626' }}
                />
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: state.answerState === 'correct' ? '#009C3B' : '#dc2626' }}
                  >
                    {state.answerState === 'correct' ? 'Correto!' : 'Incorreto'}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {state.answered && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleNext}
                className="gap-2 font-semibold"
                style={{ backgroundColor: '#009C3B' }}
              >
                {state.currentIndex < quizQuestions.length - 1 ? (
                  <>
                    Próxima
                    <ChevronRight className="size-4" />
                  </>
                ) : (
                  <>
                    Ver Resultado
                    <Trophy className="size-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
