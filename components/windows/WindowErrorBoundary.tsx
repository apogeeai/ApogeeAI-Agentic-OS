'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  title: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WindowErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Window crashed:', this.props.title, error);
  }

  reload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-xl text-white">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-amber-300" />
            <h3 className="text-lg font-semibold">{this.props.title} crashed</h3>
          </div>
          <p className="text-sm text-white/80 mb-4">
            Something went wrong rendering this window. The rest of the desktop is unaffected.
          </p>
          {this.state.error?.message && (
            <pre className="text-xs bg-black/30 rounded p-2 overflow-auto max-h-32 mb-4">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.reload}
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 px-3 py-2 text-sm font-medium transition"
          >
            <RotateCw className="h-4 w-4" /> Reload window
          </button>
        </div>
      </div>
    );
  }
}
