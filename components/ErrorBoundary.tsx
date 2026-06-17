'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertTriangle className="size-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Algo deu errado
          </h2>
          <p className="text-sm text-gray-600 max-w-md mb-6">
            Ocorreu um erro ao carregar esta seção. Isso pode ser temporário — tente novamente.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={this.handleRetry}
              className="gap-2"
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
            <Button onClick={this.handleReload} className="gap-2">
              Recarregar página
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left max-w-lg">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                Detalhes do erro (dev only)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-red-600 overflow-auto max-h-40">
                {this.state.error.message}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
