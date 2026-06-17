// Client-side API functions with sessionStorage caching
// Follows the two-layer data architecture:
// Layer 1: Static IBGE data (brazil-data.ts) — always available
// Layer 2: Live API data (BCB + STN) — cached for 24h, fallback on error

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DBGGDataPoint {
  data: string; // "DD/MM/YYYY"
  valor: string; // e.g. "89.10"
}

export interface RTNData {
  ultimaAtualizacao: string;
  fontUrl: string;
  mesReferencia: string;
  ultimoMes: {
    resultadoPrimario: number;
    receitaTotal: number;
    despesaTotal: number;
    juros: number;
    resultadoNominal: number;
  };
  acumuladoAno: {
    resultadoPrimario: number;
    receitaTotal: number;
    despesaTotal: number;
    juros: number;
    resultadoNominal: number;
  };
  historico: Array<{
    ano: number;
    mes: number;
    resultadoPrimario: number;
    receitaTotal: number;
    despesaTotal: number;
  }>;
}

export type DataState = 'loading' | 'success' | 'cached' | 'stale' | 'error';

export interface APIDataResult<T> {
  data: T | null;
  state: DataState;
  source: string;
  error?: string;
  cachedAt?: string;
}

// ─── Cache helpers ──────────────────────────────────────────────────────────

function getCache<T>(key: string): { data: T; timestamp: number } | null {
  try {
    if (typeof window === 'undefined') return null;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

// ─── Fetch DBGG (Dívida Bruta do Governo Geral) ────────────────────────────

export async function fetchDBGG(): Promise<APIDataResult<DBGGDataPoint[]>> {
  // 1. Check sessionStorage cache
  const cached = getCache<DBGGDataPoint[]>('dbgg_cache');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      data: cached.data,
      state: 'cached',
      source: 'session-cache',
      cachedAt: new Date(cached.timestamp).toLocaleString('pt-BR'),
    };
  }

  // 2. Fetch from our API route (which proxies to BCB)
  try {
    const res = await fetch('/api/dbgg');
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();

    if (json.data && Array.isArray(json.data)) {
      // Save to sessionStorage
      setCache('dbgg_cache', json.data);

      return {
        data: json.data,
        state: json.fromCache ? 'cached' : 'success',
        source: json.source,
      };
    }

    // API returned error but has fallback
    if (json.fallback) {
      return {
        data: null,
        state: 'error',
        source: 'api-fallback',
        error: json.error,
      };
    }

    throw new Error('No data in API response');
  } catch (error) {
    // 3. Try stale cache
    if (cached) {
      return {
        data: cached.data,
        state: 'stale',
        source: 'session-cache-stale',
        error: 'API indisponível, usando cache expirado',
        cachedAt: new Date(cached.timestamp).toLocaleString('pt-BR'),
      };
    }

    // 4. No cache at all
    return {
      data: null,
      state: 'error',
      source: 'no-data',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// ─── Fetch RTN (Resultado do Tesouro Nacional) ─────────────────────────────

export async function fetchRTN(): Promise<APIDataResult<RTNData>> {
  // 1. Check sessionStorage cache
  const cached = getCache<RTNData>('rtn_cache');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      data: cached.data,
      state: 'cached',
      source: 'session-cache',
      cachedAt: new Date(cached.timestamp).toLocaleString('pt-BR'),
    };
  }

  // 2. Fetch from our API route
  try {
    const res = await fetch('/api/rtn');
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();

    if (json.data) {
      // Save to sessionStorage
      setCache('rtn_cache', json.data);

      return {
        data: json.data,
        state: 'success',
        source: json.source,
      };
    }

    throw new Error(json.error || 'No data in API response');
  } catch (error) {
    // 3. Try stale cache
    if (cached) {
      return {
        data: cached.data,
        state: 'stale',
        source: 'session-cache-stale',
        error: 'API indisponível, usando cache expirado',
        cachedAt: new Date(cached.timestamp).toLocaleString('pt-BR'),
      };
    }

    // 4. No cache at all
    return {
      data: null,
      state: 'error',
      source: 'no-data',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// ─── Status badge helper ───────────────────────────────────────────────────

export function getStatusBadge(state: DataState): {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
} {
  switch (state) {
    case 'success':
      return { label: 'Ao vivo', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', dotColor: 'bg-green-500' };
    case 'cached':
      return { label: 'Cache', color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-200', dotColor: 'bg-gray-400' };
    case 'stale':
      return { label: '⚠️ Desatualizado', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', dotColor: 'bg-amber-500' };
    case 'loading':
      return { label: 'Carregando...', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', dotColor: 'bg-blue-400' };
    case 'error':
      return { label: 'Indisponível', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', dotColor: 'bg-red-500' };
  }
}
