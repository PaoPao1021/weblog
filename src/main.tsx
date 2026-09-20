import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import LocaleProvider from './i18n/LocaleProvider';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/liquid-glass.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><LocaleProvider><App /></LocaleProvider></React.StrictMode>);
