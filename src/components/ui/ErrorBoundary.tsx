import { Component, type ReactNode } from 'react';
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="empty-state"><h2>A small interruption.</h2><p>This application couldn't load. Your other windows are still here.</p><button className="glass-button" onClick={() => this.setState({ failed: false })}>Try again</button></div>;
    return this.props.children;
  }
}
