'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Wallet,
  Calculator,
  TrendingDown,
  CalendarDays,
  Receipt,
  Banknote,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  irrfTable2024,
  inssTable2024,
  inssMaxContribution,
  icmsAverageRate,
  estimatedConsumptionRate,
} from '@/lib/brazil-data';

// Brazilian states with ICMS rates
const brazilianStates = [
  { uf: 'AC', name: 'Acre', icms: 17 },
  { uf: 'AL', name: 'Alagoas', icms: 18 },
  { uf: 'AP', name: 'Amapá', icms: 18 },
  { uf: 'AM', name: 'Amazonas', icms: 18 },
  { uf: 'BA', name: 'Bahia', icms: 18 },
  { uf: 'CE', name: 'Ceará', icms: 18 },
  { uf: 'DF', name: 'Distrito Federal', icms: 18 },
  { uf: 'ES', name: 'Espírito Santo', icms: 17 },
  { uf: 'GO', name: 'Goiás', icms: 17 },
  { uf: 'MA', name: 'Maranhão', icms: 18 },
  { uf: 'MT', name: 'Mato Grosso', icms: 17 },
  { uf: 'MS', name: 'Mato Grosso do Sul', icms: 17 },
  { uf: 'MG', name: 'Minas Gerais', icms: 18 },
  { uf: 'PA', name: 'Pará', icms: 17 },
  { uf: 'PB', name: 'Paraíba', icms: 18 },
  { uf: 'PR', name: 'Paraná', icms: 18 },
  { uf: 'PE', name: 'Pernambuco', icms: 18 },
  { uf: 'PI', name: 'Piauí', icms: 18 },
  { uf: 'RJ', name: 'Rio de Janeiro', icms: 18 },
  { uf: 'RN', name: 'Rio Grande do Norte', icms: 18 },
  { uf: 'RS', name: 'Rio Grande do Sul', icms: 18 },
  { uf: 'RO', name: 'Rondônia', icms: 17.5 },
  { uf: 'RR', name: 'Roraima', icms: 17 },
  { uf: 'SC', name: 'Santa Catarina', icms: 17 },
  { uf: 'SP', name: 'São Paulo', icms: 18 },
  { uf: 'SE', name: 'Sergipe', icms: 18 },
  { uf: 'TO', name: 'Tocantins', icms: 18 },
];

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyFormatterNoDecimals = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function formatCurrencyCompact(value: number): string {
  return currencyFormatterNoDecimals.format(value);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function formatCurrencyInput(value: string): string {
  const num = parseCurrencyInput(value);
  if (num === 0 && value === '') return '';
  return formatCurrency(num);
}

// INSS calculation (2024 progressive table)
function calculateINSS(salary: number): number {
  if (salary <= 0) return 0;

  let totalContribution = 0;
  let remainingSalary = salary;

  for (let i = 0; i < inssTable2024.length; i++) {
    const bracket = inssTable2024[i];
    const prevMax = i > 0 ? inssTable2024[i - 1].max : 0;

    if (salary > prevMax) {
      const bracketTop = Math.min(salary, bracket.max);
      const bracketSize = bracketTop - prevMax;
      totalContribution += bracketSize * (bracket.rate / 100);
    }
  }

  return Math.min(totalContribution, inssMaxContribution);
}

// IRRF calculation (2024 progressive table)
function calculateIRRF(baseSalary: number, isAutonomo: boolean): number {
  if (baseSalary <= 0) return 0;

  // For CLT, baseSalary already has INSS deducted
  // For Autônomo, no INSS deduction from base
  const base = baseSalary;

  for (const bracket of irrfTable2024) {
    if (base >= bracket.min && base <= bracket.max) {
      return Math.max(0, (base * bracket.rate / 100) - bracket.deduction);
    }
  }

  return 0;
}

// ICMS estimation
function calculateICMS(salaryAfterIRAndINSS: number, stateIcms: number): number {
  const consumption = salaryAfterIRAndINSS * (estimatedConsumptionRate / 100);
  return consumption * (stateIcms / 100);
}

type VinculoType = 'clt' | 'autonomo';

export default function CalculadoraPage() {
  const [salaryInput, setSalaryInput] = useState('');
  const [salary, setSalary] = useState(0);
  const [selectedState, setSelectedState] = useState('SP');
  const [vinculo, setVinculo] = useState<VinculoType>('clt');
  const [calculated, setCalculated] = useState(false);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow typing - store raw input
    setSalaryInput(raw);
  };

  const handleCalculate = () => {
    const parsed = parseCurrencyInput(salaryInput);
    setSalary(parsed);
    setCalculated(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  // Get state ICMS rate
  const stateData = useMemo(
    () => brazilianStates.find((s) => s.uf === selectedState) || brazilianStates[24], // SP default
    [selectedState]
  );

  // Tax calculations
  const results = useMemo(() => {
    if (salary <= 0) {
      return null;
    }

    // INSS
    const inss = vinculo === 'clt' ? calculateINSS(salary) : 0;

    // IRRF base (for CLT, deduct INSS; for Autônomo, no deduction)
    const irrfBase = vinculo === 'clt' ? salary - inss : salary;
    const irrf = calculateIRRF(irrfBase, vinculo === 'autonomo');

    // Salary after direct taxes
    const salaryAfterDirect = salary - inss - irrf;

    // ICMS embedded in consumption
    const icms = calculateICMS(salaryAfterDirect, stateData.icms);

    // Total monthly tax
    const totalMonthly = inss + irrf + icms;

    // Total annual tax
    const totalAnnual = totalMonthly * 12;

    // Daily salary
    const dailySalary = salary / 30;

    // Days working for government
    const daysForGov = totalAnnual / (salary * 12 / 365);

    // Effective tax rate
    const effectiveRate = (totalMonthly / salary) * 100;

    // Take-home pay
    const takeHome = salary - inss - irrf - icms;

    return {
      inss,
      irrf,
      irrfBase,
      icms,
      totalMonthly,
      totalAnnual,
      daysForGov,
      effectiveRate,
      takeHome,
      salaryAfterDirect,
    };
  }, [salary, vinculo, stateData.icms]);

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
            style={{ backgroundColor: '#009C3B' }}
          >
            <Wallet className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Sua Contribuição Fiscal
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Quanto você paga de imposto?
            </p>
          </div>
        </div>
      </section>

      {/* Input Form */}
      <Card className="border-l-4" style={{ borderLeftColor: '#009C3B' }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="size-5 text-[#009C3B]" />
            Dados para Cálculo
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para estimar sua carga tributária mensal e anual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Salary Input */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">
                Salário bruto mensal
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  R$
                </span>
                <Input
                  id="salary"
                  type="text"
                  placeholder="0,00"
                  value={salaryInput}
                  onChange={handleSalaryChange}
                  onKeyDown={handleKeyDown}
                  className="pl-10 text-right font-mono"
                />
              </div>
            </div>

            {/* State Select */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                Estado de residência
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.uf} value={state.uf}>
                      {state.uf} - {state.name} ({state.icms}% ICMS)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-gray-400">
                Alíquota ICMS: {stateData.icms}% ({stateData.name})
              </p>
            </div>

            {/* Vinculo Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de vínculo</Label>
              <RadioGroup
                value={vinculo}
                onValueChange={(val) => setVinculo(val as VinculoType)}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="clt" id="clt" />
                  <Label htmlFor="clt" className="text-sm font-normal cursor-pointer">
                    CLT
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="autonomo" id="autonomo" />
                  <Label htmlFor="autonomo" className="text-sm font-normal cursor-pointer">
                    Autônomo
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-[10px] text-gray-400">
                {vinculo === 'clt'
                  ? 'Desconto de INSS e IR sobre salário com dedução INSS'
                  : 'Sem desconto de INSS patronal, IR sobre valor bruto'}
              </p>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full sm:w-auto text-white gap-2"
            style={{ backgroundColor: '#009C3B' }}
          >
            <Calculator className="size-4" />
            Calcular
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {calculated && results && salary > 0 && (
        <>
          {/* Key Metric: Days for Government */}
          <Card
            className="border-2 overflow-hidden"
            style={{ borderColor: '#002776' }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div
                  className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#002776' }}
                >
                  <CalendarDays className="size-10 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="text-sm text-gray-500 font-medium mb-1">
                    Você trabalha para o governo
                  </div>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span
                      className="text-5xl sm:text-6xl font-black"
                      style={{ color: '#002776' }}
                    >
                      {Math.round(results.daysForGov)}
                    </span>
                    <span className="text-xl text-gray-500 font-medium">dias por ano</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Carga tributária efetiva: {results.effectiveRate.toFixed(1)}% do salário bruto
                  </div>
                </div>
                <div className="flex-shrink-0 text-center px-6 py-3 rounded-xl bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Salário líquido</div>
                  <div className="text-xl font-bold text-[#009C3B]">
                    {formatCurrency(results.takeHome)}
                  </div>
                  <div className="text-xs text-gray-400">/mês</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* INSS */}
            <Card className="border-t-4" style={{ borderTopColor: '#002776' }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Banknote className="size-5 text-[#002776]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">INSS</div>
                    <div className="text-[10px] text-gray-400">
                      Previdência Social
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#002776]">
                  {vinculo === 'clt' ? formatCurrency(results.inss) : '—'}
                </div>
                {vinculo === 'clt' && salary > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {((results.inss / salary) * 100).toFixed(1)}% do salário bruto
                    {results.inss >= inssMaxContribution && (
                      <Badge variant="outline" className="ml-2 text-[10px] border-blue-300 text-blue-600">
                        Teto atingido
                      </Badge>
                    )}
                  </div>
                )}
                {vinculo === 'autonomo' && (
                  <div className="text-xs text-gray-400 mt-1">
                    Não aplicável para autônomos (GPS separada)
                  </div>
                )}
              </CardContent>
            </Card>

            {/* IR */}
            <Card className="border-t-4" style={{ borderTopColor: '#E74C3C' }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-red-50">
                    <TrendingDown className="size-5 text-[#E74C3C]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">IR (Imposto de Renda)</div>
                    <div className="text-[10px] text-gray-400">
                      Tabela progressiva 2024
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#E74C3C]">
                  {formatCurrency(results.irrf)}
                </div>
                {salary > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {((results.irrf / salary) * 100).toFixed(1)}% do salário bruto
                    {vinculo === 'clt' && (
                      <span className="ml-1">
                        (base: {formatCurrency(results.irrfBase)})
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ICMS */}
            <Card className="border-t-4" style={{ borderTopColor: '#D4A017' }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <ShoppingBag className="size-5 text-[#D4A017]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">ICMS estimado</div>
                    <div className="text-[10px] text-gray-400">
                      Embutido no consumo ({stateData.icms}% {stateData.uf})
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#D4A017]">
                  {formatCurrency(results.icms)}
                </div>
                {salary > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {((results.icms / salary) * 100).toFixed(1)}% do salário bruto
                    <span className="ml-1">
                      (~{Math.round(estimatedConsumptionRate)}% da renda em consumo)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Annual Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="size-5 text-gray-500" />
                Resumo Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 text-center">
                  <div className="text-xs text-gray-500 mb-1">Total Mensal</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(results.totalMonthly)}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 text-center">
                  <div className="text-xs text-gray-500 mb-1">Total Anual</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrencyCompact(results.totalAnnual)}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 text-center">
                  <div className="text-xs text-gray-500 mb-1">Carga Efetiva</div>
                  <div className="text-lg font-bold" style={{ color: '#E74C3C' }}>
                    {results.effectiveRate.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 text-center">
                  <div className="text-xs text-gray-500 mb-1">Líquido Anual</div>
                  <div className="text-lg font-bold text-[#009C3B]">
                    {formatCurrencyCompact(results.takeHome * 12)}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Visual bar chart */}
              <div className="space-y-3">
                <div className="text-xs text-gray-500 font-medium mb-2">Distribuição da Carga Tributária Mensal</div>
                {results.totalMonthly > 0 && (
                  <>
                    {/* INSS bar */}
                    {vinculo === 'clt' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">INSS</span>
                          <span className="font-mono">{formatCurrency(results.inss)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(results.inss / results.totalMonthly) * 100}%`,
                              backgroundColor: '#002776',
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {/* IR bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">IR</span>
                        <span className="font-mono">{formatCurrency(results.irrf)}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(results.irrf / results.totalMonthly) * 100}%`,
                            backgroundColor: '#E74C3C',
                          }}
                        />
                      </div>
                    </div>
                    {/* ICMS bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">ICMS (estimado)</span>
                        <span className="font-mono">{formatCurrency(results.icms)}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(results.icms / results.totalMonthly) * 100}%`,
                            backgroundColor: '#D4A017',
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Separator className="my-4" />

              {/* Year calendar visualization */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">
                  Calendário Fiscal — Dias trabalhados para o governo em 2025
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }, (_, month) => {
                    const daysInMonth = new Date(2025, month + 1, 0).getDate();
                    const govDaysThisMonth = (results.daysForGov / 365) * daysInMonth;
                    const workedDays = Math.ceil(govDaysThisMonth);
                    return (
                      <div key={month} className="text-center">
                        <div className="text-[9px] text-gray-400 mb-1">
                          {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][month]}
                        </div>
                        <div className="grid grid-cols-1 gap-px">
                          {Array.from({ length: daysInMonth }, (_, day) => {
                            const isGovDay = day < workedDays;
                            return (
                              <div
                                key={day}
                                className="h-1.5 rounded-sm"
                                style={{
                                  backgroundColor: isGovDay ? '#E74C3C' : '#009C3B',
                                  opacity: isGovDay ? 0.7 : 0.5,
                                }}
                                title={isGovDay ? 'Dia para o governo' : 'Dia para você'}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 justify-center text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: '#E74C3C', opacity: 0.7 }} />
                    Para o governo
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: '#009C3B', opacity: 0.5 }} />
                    Para você
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footnote */}
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-4">
              <div className="flex gap-2 text-xs text-gray-500">
                <span>⚠️</span>
                <span>
                  Estimativa simplificada. Não considera deduções, regimes especiais ou outros tributos.
                  O ICMS é estimado com base no consumo médio de {Math.round(estimatedConsumptionRate)}%
                  da renda disponível. Autônomos pagam INSS via GPS separadamente (alíquota de 20% sobre
                  o salário de contribuição, limitado ao teto). Para CLT, a alíquota efetiva do INSS
                  é progressiva conforme a tabela de 2024.
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state */}
      {(!calculated || salary <= 0) && (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="p-12 text-center">
            <Calculator className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Preencha os dados e clique em Calcular
            </h3>
            <p className="text-sm text-gray-400">
              Veja quanto do seu salário vai para impostos diretos e indiretos
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
