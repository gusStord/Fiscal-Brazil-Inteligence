'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  BarChart3,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ─── Static Municipality Data ────────────────────────────────────────────────
// Realistic fiscal data based on SICONFI/FINBRA proportions for 2023
// Values in R$ Milhões (millions of reais)
interface MunicipalityData {
  name: string;
  state: string;
  population: number;
  receitaTotal: number; // R$ Milhões
  despesaTotal: number; // R$ Milhões
  gastoPessoal: number; // R$ Milhões
  rcl: number; // Receita Corrente Líquida R$ Milhões
  investimento: number; // R$ Milhões (FBCF municipal)
}

const municipalities: MunicipalityData[] = [
  // ─── State Capitals (27) ──────────────────────────────────────────────
  { name: 'São Paulo', state: 'SP', population: 11451245, receitaTotal: 68200, despesaTotal: 64500, gastoPessoal: 22600, rcl: 55800, investimento: 5200 },
  { name: 'Rio de Janeiro', state: 'RJ', population: 6211423, receitaTotal: 38900, despesaTotal: 37200, gastoPessoal: 14800, rcl: 31500, investimento: 2600 },
  { name: 'Brasília', state: 'DF', population: 2817381, receitaTotal: 32100, despesaTotal: 30500, gastoPessoal: 11200, rcl: 26500, investimento: 2400 },
  { name: 'Salvador', state: 'BA', population: 2418130, receitaTotal: 12800, despesaTotal: 12100, gastoPessoal: 5100, rcl: 10200, investimento: 890 },
  { name: 'Fortaleza', state: 'CE', population: 2428678, receitaTotal: 11500, despesaTotal: 10900, gastoPessoal: 4700, rcl: 9200, investimento: 780 },
  { name: 'Belo Horizonte', state: 'MG', population: 2315660, receitaTotal: 15200, despesaTotal: 14500, gastoPessoal: 6200, rcl: 12400, investimento: 1100 },
  { name: 'Manaus', state: 'AM', population: 2063600, receitaTotal: 8900, despesaTotal: 8500, gastoPessoal: 3600, rcl: 7100, investimento: 620 },
  { name: 'Curitiba', state: 'PR', population: 1773718, receitaTotal: 12800, despesaTotal: 12100, gastoPessoal: 5200, rcl: 10400, investimento: 950 },
  { name: 'Recife', state: 'PE', population: 1489120, receitaTotal: 8200, despesaTotal: 7900, gastoPessoal: 3500, rcl: 6500, investimento: 580 },
  { name: 'Porto Alegre', state: 'RS', population: 1332563, receitaTotal: 11200, despesaTotal: 10800, gastoPessoal: 4900, rcl: 9000, investimento: 810 },
  { name: 'Belém', state: 'PA', population: 1303389, receitaTotal: 7100, despesaTotal: 6800, gastoPessoal: 2900, rcl: 5600, investimento: 480 },
  { name: 'Goiânia', state: 'GO', population: 1302554, receitaTotal: 8600, despesaTotal: 8100, gastoPessoal: 3600, rcl: 6900, investimento: 620 },
  { name: 'Guarulhos', state: 'SP', population: 1249510, receitaTotal: 6800, despesaTotal: 6500, gastoPessoal: 2900, rcl: 5400, investimento: 470 },
  { name: 'Campinas', state: 'SP', population: 1131078, receitaTotal: 7400, despesaTotal: 7000, gastoPessoal: 3100, rcl: 5900, investimento: 540 },
  { name: 'São Luís', state: 'MA', population: 927494, receitaTotal: 5100, despesaTotal: 4900, gastoPessoal: 2100, rcl: 4000, investimento: 340 },
  { name: 'Maceió', state: 'AL', population: 932748, receitaTotal: 4200, despesaTotal: 4100, gastoPessoal: 1900, rcl: 3300, investimento: 280 },
  { name: 'Natal', state: 'RN', population: 751300, receitaTotal: 4100, despesaTotal: 3900, gastoPessoal: 1800, rcl: 3200, investimento: 270 },
  { name: 'Teresina', state: 'PI', population: 802537, receitaTotal: 3800, despesaTotal: 3600, gastoPessoal: 1600, rcl: 3000, investimento: 250 },
  { name: 'Campo Grande', state: 'MS', population: 843120, receitaTotal: 5600, despesaTotal: 5300, gastoPessoal: 2400, rcl: 4500, investimento: 390 },
  { name: 'João Pessoa', state: 'PB', population: 726970, receitaTotal: 3900, despesaTotal: 3700, gastoPessoal: 1700, rcl: 3100, investimento: 260 },
  { name: 'Cuiabá', state: 'MT', population: 581152, receitaTotal: 4900, despesaTotal: 4600, gastoPessoal: 2100, rcl: 3900, investimento: 350 },
  { name: 'Aracaju', state: 'SE', population: 571487, receitaTotal: 3200, despesaTotal: 3000, gastoPessoal: 1400, rcl: 2500, investimento: 210 },
  { name: 'Florianópolis', state: 'SC', population: 508826, receitaTotal: 4500, despesaTotal: 4200, gastoPessoal: 1800, rcl: 3600, investimento: 320 },
  { name: 'Porto Velho', state: 'RO', population: 539354, receitaTotal: 3500, despesaTotal: 3300, gastoPessoal: 1500, rcl: 2800, investimento: 230 },
  { name: 'Macapá', state: 'AP', population: 512902, receitaTotal: 2800, despesaTotal: 2700, gastoPessoal: 1200, rcl: 2200, investimento: 180 },
  { name: 'Rio Branco', state: 'AC', population: 413418, receitaTotal: 2400, despesaTotal: 2300, gastoPessoal: 1050, rcl: 1900, investimento: 150 },
  { name: 'Boa Vista', state: 'RR', population: 375839, receitaTotal: 2500, despesaTotal: 2400, gastoPessoal: 1100, rcl: 2000, investimento: 160 },
  // ─── Other Major Cities ────────────────────────────────────────────────
  { name: 'Osasco', state: 'SP', population: 699944, receitaTotal: 4600, despesaTotal: 4300, gastoPessoal: 2000, rcl: 3600, investimento: 310 },
  { name: 'Uberlândia', state: 'MG', population: 619382, receitaTotal: 4500, despesaTotal: 4200, gastoPessoal: 1900, rcl: 3600, investimento: 310 },
  { name: 'Ribeirão Preto', state: 'SP', population: 544537, receitaTotal: 3800, despesaTotal: 3600, gastoPessoal: 1600, rcl: 3000, investimento: 260 },
  { name: 'Sorocaba', state: 'SP', population: 507217, receitaTotal: 3600, despesaTotal: 3400, gastoPessoal: 1500, rcl: 2800, investimento: 240 },
  { name: 'Londrina', state: 'PR', population: 511628, receitaTotal: 3400, despesaTotal: 3200, gastoPessoal: 1450, rcl: 2700, investimento: 230 },
  { name: 'Joinville', state: 'SC', population: 516277, receitaTotal: 3800, despesaTotal: 3500, gastoPessoal: 1550, rcl: 3000, investimento: 260 },
];

// ─── National & State Averages (approximate) ────────────────────────────────
const nationalAverages = {
  gastoPessoalPctRCL: 47.2,
  investimentoPercapita: 456,
  superavitPercent: -1.8,
};

const stateAverages: Record<string, { gastoPessoalPctRCL: number; investimentoPercapita: number; superavitPercent: number }> = {
  SP: { gastoPessoalPctRCL: 44.5, investimentoPercapita: 520, superavitPercent: -1.2 },
  RJ: { gastoPessoalPctRCL: 49.8, investimentoPercapita: 410, superavitPercent: -2.3 },
  DF: { gastoPessoalPctRCL: 43.5, investimentoPercapita: 540, superavitPercent: -1.5 },
  BA: { gastoPessoalPctRCL: 50.1, investimentoPercapita: 390, superavitPercent: -2.5 },
  CE: { gastoPessoalPctRCL: 51.2, investimentoPercapita: 370, superavitPercent: -2.8 },
  MG: { gastoPessoalPctRCL: 48.3, investimentoPercapita: 430, superavitPercent: -2.0 },
  AM: { gastoPessoalPctRCL: 50.5, investimentoPercapita: 350, superavitPercent: -3.0 },
  PR: { gastoPessoalPctRCL: 47.0, investimentoPercapita: 460, superavitPercent: -1.8 },
  PE: { gastoPessoalPctRCL: 52.1, investimentoPercapita: 340, superavitPercent: -3.2 },
  RS: { gastoPessoalPctRCL: 49.5, investimentoPercapita: 400, superavitPercent: -2.2 },
  PA: { gastoPessoalPctRCL: 51.0, investimentoPercapita: 360, superavitPercent: -2.9 },
  GO: { gastoPessoalPctRCL: 48.0, investimentoPercapita: 440, superavitPercent: -1.9 },
  MA: { gastoPessoalPctRCL: 53.5, investimentoPercapita: 310, superavitPercent: -3.5 },
  AL: { gastoPessoalPctRCL: 54.2, investimentoPercapita: 280, superavitPercent: -3.8 },
  RN: { gastoPessoalPctRCL: 52.0, investimentoPercapita: 330, superavitPercent: -3.1 },
  PI: { gastoPessoalPctRCL: 53.0, investimentoPercapita: 320, superavitPercent: -3.4 },
  MS: { gastoPessoalPctRCL: 46.5, investimentoPercapita: 470, superavitPercent: -1.6 },
  PB: { gastoPessoalPctRCL: 52.8, investimentoPercapita: 310, superavitPercent: -3.3 },
  MT: { gastoPessoalPctRCL: 47.5, investimentoPercapita: 450, superavitPercent: -1.7 },
  SE: { gastoPessoalPctRCL: 50.5, investimentoPercapita: 350, superavitPercent: -2.7 },
  SC: { gastoPessoalPctRCL: 45.0, investimentoPercapita: 490, superavitPercent: -1.4 },
  RO: { gastoPessoalPctRCL: 49.0, investimentoPercapita: 380, superavitPercent: -2.4 },
  AP: { gastoPessoalPctRCL: 51.5, investimentoPercapita: 330, superavitPercent: -3.1 },
  AC: { gastoPessoalPctRCL: 52.0, investimentoPercapita: 310, superavitPercent: -3.3 },
  RR: { gastoPessoalPctRCL: 50.0, investimentoPercapita: 370, superavitPercent: -2.6 },
};

// ─── Fuzzy Search ─────────────────────────────────────────────────────────────
function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();

  if (t.includes(q)) return true;

  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function formatBRL(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)} bi`;
  }
  return `R$ ${value.toFixed(0)} mi`;
}

function formatBRLFull(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value * 1_000_000);
}

function formatPopulation(pop: number): string {
  return new Intl.NumberFormat('pt-BR').format(pop);
}

// ─── Color-coded Helpers ─────────────────────────────────────────────────────
function getSuperavitColor(value: number): string {
  return value >= 0 ? '#009C3B' : '#E74C3C';
}

function getGastoPessoalColor(pctRCL: number): string {
  if (pctRCL >= 54) return '#E74C3C';
  if (pctRCL >= 48.6) return '#D4A017';
  return '#009C3B';
}

function getGastoPessoalBg(pctRCL: number): string {
  if (pctRCL >= 54) return 'bg-red-50 text-red-700 border-red-200';
  if (pctRCL >= 48.6) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-green-50 text-green-700 border-green-200';
}

function getGastoPessoalLabel(pctRCL: number): string {
  if (pctRCL >= 54) return 'Acima do Limite LRF';
  if (pctRCL >= 48.6) return 'Zona de Alerta';
  return 'Dentro do Limite';
}

// ─── Computed Metrics ─────────────────────────────────────────────────────────
interface ComputedMunicipality extends MunicipalityData {
  resultado: number;
  gastoPessoalPctRCL: number;
  investimentoPercapita: number;
  resultadoPercReceita: number;
}

function computeMetrics(m: MunicipalityData): ComputedMunicipality {
  const resultado = m.receitaTotal - m.despesaTotal;
  const gastoPessoalPctRCL = (m.gastoPessoal / m.rcl) * 100;
  const investimentoPercapita = (m.investimento * 1_000_000) / m.population;
  const resultadoPercReceita = (resultado / m.receitaTotal) * 100;
  return { ...m, resultado, gastoPessoalPctRCL, investimentoPercapita, resultadoPercReceita };
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function MunicipiosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<ComputedMunicipality | null>(null);

  const allComputed = useMemo(() => municipalities.map(computeMetrics), []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return allComputed;
    return allComputed.filter(
      (m) => fuzzyMatch(m.name, searchQuery) || fuzzyMatch(m.state, searchQuery)
    );
  }, [searchQuery, allComputed]);

  const handleSelect = (m: ComputedMunicipality) => {
    setSelectedMunicipality(m);
  };

  const stateAvg = selectedMunicipality
    ? stateAverages[selectedMunicipality.state] || nationalAverages
    : null;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="scroll-mt-24" id="top">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: '#009C3B' }}>
            <MapPin className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Veja Seu Município
            </h1>
            <p className="text-sm text-muted-foreground">
              Dados fiscais dos municípios brasileiros — exercício 2023
            </p>
          </div>
          <Badge className="ml-auto hidden sm:inline-flex text-xs" style={{ backgroundColor: '#002776', color: 'white', borderColor: '#002776' }}>
            SICONFI/FINBRA
          </Badge>
        </div>
      </div>

      {/* ─── Warning Banner ──────────────────────────────────────────────── */}
      <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-amber-800">⚠️ Dados Ilustrativos</h3>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Os valores exibidos são estimativas calculadas com base em proporções conhecidas para fins educativos.
            Não representam os dados oficiais do SICONFI/FINBRA do Tesouro Nacional.
            Para dados oficiais, acesse:{' '}
            <a
              href="https://siconfi.tesouro.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-amber-900"
            >
              siconfi.tesouro.gov.br
            </a>
          </p>
        </div>
      </div>

      {/* ─── Search ───────────────────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar município ou estado (ex: São Paulo, SP)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          aria-label="Buscar município"
        />
      </div>

      {/* ─── Municipality Cards ───────────────────────────────────────────── */}
      <div>
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} município{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {searchQuery.trim() ? ` para "${searchQuery}"` : ''}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[800px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
          {filtered.map((m) => (
            <Card
              key={`${m.name}-${m.state}`}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMunicipality?.name === m.name && selectedMunicipality?.state === m.state
                  ? 'ring-2 ring-[#009C3B] shadow-lg'
                  : ''
              }`}
              onClick={() => handleSelect(m)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{m.name}</CardTitle>
                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100">
                      Estimativa
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">{m.state}</Badge>
                </div>
                <CardDescription className="text-xs">
                  População: {formatPopulation(m.population)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Receita</p>
                    <p className="font-semibold text-foreground">{formatBRL(m.receitaTotal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Despesa</p>
                    <p className="font-semibold text-foreground">{formatBRL(m.despesaTotal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resultado</p>
                    <p className="font-semibold" style={{ color: getSuperavitColor(m.resultado) }}>
                      {m.resultado >= 0 ? '+' : ''}{formatBRL(m.resultado)}
                    </p>
                  </div>
                </div>

                <div className={`rounded-md px-2 py-1.5 border text-xs ${getGastoPessoalBg(m.gastoPessoalPctRCL)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gasto c/ Pessoal</span>
                    <span className="font-bold">{m.gastoPessoalPctRCL.toFixed(1)}% RCL</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {m.gastoPessoalPctRCL >= 54 ? (
                      <AlertTriangle className="size-3" />
                    ) : m.gastoPessoalPctRCL >= 48.6 ? (
                      <AlertTriangle className="size-3" />
                    ) : (
                      <CheckCircle className="size-3" />
                    )}
                    <span>{getGastoPessoalLabel(m.gastoPessoalPctRCL)} (limite LRF: 54%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Investimento per capita</span>
                  <span className="font-semibold text-foreground">
                    R$ {m.investimentoPercapita.toFixed(0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── Comparison Section ───────────────────────────────────────────── */}
      {selectedMunicipality && stateAvg && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5" style={{ color: '#009C3B' }} />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Comparação: {selectedMunicipality.name}/{selectedMunicipality.state}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gasto com Pessoal comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  Gasto com Pessoal (% RCL)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{selectedMunicipality.name}</span>
                    <span className="font-bold" style={{ color: getGastoPessoalColor(selectedMunicipality.gastoPessoalPctRCL) }}>
                      {selectedMunicipality.gastoPessoalPctRCL.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (selectedMunicipality.gastoPessoalPctRCL / 60) * 100)}%`,
                        backgroundColor: getGastoPessoalColor(selectedMunicipality.gastoPessoalPctRCL),
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Média {selectedMunicipality.state}</span>
                    <span className="font-semibold">{stateAvg.gastoPessoalPctRCL.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, (stateAvg.gastoPessoalPctRCL / 60) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Média Nacional</span>
                    <span className="font-semibold">{nationalAverages.gastoPessoalPctRCL.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-300 transition-all duration-500"
                      style={{ width: `${Math.min(100, (nationalAverages.gastoPessoalPctRCL / 60) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertTriangle className="size-3" />
                    <span>Limite LRF: 54% da RCL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investimento per capita comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  Investimento Per Capita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{selectedMunicipality.name}</span>
                    <span className="font-bold" style={{ color: '#009C3B' }}>
                      R$ {selectedMunicipality.investimentoPercapita.toFixed(0)}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (selectedMunicipality.investimentoPercapita / 800) * 100)}%`,
                        backgroundColor: '#009C3B',
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Média {selectedMunicipality.state}</span>
                    <span className="font-semibold">R$ {stateAvg.investimentoPercapita.toFixed(0)}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, (stateAvg.investimentoPercapita / 800) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Média Nacional</span>
                    <span className="font-semibold">R$ {nationalAverages.investimentoPercapita.toFixed(0)}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-300 transition-all duration-500"
                      style={{ width: `${Math.min(100, (nationalAverages.investimentoPercapita / 800) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="border-t pt-2 mt-2 text-xs text-muted-foreground">
                  {selectedMunicipality.investimentoPercapita > nationalAverages.investimentoPercapita ? (
                    <span className="text-green-700 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      Acima da média nacional
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1">
                      <TrendingDown className="size-3" />
                      Abaixo da média nacional
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resultado comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Resultado (% Receita)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{selectedMunicipality.name}</span>
                    <span className="font-bold" style={{ color: getSuperavitColor(selectedMunicipality.resultadoPercReceita) }}>
                      {selectedMunicipality.resultadoPercReceita >= 0 ? '+' : ''}
                      {selectedMunicipality.resultadoPercReceita.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.abs(selectedMunicipality.resultadoPercReceita / 5) * 100)}%`,
                        backgroundColor: getSuperavitColor(selectedMunicipality.resultadoPercReceita),
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {formatBRLFull(selectedMunicipality.resultado)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Média {selectedMunicipality.state}</span>
                    <span className="font-semibold">{stateAvg.superavitPercent >= 0 ? '+' : ''}{stateAvg.superavitPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.abs(stateAvg.superavitPercent / 5) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Média Nacional</span>
                    <span className="font-semibold">{nationalAverages.superavitPercent >= 0 ? '+' : ''}{nationalAverages.superavitPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-300 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.abs(nationalAverages.superavitPercent / 5) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="border-t pt-2 mt-2 text-xs">
                  {selectedMunicipality.resultado >= 0 ? (
                    <span className="text-green-700 flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      Superávit — contas equilibradas
                    </span>
                  ) : (
                    <span className="text-red-700 flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      Déficit — despesas superam receitas
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Municipality Full Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="size-4 text-muted-foreground" />
                Detalhes: {selectedMunicipality.name} — {selectedMunicipality.state}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Receita Total</p>
                  <p className="font-bold text-foreground">{formatBRLFull(selectedMunicipality.receitaTotal)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Despesa Total</p>
                  <p className="font-bold text-foreground">{formatBRLFull(selectedMunicipality.despesaTotal)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Resultado</p>
                  <p className="font-bold" style={{ color: getSuperavitColor(selectedMunicipality.resultado) }}>
                    {formatBRLFull(selectedMunicipality.resultado)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Gasto c/ Pessoal (% RCL)</p>
                  <p className="font-bold" style={{ color: getGastoPessoalColor(selectedMunicipality.gastoPessoalPctRCL) }}>
                    {selectedMunicipality.gastoPessoalPctRCL.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Investimento Per Capita</p>
                  <p className="font-bold text-foreground">R$ {selectedMunicipality.investimentoPercapita.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Source Attribution ───────────────────────────────────────────── */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>Dados do último exercício disponível (2023). Fonte: SICONFI/FINBRA — Tesouro Nacional</p>
        <p className="mt-1 italic">Valores aproximados baseados em proporções conhecidas para fins educativos.</p>
      </div>
    </main>
  );
}
