import { NextResponse } from 'next/server';

// Server-side proxy for BCB SGS API - DBGG (Dívida Bruta do Governo Geral)
// This avoids CORS issues and allows server-side caching

const DBGG_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.13762/dados/ultimos/20?formato=json';

// In-memory cache for server-side (persists between requests in same instance)
let serverCache: { data: Array<{ data: string; valor: string }>; timestamp: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const revalidate = 86400; // Next.js cache for 24h

function isValidDBGGResponse(data: unknown): data is Array<{ data: string; valor: string }> {
  return Array.isArray(data) && data.length > 0 && typeof data[0].data === 'string' && typeof data[0].valor === 'string';
}

export async function GET() {
  try {
    // Check server-side in-memory cache
    if (serverCache && Date.now() - serverCache.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        data: serverCache.data,
        fromCache: true,
        source: 'server-memory',
      });
    }

    // Fetch from BCB API
    const res = await fetch(DBGG_URL, {
      next: { revalidate: 86400 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BrazilFiscalIntelligence/1.0',
      },
    });

    if (!res.ok) {
      throw new Error(`BCB API error: ${res.status}`);
    }

    const data = await res.json();

    // Validate that the response is an array of data points (not an error object)
    if (!isValidDBGGResponse(data)) {
      // BCB sometimes returns error objects with 200 status
      const errorMsg = data?.erro?.detail || 'Formato de resposta inesperado da API BCB';
      throw new Error(errorMsg);
    }

    // Update server cache
    serverCache = { data, timestamp: Date.now() };

    return NextResponse.json({
      data,
      fromCache: false,
      source: 'bcb-api',
    });
  } catch (error) {
    // Fallback: return stale cache if available
    if (serverCache) {
      return NextResponse.json({
        data: serverCache.data,
        fromCache: true,
        stale: true,
        source: 'server-memory-stale',
        error: 'API indisponível, usando cache',
      });
    }

    // No cache available - return error with static fallback data
    return NextResponse.json(
      {
        data: null,
        fromCache: false,
        stale: false,
        source: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        fallback: {
          staticDbgg: {
            2024: 76.27,
            2025: 78.64,
          },
        },
      },
      { status: 200 } // Return 200 even on error so frontend can use fallback
    );
  }
}
