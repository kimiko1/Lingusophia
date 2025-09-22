import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Log error to monitoring service if needed
  }
  render() {
    if (this.state.hasError) {
      return <div>Une erreur est survenue. Veuillez réessayer plus tard.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
