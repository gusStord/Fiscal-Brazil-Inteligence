'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PiggyBank,
  Building2,
  HeartPulse,
  Users,
  Scale,
  Banknote,
  CheckCircle2,
  XCircle,
  Eye,
  Briefcase,
} from 'lucide-react';
import { fiscalData, years, getVariation, formatCompact } from '@/lib/brazil-data';
import SectionAnchor from '@/components/dashboard/SectionAnchor';

// ─── Types ───────────────────────────────────────────────────────────

interface InsightCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// ─── Data Builders ───────────────────────────────────────────────────

function buildStrengths(): InsightCard[] {
  const first = fiscalData[years[0]];
  const latest = fiscalData[years[years.length - 1]];

  return [
    {
      icon: <TrendingUp className="size-5" />,
      title: 'Receita em Crescimento',
      description: `A receita total cresceu de R$ ${(first.receita_total / 1_000_000).toFixed(2)} tri (${years[0]}) para R$ ${(latest.receita_total / 1_000_000).toFixed(2)} tri (${latest.year}), um aumento de ${getVariation(first.receita_total, latest.receita_total).toFixed(1)}% no período.`,
    },
    {
      icon: <PiggyBank className="size-5" />,
      title: 'Recuperação do Investimento',
      description: `O FBCF saltou de R$ ${(first.fbcf / 1000).toFixed(0)} bi (${years[0]}) para R$ ${(latest.fbcf / 1000).toFixed(0)} bi (${latest.year}), crescimento de ${getVariation(first.fbcf, latest.fbcf).toFixed(0)}%. O investimento líquido voltou ao positivo: R$ ${(latest.investimento_liquido / 1000).toFixed(1)} bi.`,
    },
    {
      icon: <Building2 className="size-5" />,
      title: 'Diversificação Federativa',
      description: `A receita municipal cresceu ${getVariation(first.receita_municipal, latest.receita_municipal).toFixed(0)}% no período (de R$ ${(first.receita_municipal / 1000).toFixed(0)} bi para R$ ${(latest.receita_municipal / 1000).toFixed(0)} bi), superior ao crescimento federal (${getVariation(first.receita_federal, latest.receita_federal).toFixed(0)}%).`,
    },
    {
      icon: <HeartPulse className="size-5" />,
      title: 'Resiliência Pós-Pandemia',
      description: `Após o choque de 2020 (ROL de -R$ ${(Math.abs(fiscalData[2020].rol) / 1000).toFixed(0)} bi), 2021 trouxe recuperação com receita de R$ ${(fiscalData[2021].receita_total / 1_000_000).toFixed(2)} tri (+23% vs 2020) e ROL de -R$ ${(Math.abs(fiscalData[2021].rol) / 1000).toFixed(0)} bi (vs -R$ 910 bi em 2020), embora os juros já começassem a subir.`,
    },
  ];
}

function buildRisks(): InsightCard[] {
  const latest = fiscalData[years[years.length - 1]];
  const prev = fiscalData[years[years.length - 2]];
  const first = fiscalData[years[0]];

  const jurosGrowth = getVariation(fiscalData[2019].juros_despesa, latest.juros_despesa);
  const jurosShareDesp = ((latest.juros_despesa / latest.despesa_total) * 100).toFixed(1);
  const cargaShare = ((latest.impostos_total / latest.receita_total) * 100).toFixed(1);
  const debtServiceShare = (((latest.juros_despesa + latest.subsidios) / latest.receita_total) * 100).toFixed(1);

  return [
    {
      icon: <XCircle className="size-5" />,
      title: 'Déficit Estrutural Crônico',
      description: `O ROL é negativo em todos os anos analisados, piorando de -R$ ${(Math.abs(first.rol) / 1000).toFixed(0)} bi (${years[0]}) para -R$ ${(Math.abs(latest.rol) / 1000).toFixed(0)} bi (${latest.year}). O déficit é estrutural, não conjuntural.`,
    },
    {
      icon: <Banknote className="size-5" />,
      title: 'Explosão dos Juros',
      description: `A despesa com juros cresceu ${jurosGrowth.toFixed(0)}% entre 2019 e ${latest.year}, atingindo R$ ${(latest.juros_despesa / 1000).toFixed(0)} bi. Os juros consumiram ${jurosShareDesp}% de toda a despesa em ${latest.year}.`,
    },
    {
      icon: <Scale className="size-5" />,
      title: 'Carga Tributária Elevada',
      description: `A participação dos impostos na receita total atingiu ${cargaShare}% em ${latest.year} (Impostos ÷ Receita Total), consistentemente acima de 58%, indicando alta dependência tributária. Já os impostos representam ${((latest.impostos_total / latest.despesa_total) * 100).toFixed(1)}% da despesa total — ou seja, mais da metade de tudo que o governo gasta é financiado por arrecadação de impostos.`,
    },
    {
      icon: <AlertTriangle className="size-5" />,
      title: 'Risco de Sustentabilidade',
      description: `O serviço da dívida (juros + subsídios) consome ${debtServiceShare}% da receita total, reduzindo o espaço fiscal para investimentos e políticas públicas essenciais.`,
    },
  ];
}

function buildTrends(): InsightCard[] {
  const latest = fiscalData[years[years.length - 1]];
  const first = fiscalData[years[0]];

  const pessoalShare = ((latest.remuneracao_empregados / latest.despesa_total) * 100).toFixed(1);
  const prevShare = ((latest.beneficios_seguridade / latest.despesa_total) * 100).toFixed(1);
  const invGrowth = getVariation(first.fbcf, latest.fbcf);

  return [
    {
      icon: <Users className="size-5" />,
      title: 'Crescimento da Despesa com Pessoal',
      description: `A remuneração de empregados atingiu R$ ${(latest.remuneracao_empregados / 1000).toFixed(0)} bi (${pessoalShare}% da despesa), com crescimento de ${getVariation(first.remuneracao_empregados, latest.remuneracao_empregados).toFixed(0)}% desde ${years[0]}.`,
    },
    {
      icon: <ShieldCheck className="size-5" />,
      title: 'Pressão Previdenciária',
      description: `Os benefícios de seguridade social somaram R$ ${(latest.beneficios_seguridade / 1000).toFixed(0)} bi em ${latest.year} (${prevShare}% da despesa total), representando a maior pressão estrutural sobre as contas públicas.`,
    },
    {
      icon: <BarChart3 className="size-5" />,
      title: 'Investimento em Recuperação',
      description: `Após anos de investimento líquido negativo, o Brasil retomou investimentos positivos em 2022-2023. O FBCF cresceu ${invGrowth.toFixed(0)}% no período, mas ainda representa apenas ${((latest.fbcf / latest.despesa_total) * 100).toFixed(1)}% da despesa total.`,
    },
  ];
}

// ─── Sub-components ──────────────────────────────────────────────────

function InsightSection({
  title,
  icon,
  cards,
  accentColor,
  bgColor,
  borderColor,
}: {
  title: string;
  icon: React.ReactNode;
  cards: InsightCard[];
  accentColor: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: accentColor }}
        >
          {icon}
        </div>
        <h3
          className="text-lg font-bold"
          style={{ color: accentColor }}
        >
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 py-0 gap-0"
            style={{ borderLeft: `4px solid ${accentColor}` }}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 p-2 rounded-lg"
                  style={{ backgroundColor: bgColor }}
                >
                  <span style={{ color: accentColor }}>{card.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function AnalysisSection() {
  const strengths = buildStrengths();
  const risks = buildRisks();
  const trends = buildTrends();
  const latest = fiscalData[years[years.length - 1]];

  return (
    <section id="analise" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: '#002776' }}>
          <Lightbulb className="size-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group">
            Análise Inteligente
            <SectionAnchor id="analise" />
          </h2>
          <p className="text-sm text-gray-500">
            Insights derivados dos dados fiscais para tomada de decisão
          </p>
        </div>
      </div>

      {/* Pontos Fortes */}
      <InsightSection
        title="Pontos Fortes"
        icon={<TrendingUp className="size-4 text-white" />}
        cards={strengths}
        accentColor="#009C3B"
        bgColor="#dcfce7"
        borderColor="#009C3B"
      />

      {/* Pontos de Atenção / Riscos */}
      <InsightSection
        title="Pontos de Atenção / Riscos"
        icon={<AlertTriangle className="size-4 text-white" />}
        cards={risks}
        accentColor="#dc2626"
        bgColor="#fef2f2"
        borderColor="#dc2626"
      />

      {/* Tendências Futuras */}
      <InsightSection
        title="Tendências Futuras"
        icon={<Eye className="size-4 text-white" />}
        cards={trends}
        accentColor="#002776"
        bgColor="#eff6ff"
        borderColor="#002776"
      />

      {/* Conclusões para Investidores */}
      <Card
        className="relative overflow-hidden py-0 gap-0 border-2"
        style={{ borderColor: '#FFDF00' }}
      >
        <div
          className="h-2 w-full"
          style={{
            background: 'linear-gradient(90deg, #FFDF00 0%, #FFA500 50%, #FFDF00 100%)',
          }}
        />
        <CardHeader className="pt-5 pb-2 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#FFDF00' }}
            >
              <Briefcase className="size-5 text-gray-900" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
              Conclusões para Investidores
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investment Thesis */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-4" style={{ color: '#FFDF00' }} />
                <h4 className="font-bold text-sm text-gray-900">Tese de Investimento</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                O Brasil apresenta um mercado de grande escala com receita governamental de R$ {(latest.receita_total / 1_000_000).toFixed(2)} tri e VAB de R$ {(latest.vab_pib / 1_000_000).toFixed(2)} tri. A retomada dos investimentos e a diversificação federativa criam oportunidades em infraestrutura e serviços públicos.
              </p>
            </div>

            {/* Key Risk Factors */}
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="size-4 text-red-600" />
                <h4 className="font-bold text-sm text-gray-900">Fatores de Risco</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                O déficit estrutural crônico (ROL de -R$ {(Math.abs(latest.rol) / 1000).toFixed(0)} bi), a explosão dos juros (R$ {(latest.juros_despesa / 1000).toFixed(0)} bi) e a pressão previdenciária ameaçam a sustentabilidade fiscal e podem levar a maior tributação ou cortes de investimento.
              </p>
            </div>

            {/* Opportunities */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="size-4 text-green-600" />
                <h4 className="font-bold text-sm text-gray-900">Oportunidades</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                A recuperação do investimento público (FBCF +{getVariation(fiscalData[years[0]].fbcf, latest.fbcf).toFixed(0)}%), o crescimento municipal (+{getVariation(fiscalData[years[0]].receita_municipal, latest.receita_municipal).toFixed(0)}%) e o mercado consumidor robusto abrem espaço para PPPs, concessões e investimentos em saúde, previdência e infraestrutura.
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="size-4 text-blue-700" />
                <h4 className="font-bold text-sm text-gray-900">Recomendação</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <strong>CAUTELA MODERADA.</strong> O mercado é atrativo pelo tamanho e retomada de investimentos, mas os riscos fiscais são elevados. Recomenda-se exposição seletiva em setores beneficiados pelo investimento público, com proteção contra risco de aumento de tributação e instabilidade cambial.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
