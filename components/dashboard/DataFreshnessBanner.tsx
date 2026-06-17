'use client';

import React from 'react';
import { Info, Database, TrendingDown, AlertTriangle, Landmark, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { dataFreshness, gcData, dbggData, fiscalFrameworkTargets } from '@/lib/brazil-data';
import { useLiveDataContext, DataStatusBadge } from '@/components/dashboard/LiveDataProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DataFreshnessBanner() {
  const { dbgg, rtn, isLoading } = useLiveDataContext();

  const gc2025 = gcData[2025];
  const gc2024 = gcData[2024];
  const dbgg2025 = dbgg.latest?.value ?? dbggData[2025];
  const dbgg2024 = dbggData[2024];

  // Calculate primary result as % of GDP (approximate, using GC data)
  const target2025 = fiscalFrameworkTargets[2025];
  const target2024 = fiscalFrameworkTargets[2024];

  const gdp2024Approx = 10_900_000; // R$ milhões
  const gdp2025Approx = 11_500_000; // R$ milhões
  const primaryPct2024 = (gc2024.resultado_primario / gdp2024Approx) * 100;
  const primaryPct2025 = (gc2025.resultado_primario / gdp2025Approx) * 100;

  const metTarget2024 = primaryPct2024 >= target2024.primaryResultMin && primaryPct2024 <= target2024.primaryResultMax;
  const metTarget2025 = primaryPct2025 >= target2025.primaryResultMin && primaryPct2025 <= target2025.primaryResultMax;

  // RTN data
  const rtnUltimoMes = rtn.ultimoMes;
  const rtnAcumulado = rtn.acumuladoAno;

  return (
    <div className="space-y-0">
      {/* ─── RTN Banner: Resultado Primário Mais Recente ──────────────────── */}
      {rtn.state !== 'error' && rtnUltimoMes && rtnAcumulado ? (
        <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
              <div className="flex items-center gap-1.5">
                <Landmark className="size-3.5 text-blue-400" />
                <span className="font-semibold text-blue-300">
                  Resultado Primário · {rtn.mesReferencia}
                </span>
              </div>

              <span className="hidden sm:inline text-gray-600">|</span>

              {/* Monthly result */}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300">Mês:</span>
                <span className={`font-bold ${rtnUltimoMes.resultadoPrimario >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {rtnUltimoMes.resultadoPrimario >= 0 ? '+' : '-'}R$ {(Math.abs(rtnUltimoMes.resultadoPrimario) / 1000).toFixed(1)} bi
                </span>
              </div>

              <span className="hidden sm:inline text-gray-600">|</span>

              {/* Accumulated result */}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300">Acumulado:</span>
                <span className={`font-bold ${rtnAcumulado.resultadoPrimario >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {rtnAcumulado.resultadoPrimario >= 0 ? '+' : '-'}R$ {(Math.abs(rtnAcumulado.resultadoPrimario) / 1000).toFixed(1)} bi
                </span>
              </div>

              <span className="hidden sm:inline text-gray-600">|</span>

              {/* Source */}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-xs">Fonte: RTN/STN</span>
                <a
                  href="https://www.tesourotransparente.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="size-3" />
                </a>
                <DataStatusBadge state={rtn.state} cachedAt={rtn.cachedAt} />
              </div>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-3">
              <Landmark className="size-3.5 text-blue-400" />
              <Skeleton className="h-4 w-64 bg-gray-700" />
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── Data Freshness Banner ────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {/* Data freshness indicator */}
            <div className="flex items-center gap-1.5">
              <Database className="size-3.5 text-green-600" />
              <span className="font-medium text-green-800">
                Dados mais recentes: {dataFreshness.lastUpdate}
              </span>
            </div>

            <span className="hidden sm:inline text-green-300">|</span>

            {/* GC Primary Result */}
            <div className="flex items-center gap-1.5">
              <TrendingDown className="size-3.5 text-red-500" />
              <span className="text-gray-700">
                Resultado Primário GC:{' '}
                <span className="font-semibold text-red-600">
                  -R$ {(Math.abs(gc2025.resultado_primario) / 1000).toFixed(1)} bi (2025)
                </span>
              </span>
            </div>

            <span className="hidden sm:inline text-green-300">|</span>

            {/* DBGG indicator */}
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="size-3.5 text-amber-500" />
              <span className="text-gray-700">
                DBGG:{' '}
                <span className="font-semibold text-amber-700">
                  {dbgg2025?.toFixed(1) ?? '—'}% do PIB
                  {dbgg.latest?.date && (
                    <span className="font-normal text-amber-600 text-xs ml-1">
                      ({new Date(dbgg.latest.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })})
                    </span>
                  )}
                </span>
              </span>
              <DataStatusBadge state={dbgg.state} cachedAt={dbgg.cachedAt} />
            </div>

            {/* Arcabouço Fiscal target indicator */}
            <div className="flex items-center gap-1.5 ml-auto">
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 font-semibold ${
                  metTarget2024
                    ? 'border-green-400 text-green-700 bg-green-50'
                    : 'border-red-400 text-red-700 bg-red-50'
                }`}
              >
                {metTarget2024 ? '✓ Meta 2024' : '✗ Meta 2024'}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 font-semibold ${
                  metTarget2025
                    ? 'border-green-400 text-green-700 bg-green-50'
                    : 'border-red-400 text-red-700 bg-red-50'
                }`}
              >
                {metTarget2025 ? '✓ Meta 2025' : '✗ Meta 2025'}
              </Badge>

              {/* Info tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-green-100 transition-colors" aria-label="Informações sobre os dados">
                    <Info className="size-3.5 text-green-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  <p className="font-semibold mb-1">Sobre os dados 2024-2025</p>
                  <p>{dataFreshness.note}</p>
                  <p className="mt-1 text-muted-foreground">
                    Meta LC 200/2023 — 2024: [{target2024.primaryResultMin}%, {target2024.primaryResultMax}%] PIB | 2025: [{target2025.primaryResultMin}%, {target2025.primaryResultMax}%] PIB
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
