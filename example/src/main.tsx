// Enable PostMessage debug logging - MUST be set before any imports that use commandFrameClient
(window as any).__POSTMESSAGE_DEBUG__ = true;

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { renderClient, manageClient } from '@final-commerce/command-frame';
import App from './App';
import { ManageApp } from './manage/ManageApp';
import './index.css';

const AutoRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectEnvironment = async () => {
      // Only auto-detect if we're at root
      if (location.pathname !== '/') {
        setIsDetecting(false);
        return;
      }

      try {
        // Try to get context from Render client
        const renderContext = await renderClient.getFinalContext();
        if (renderContext?.projectName === 'Render') {
          console.log('[Router] Detected Render environment');
          // Already at root, just stop detecting
          setIsDetecting(false);
          return;
        }

        // Try to get context from Manage client
        const manageContext = await manageClient.getFinalContext();
        if (manageContext?.projectName === 'BuilderHub') {
          console.log('[Router] Detected Manage environment');
          navigate('/manage');
          setIsDetecting(false);
          return;
        }
      } catch (e) {
        console.log('[Router] Auto-detection failed, staying on default route', e);
      }
      
      setIsDetecting(false);
    };

    detectEnvironment();
  }, [navigate, location]);

  if (isDetecting) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Detecting environment...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/manage" element={<ManageApp />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AutoRouter />
    </BrowserRouter>
  </React.StrictMode>,
);
