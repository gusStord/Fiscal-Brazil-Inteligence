'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  fetchDBGG,
  fetchRTN,
  type DBGGDataPoint,
  type RTNData,
  type DataState,
  type APIDataResult,
} from '@/lib/api-client';

// ─── Live Data Types ────────────────────────────────────────────────────────

export interface LiveDBGGData {
  latest: { date: string; value: number } | null;
  series: { date: string; value: number }[];
  state: DataState;
  source: string;
  error?: string;
  cachedAt?: string;
}

export interface LiveRTNData {
  mesReferencia: string;
  ultimoMes: RTNData['ultimoMes'] | null;
  acumuladoAno: RTNData['acumuladoAno'] | null;
  historico: RTNData['historico'];
  state: DataState;
  source: string;
  error?: string;
  cachedAt?: string;
}

// ─── Parse DBGG data ────────────────────────────────────────────────────────

function parseDBGGResult(result: APIDataResult<DBGGDataPoint[]>): LiveDBGGData {
  if (!result.data || !Array.isArray(result.data) || result.state === 'error') {
    return {
      latest: null,
      series: [],
      state: result.data && !Array.isArray(result.data) ? 'error' : result.state,
      source: result.source,
      error: result.data && !Array.isArray(result.data) ? 'Formato de dados inesperado da API' : result.error,
      cachedAt: result.cachedAt,
    };
  }

  const series = result.data
    .filter((d) => d && typeof d.data === 'string' && typeof d.valor === 'string')
    .map((d) => {
      const parts = d.data.split('/');
      if (parts.length < 3) return null;
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const value = parseFloat(d.valor);
      return isNaN(value) ? null : { date: isoDate, value };
    })
    .filter((d): d is { date: string; value: number } => d !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const latest = series.length > 0 ? series[series.length - 1] : null;

  return {
    latest,
    series,
    state: result.state,
    source: result.source,
    error: result.error,
    cachedAt: result.cachedAt,
  };
}

// ─── Parse RTN data ─────────────────────────────────────────────────────────

function parseRTNResult(result: APIDataResult<RTNData>): LiveRTNData {
  if (!result.data || result.state === 'error') {
    return {
      mesReferencia: '',
      ultimoMes: null,
      acumuladoAno: null,
      historico: [],
      state: result.state,
      source: result.source,
      error: result.error,
      cachedAt: result.cachedAt,
    };
  }

  return {
    mesReferencia: result.data.mesReferencia,
    ultimoMes: result.data.ultimoMes,
    acumuladoAno: result.data.acumuladoAno,
    historico: result.data.historico,
    state: result.state,
    source: result.source,
    error: result.error,
    cachedAt: result.cachedAt,
  };
}

// ─── Default State ──────────────────────────────────────────────────────────

const defaultDBGG: LiveDBGGData = {
  latest: null,
  series: [],
  state: 'loading',
  source: 'none',
};

const defaultRTN: LiveRTNData = {
  mesReferencia: '',
  ultimoMes: null,
  acumuladoAno: null,
  historico: [],
  state: 'loading',
  source: 'none',
};

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useLiveData() {
  const [dbgg, setDbgg] = useState<LiveDBGGData>(defaultDBGG);
  const [rtn, setRtn] = useState<LiveRTNData>(defaultRTN);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const [dbggResult, rtnResult] = await Promise.allSettled([
      fetchDBGG(),
      fetchRTN(),
    ]);

    if (dbggResult.status === 'fulfilled') {
      setDbgg(parseDBGGResult(dbggResult.value));
    } else {
      setDbgg({ ...defaultDBGG, state: 'error', error: dbggResult.reason?.message });
    }

    if (rtnResult.status === 'fulfilled') {
      setRtn(parseRTNResult(rtnResult.value));
    } else {
      setRtn({ ...defaultRTN, state: 'error', error: rtnResult.reason?.message });
    }

    setIsLoading(false);
  }, []);

  // Initialize data on mount with auto-retry for transient errors and 412 handling
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    let cancelled = false;
    let retryCount = 0;
    let retry412Count = 0;
    const MAX_RETRIES = 3;
    const MAX_RETRIES_412 = 5;
    const RETRY_DELAY_MS = 2000;
    const RETRY_DELAY_412_MS = 3000;

    const is412Error = (err: unknown): boolean => {
      if (err instanceof Error) return /412/.test(err.message);
      if (typeof err === 'string') return /412/.test(err);
      return false;
    };

    const fetchData = async (): Promise<void> => {
      const [dbggResult, rtnResult] = await Promise.allSettled([
        fetchDBGG(),
        fetchRTN(),
      ]);

      if (cancelled) return;

      // Check for 412 Precondition Failed — API needs time to warm up
      const dbgg412 = dbggResult.status === 'rejected' && is412Error(dbggResult.reason);
      const rtn412 = rtnResult.status === 'rejected' && is412Error(rtnResult.reason);
      const dbgg412Fulfilled = dbggResult.status === 'fulfilled' && is412Error(dbggResult.value.error);
      const rtn412Fulfilled = rtnResult.status === 'fulfilled' && is412Error(rtnResult.value.error);

      const has412 = dbgg412 || rtn412 || dbgg412Fulfilled || rtn412Fulfilled;

      if (has412 && retry412Count < MAX_RETRIES_412) {
        retry412Count++;
        // Keep loading state during first few retries — don't flash error
        if (retry412Count <= 3) {
          setIsLoading(true);
        }
        await new Promise((r) => setTimeout(r, RETRY_DELAY_412_MS));
        if (!cancelled) {
          fetchData();
        }
        return;
      }

      // Normal flow — update state with results
      const dbggOk = dbggResult.status === 'fulfilled' && dbggResult.value.state !== 'error';
      const rtnOk = rtnResult.status === 'fulfilled' && rtnResult.value.state !== 'error';

      if (dbggResult.status === 'fulfilled') {
        setDbgg(parseDBGGResult(dbggResult.value));
      } else {
        setDbgg({ ...defaultDBGG, state: 'error', error: dbggResult.reason?.message });
      }

      if (rtnResult.status === 'fulfilled') {
        setRtn(parseRTNResult(rtnResult.value));
      } else {
        setRtn({ ...defaultRTN, state: 'error', error: rtnResult.reason?.message });
      }

      setIsLoading(false);

      // Auto-retry if both APIs failed (likely transient server error)
      if (!dbggOk && !rtnOk && retryCount < MAX_RETRIES) {
        retryCount++;
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * retryCount));
        if (!cancelled) {
          fetchData();
        }
      }
    };

    fetchData();

    return () => { cancelled = true; };
  }, []);

  return { dbgg, rtn, isLoading, refetch };
}

// ─── Status Badge Component ─────────────────────────────────────────────────

export function DataStatusBadge({ state, cachedAt }: { state: DataState; cachedAt?: string }) {
  const configs: Record<DataState, { label: string; className: string; dot: string }> = {
    success: { label: 'Ao vivo', className: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
    cached: { label: cachedAt ? `Cache · ${cachedAt.split(' ')[1] || ''}` : 'Cache', className: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
    stale: { label: '⚠️ Desatualizado', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    loading: { label: 'Carregando...', className: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-400 animate-pulse' },
    error: { label: 'Indisponível', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  };

  const config = configs[state];

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
