import React from "react";
import { BTN, T_MUTED } from "../styles/tokens";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className={`max-w-md ${T_MUTED}`}>
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button onClick={this.handleReload} className={BTN}>
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

