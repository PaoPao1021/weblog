import { useLocale } from '../../i18n/context';
import { siteConfig } from '../../config/site';
import './brand.css';

/** Two nested spaces: the desktop shell and the work taking shape inside it. */
export default function Brand({ onHome }: { onHome: () => void }) {
  const { t } = useLocale();
  return <button type="button" className="wordmark" aria-label={`${siteConfig.username} — ${t('Home')}`} onClick={onHome}>
    <span className="wordmark-symbol" aria-hidden="true">
      <svg className="brand-mark" viewBox="0 0 28 28" fill="none">
        <path className="brand-frame" d="M17.5 5H8a3 3 0 0 0-3 3v9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect className="brand-pane" x="10" y="10" width="13" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path className="brand-line" d="M14 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle className="brand-point" cx="22" cy="5" r="1.6" fill="currentColor" />
      </svg>
    </span>
    <span className="wordmark-copy"><span className="wordmark-name">{siteConfig.username}</span><span className="wordmark-sub">{t('personal space')}</span></span>
  </button>;
}
