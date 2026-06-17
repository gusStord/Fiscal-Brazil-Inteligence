'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import { useLiveData, type LiveDBGGData, type LiveRTNData } from '@/hooks/use-live-data.tsx';

// ─── Context Types ──────────────────────────────────────────────────────────

interface LiveDataContextType {
  dbgg: LiveDBGGData;
  rtn: LiveRTNData;
  isLoading: boolean;
  refetch: () => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const LiveDataContext = createContext<LiveDataContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const liveData = useLiveData();

  return (
    <LiveDataContext.Provider value={liveData}>
      {children}
    </LiveDataContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

const fallbackContext: LiveDataContextType = {
  dbgg: {
    latest: null,
    series: [],
    state: 'loading',
    source: 'none',
  },
  rtn: {
    mesReferencia: '',
    ultimoMes: null,
    acumuladoAno: null,
    historico: [],
    state: 'loading',
    source: 'none',
  },
  isLoading: true,
  refetch: () => {},
};

export function useLiveDataContext(): LiveDataContextType {
  const context = useContext(LiveDataContext);
  if (!context) {
    // Gracefully return fallback instead of throwing — prevents
    // "must be used within a LiveDataProvider" crash during HMR or SSR
    return fallbackContext;
  }
  return context;
}

// Re-export DataStatusBadge from the hook file
export { DataStatusBadge } from '@/hooks/use-live-data.tsx';
