import { Component, ErrorInfo } from 'react';
import { ErrorBoundaryProps } from '../../props/error-boundary-props';
import { ErrorBoundaryState } from '../../model/error-boundary/error-boundary';




class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-title)',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              Something went wrong
            </h1>

            <p
              className="mt-2"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              An unexpected error occurred. Please try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;