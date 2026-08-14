import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Dynamically inject Google Search Console verification tag for SEO
if (typeof document !== 'undefined') {
  const codes = ['koj9qyb3-MhN6eOLvz06NUHiACUkJlf5ZWP1OmycCPA', 'googlef500946794c8c9e8'];
  codes.forEach(code => {
    if (!document.querySelector(`meta[content="${code}"]`)) {
      const meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.content = code;
      document.head.appendChild(meta);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
