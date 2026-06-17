'use client';

import React from 'react';
import Link from 'next/link';
import { Flag, Heart, BookOpen, Circle } from 'lucide-react';
import { useLiveDataContext } from '@/components/dashboard/LiveDataProvider';
import { dataFreshness } from '@/lib/brazil-data';

// ─── Status Dot Component ───────────────────────────────────────────────────
function StatusDot({ state }: { state: 'success' | 'cached' | 'stale' | 'loading' | 'error' }) {
  const colors = {
    success: 'bg-green-500',
    cached: 'bg-gray-400',
    stale: 'bg-amber-500',
    loading: 'bg-blue-400 animate-pulse',
    error: 'bg-red-500',
  };

  return <Circle className={`size-2 fill-current ${colors[state]}`} />;
}

export default function DashboardFooter() {
  const { dbgg, rtn } = useLiveDataContext();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Description */}
          <Link href="/" className="flex items-center gap-3 group">
            <Flag className="size-5 transition-colors group-hover:text-[#009C3B]" style={{ color: '#009C3B' }} />
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-[#002776] transition-colors">
                Brazil Fiscal Intelligence
              </p>
              <p className="text-xs text-gray-500">
                Dados extraídos do CIG e Demonstrativos Fiscais do Governo Geral (2018-2025)
              </p>
            </div>
          </Link>

          {/* Quick Links */}
          <div className="flex items-center gap-4 text-xs">
            <Link href="/glossario" className="flex items-center gap-1 text-gray-500 hover:text-[#002776] transition-colors font-medium">
              <BookOpen className="size-3" />
              Glossário
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/receitas" className="text-gray-500 hover:text-[#002776] transition-colors font-medium">
              Receitas
            </Link>
            <Link href="/despesas" className="text-gray-500 hover:text-[#002776] transition-colors font-medium">
              Despesas
            </Link>
            <Link href="/investimentos" className="text-gray-500 hover:text-[#002776] transition-colors font-medium">
              Investimentos
            </Link>
          </div>
        </div>

        {/* ─── API Status Indicators ────────────────────────────────────────── */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Fontes de dados</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
            {/* IBGE - Static */}
            <div className="flex items-center gap-1.5">
              <StatusDot state="cached" />
              <span className="font-medium text-gray-600">IBGE EFP+CIG</span>
              <span className="text-gray-400">Estático · {dataFreshness.govGeralCoverage}</span>
            </div>

            {/* BCB DBGG - Live */}
            <div className="flex items-center gap-1.5">
              <StatusDot state={dbgg.state} />
              <span className="font-medium text-gray-600">BCB DBGG</span>
              <span className="text-gray-400">
                {dbgg.state === 'success' ? `Ao vivo · ${dbgg.latest?.date ? new Date(dbgg.latest.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : ''}` :
                 dbgg.state === 'cached' ? `Cache · ${dbgg.cachedAt?.split(' ')[1] || ''}` :
                 dbgg.state === 'stale' ? '⚠️ Cache expirado' :
                 dbgg.state === 'error' ? 'Indisponível (fallback)' :
                 'Conectando...'}
              </span>
            </div>

            {/* STN RTN - Live */}
            <div className="flex items-center gap-1.5">
              <StatusDot state={rtn.state} />
              <span className="font-medium text-gray-600">STN RTN</span>
              <span className="text-gray-400">
                {rtn.state === 'success' ? `Ao vivo · ${rtn.mesReferencia}` :
                 rtn.state === 'cached' ? `Cache · ${rtn.mesReferencia}` :
                 rtn.state === 'stale' ? '⚠️ Cache expirado' :
                 rtn.state === 'error' ? 'Indisponível (fallback)' :
                 'Conectando...'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: '#009C3B' }} />
          <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: '#FFDF00' }} />
          <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: '#002776' }} />
        </div>

        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            Feito com <Heart className="size-3 text-red-400" /> para investidores e acadêmicos
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Fonte: STN / IBGE / Tesouro Nacional / BCB</span>
        </div>

        <p className="mt-3 text-center text-[10px] text-gray-400">
          Este dashboard é uma ferramenta analítica e não constitui recomendação de investimento.
          Todos os dados são públicos e provenientes de fontes oficiais.
        </p>
      </div>
    </footer>
  );
}
