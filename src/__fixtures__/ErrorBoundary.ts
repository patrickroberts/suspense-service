import { ReactNode, Component } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  onError: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    const { onError } = this.props;
    onError(error);
  }

  render(): ReactNode {
    const { fallback, children } = this.props;
    const { hasError } = this.state;

    return hasError ? fallback : children;
  }
}
