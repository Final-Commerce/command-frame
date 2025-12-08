// Enable PostMessage debug logging - MUST be set before any imports that use commandFrameClient
(window as any).__POSTMESSAGE_DEBUG__ = true;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

