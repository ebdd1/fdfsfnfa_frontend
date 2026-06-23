import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary for preventing white screen crashes.
 *
 * CRITICAL FIX: Previously, uncaught React errors caused entire app to crash
 * with a blank white screen. This component catches errors in the component tree
 * and displays a user-friendly error UI instead.
 *
 * Usage:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * Note: Error boundaries do NOT catch:
 * - Event handlers (use try/catch)
 * - Async code (use promise catch)
 * - Server-side rendering
 * - Errors in the boundary itself
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for monitoring (can integrate with Sentry, LogRocket, etc.)
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Error icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau
              kembali ke halaman utama.
            </p>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg text-sm">
                <summary className="font-medium text-gray-700 cursor-pointer mb-2">
                  Detail Error (Development Only)
                </summary>
                <pre className="overflow-auto text-xs text-red-600 whitespace-pre-wrap">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack?.split('\n').slice(0, 5).join('\n')}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Halaman Utama
              </button>
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-[#004ac6] text-white hover:bg-[#003a9e] rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple functional wrapper for inline error boundaries.
 * Use this for catching errors in specific sections.
 */
export const ErrorFallback: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => {
  return (
    <ErrorBoundary fallback={fallback || null}>
      {children}
    </ErrorBoundary>
  );
};
