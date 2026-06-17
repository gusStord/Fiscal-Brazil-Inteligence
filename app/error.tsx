'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Check if it's a "PreconditionFailed" or similar server error
  const isServerError = error?.message?.includes('PreconditionFailed') ||
    error?.message?.includes('pending state') ||
    error?.message?.includes('Failed to fetch');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-white to-gray-50">
      <div className="size-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <AlertTriangle className="size-10 text-amber-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {isServerError ? 'Servidor temporariamente indisponível' : 'Algo deu errado'}
      </h1>

      <p className="text-gray-600 max-w-md mb-8">
        {isServerError
          ? 'O servidor está iniciando. Isso costuma durar apenas alguns segundos — tente novamente.'
          : 'Ocorreu um erro inesperado. Tente recarregar a página ou voltar ao início.'}
      </p>

      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="gap-2"
          style={{ backgroundColor: '#009C3B', borderColor: '#009C3B' }}
        >
          <RefreshCw className="size-4" />
          Tentar novamente
        </Button>

        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <Home className="size-4" />
            Voltar ao início
          </Link>
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-8 text-left max-w-lg">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            Detalhes do erro (dev only)
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-red-600 overflow-auto max-h-40">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </div>
  );
}
