import { Component, type ReactNode } from 'react';
import { useLocale } from '../../i18n/context';
export function ErrorMessage({ retry }: { retry: () => void }) {
  const { t } = useLocale();
  return <div className="empty-state"><h2>{t('A small interruption.')}</h2><p>{t("This application couldn't load. Your other windows are still here.")}</p><button className="glass-button" onClick={retry}>{t('Try again')}</button></div>;
}
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <ErrorMessage retry={() => this.setState({ failed: false })} />;
    return this.props.children;
  }
}
