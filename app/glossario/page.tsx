'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  glossaryTerms,
  methodologyInfo,
  type GlossaryTerm,
} from '@/lib/brazil-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Search,
  ArrowLeft,
  ExternalLink,
  Info,
  ArrowDown,
  Minus,
  Plus,
  ChevronRight,
  Library,
  FlaskConical,
  Landmark,
  CreditCard,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

// ─── Category Config ────────────────────────────────────────────────────────
const categoryConfig: Record<
  GlossaryTerm['category'],
  { color: string; bgClass: string; label: string; icon: React.ReactNode }
> = {
  receita: {
    color: '#009C3B',
    bgClass: 'bg-green-50',
    label: 'Receita',
    icon: <DollarSign className="size-3.5" />,
  },
  despesa: {
    color: '#E74C3C',
    bgClass: 'bg-red-50',
    label: 'Despesa',
    icon: <CreditCard className="size-3.5" />,
  },
  investimento: {
    color: '#002776',
    bgClass: 'bg-blue-50',
    label: 'Investimento',
    icon: <TrendingUp className="size-3.5" />,
  },
  indicador: {
    color: '#D97706',
    bgClass: 'bg-amber-50',
    label: 'Indicadores',
    icon: <BarChart3 className="size-3.5" />,
  },
  cig: {
    color: '#8B5CF6',
    bgClass: 'bg-purple-50',
    label: 'CIG',
    icon: <Landmark className="size-3.5" />,
  },
};

// DollarSign icon for receita category (avoiding circular import)
function DollarSign({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

type CategoryFilter = 'todos' | GlossaryTerm['category'];

const categoryFilters: { key: CategoryFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'receita', label: 'Receita' },
  { key: 'despesa', label: 'Despesa' },
  { key: 'investimento', label: 'Investimento' },
  { key: 'indicador', label: 'Indicadores' },
  { key: 'cig', label: 'CIG' },
];

// ─── Glossary Term Card ─────────────────────────────────────────────────────
function GlossaryCard({ term, index }: { term: GlossaryTerm; index: number }) {
  const cat = categoryConfig[term.category];
  const accordionId = `term-${index}`;

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: cat.color,
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold leading-tight text-gray-900">
            {term.term}
          </CardTitle>
          <Badge
            className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 gap-1"
            style={{
              backgroundColor: cat.color,
              color: 'white',
              borderColor: cat.color,
            }}
          >
            {cat.icon}
            {cat.label}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600 leading-relaxed mt-1">
          {term.shortDefinition}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={accordionId} className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium text-gray-700 hover:no-underline hover:text-gray-900">
              Definição completa
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>{term.fullDefinition}</p>

              {/* Formula */}
              {term.formula && (
                <div className="rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 font-mono text-sm text-gray-800">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-sans font-semibold block mb-1">
                    Fórmula
                  </span>
                  {term.formula}
                </div>
              )}

              {/* Example */}
              {term.example && (
                <div className="border-l-4 rounded-r-lg pl-4 py-2 bg-green-50 border-green-400">
                  <span className="text-[10px] uppercase tracking-wider text-green-600 font-semibold block mb-1">
                    Exemplo
                  </span>
                  <p className="text-sm text-green-800 leading-relaxed">
                    {term.example}
                  </p>
                </div>
              )}

              {/* IBGE Reference */}
              {term.ibgeReference && (
                <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
                  <BookOpen className="size-3.5 flex-shrink-0 mt-0.5" />
                  <span className="italic">{term.ibgeReference}</span>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// ─── Source Card ─────────────────────────────────────────────────────────────
function SourceCard({
  source,
}: {
  source: (typeof methodologyInfo.sources)[number];
}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            {source.name}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 py-0.5 border-gray-300 text-gray-600 flex-shrink-0"
          >
            {source.institution}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          {source.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Info className="size-3" />
            Periodicidade: {source.periodicity}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3" />
            Cobertura: {source.coverage}
          </span>
          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#002776] hover:underline font-medium"
            >
              <ExternalLink className="size-3" />
              Acessar fonte
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Clock icon for coverage
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Visual CIG Flow Diagram ────────────────────────────────────────────────
function CIGFlowDiagram() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FlaskConical className="size-5 text-purple-600" />
          Fluxo das Contas do CIG
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Relação entre as principais contas das Contas Integradas de Governo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-0 py-4">
          {/* Produção */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 px-6 py-3 text-center">
            <Landmark className="size-5 text-purple-600" />
            <span className="font-bold text-purple-800 text-sm">Produção</span>
          </div>

          {/* Arrow down with minus */}
          <div className="flex flex-col items-center py-1">
            <ArrowDown className="size-4 text-gray-400" />
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-1.5 my-0.5">
              <Minus className="size-3 text-red-500" />
              <span className="text-xs font-semibold text-red-700">
                Consumo Intermediário
              </span>
            </div>
            <ArrowDown className="size-4 text-gray-400" />
          </div>

          {/* VAB */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 px-6 py-3 text-center shadow-sm">
            <span className="font-bold text-green-800 text-sm">VAB</span>
            <span className="text-[10px] text-green-600 font-medium">
              (Valor Adicionado Bruto)
            </span>
          </div>

          {/* Arrow down with adjustments */}
          <div className="flex flex-col items-center py-1">
            <ArrowDown className="size-4 text-gray-400" />
            <div className="flex flex-col items-center gap-1 my-0.5">
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1">
                <Plus className="size-3 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">
                  Impostos
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-1">
                <Minus className="size-3 text-red-500" />
                <span className="text-xs font-semibold text-red-700">
                  Subsídios
                </span>
              </div>
            </div>
            <ArrowDown className="size-4 text-gray-400" />
          </div>

          {/* PIB */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#002776] bg-blue-50 px-6 py-3 text-center shadow-sm">
            <span className="font-bold text-[#002776] text-sm">
              PIB a preços de mercado
            </span>
          </div>

          {/* Extended flow: Renda e Despesa */}
          <div className="flex flex-col items-center py-1">
            <ArrowDown className="size-4 text-gray-400" />
          </div>

          {/* Renda Disponível */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-teal-300 bg-teal-50 px-6 py-3 text-center shadow-sm">
            <span className="font-bold text-teal-800 text-sm">
              Renda Disponível
            </span>
          </div>

          <div className="flex flex-col items-center py-1">
            <ArrowDown className="size-4 text-gray-400" />
            <div className="flex flex-col items-center gap-1 my-0.5">
              <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1">
                <Minus className="size-3 text-rose-500" />
                <span className="text-xs font-semibold text-rose-700">
                  Despesa de Consumo Final
                </span>
              </div>
            </div>
            <ArrowDown className="size-4 text-gray-400" />
          </div>

          {/* Poupança / Necessidade de Financiamento */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-orange-300 bg-orange-50 px-6 py-3 text-center shadow-sm">
            <span className="font-bold text-orange-800 text-sm">
              Necessidade de Financiamento
            </span>
            <span className="text-[10px] text-orange-600 font-medium">
              (Poupança Bruta − FBCF)
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
            Legenda
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-purple-200 border border-purple-300" />
              Conta de Produção
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-green-200 border border-green-300" />
              Geração de Renda
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-blue-200 border border-blue-300" />
              Agregado Macroeconômico
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-teal-200 border border-teal-300" />
              Alocação de Renda
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-orange-200 border border-orange-300" />
              Conta de Capital
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────
export default function GlossarioPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todos');

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesCategory =
        activeCategory === 'todos' || term.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.fullDefinition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { todos: glossaryTerms.length };
    glossaryTerms.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <section className="scroll-mt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#002776] transition-colors mb-4 group"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Voltar ao Dashboard
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 flex-shrink-0">
            <Library className="size-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Glossário &amp; Metodologia
            </h1>
            <p className="text-base text-gray-500 mt-1 max-w-2xl">
              Definições técnicas dos termos utilizados e fontes de dados oficiais
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Search & Filter ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Buscar termo ou definição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="text-xs text-gray-400">
            {filteredTerms.length} de {glossaryTerms.length} termos
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((filter) => {
            const isActive = activeCategory === filter.key;
            const catColor =
              filter.key === 'todos'
                ? '#6b7280'
                : categoryConfig[filter.key as GlossaryTerm['category']]?.color;
            const count = categoryCount[filter.key] || 0;

            return (
              <button
                key={filter.key}
                onClick={() => setActiveCategory(filter.key)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all duration-200 border
                  ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
                style={
                  isActive
                    ? { backgroundColor: catColor, borderColor: catColor }
                    : undefined
                }
              >
                {filter.key !== 'todos' &&
                  categoryConfig[filter.key as GlossaryTerm['category']]?.icon}
                {filter.label}
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Glossary Terms Grid ─────────────────────────────────────────── */}
      <section>
        {filteredTerms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="size-10 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-500">
              Nenhum termo encontrado
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Tente alterar os filtros ou a busca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((term, idx) => (
              <GlossaryCard key={term.term} term={term} index={idx} />
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* ── Visual CIG Flow Diagram ─────────────────────────────────────── */}
      <section className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 flex-shrink-0">
            <FlaskConical className="size-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Diagrama Visual — Contas do CIG
            </h2>
            <p className="text-sm text-gray-500">
              Fluxo simplificado das contas integradas de governo
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <CIGFlowDiagram />
        </div>
      </section>

      <Separator />

      {/* ── Methodology Section ─────────────────────────────────────────── */}
      <section id="metodologia" className="scroll-mt-24 space-y-8">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 flex-shrink-0">
            <BookOpen className="size-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {methodologyInfo.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              {methodologyInfo.description}
            </p>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Landmark className="size-4 text-gray-500" />
            Fontes de Dados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methodologyInfo.sources.map((source) => (
              <SourceCard key={source.name} source={source} />
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Info className="size-4 text-amber-500" />
            Notas Importantes
          </h3>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6">
              <ol className="space-y-3">
                {methodologyInfo.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-amber-900 leading-relaxed">
                      {note}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Bottom Navigation ───────────────────────────────────────────── */}
      <Separator />
      <div className="flex items-center justify-between py-4">
        <Link
          href="/investimentos"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#002776] transition-colors group"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Investimentos
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#002776] hover:text-[#002776]/80 font-medium transition-colors group"
        >
          Dashboard
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
