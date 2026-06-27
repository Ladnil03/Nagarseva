import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const _this = this as any;
    const props = _this.props || {};
    const state = _this.state || {};
    if (state.hasError) {
      return props.fallback || (
        <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded-lg text-rose-800 m-4">
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="text-sm">Please refresh the page or contact support.</p>
        </div>
      );
    }

    return props.children;
  }
}
