import { useState } from 'react';
import { manageClient } from '@final-commerce/command-frame';
import { JsonViewer } from '../components/JsonViewer';
import '../App.css';
import '../components/sections/Sections.css';

export function ManageApp() {
  const [contextData, setContextData] = useState<any>(null);
  const [finalContextData, setFinalContextData] = useState<any>(null);
  const [apiKeyData, setApiKeyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const isInIframe = window.self !== window.top;

  const handleGetContext = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await manageClient.getContext();
      setContextData(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching context');
    } finally {
      setLoading(false);
    }
  };

  const handleGetFinalContext = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await manageClient.getFinalContext();
      setFinalContextData(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching final context');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAPIKey = async () => {
    setLoading(true);
    setError('');
    try {
      // First get context to get companyId
      const context = contextData || await manageClient.getContext();
      if (!context?.company?._id) {
        throw new Error('No company ID available. Please get context first.');
      }
      // name and permissions are optional - defaults applied by provider
      const result = await (manageClient as any).generateAPIKey({ 
        companyId: context.company._id
      });
      setApiKeyData(result);
    } catch (err: any) {
      setError(err.message || 'Error creating API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app__main" style={{ marginLeft: 0, width: '100%' }}>
        <div className="app__header">
          <h1 className="app__title">Manage Integration Example</h1>
          <div className="app__status">
            <span className={`app__status-indicator ${isInIframe ? 'app__status-indicator--active' : ''}`}></span>
            <span className="app__status-text">
              {isInIframe ? 'Running in iframe' : 'Not in iframe (Mock Mode)'}
            </span>
          </div>
        </div>
        
        <div className="app__content" style={{ padding: '20px' }}>
          <div className="section-content">
            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Context</h3>
              </div>
              <div className="command-section__content">
                <button 
                  onClick={handleGetContext} 
                  disabled={loading}
                  className="btn btn--primary"
                >
                  Get Context
                </button>
                {contextData && (
                  <JsonViewer data={JSON.stringify(contextData, null, 2)} title="Result" />
                )}
              </div>
            </div>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Final Context</h3>
              </div>
              <div className="command-section__content">
                <button 
                  onClick={handleGetFinalContext} 
                  disabled={loading}
                  className="btn btn--primary"
                >
                  Get Final Context
                </button>
                {finalContextData && (
                  <JsonViewer data={JSON.stringify(finalContextData, null, 2)} title="Result" />
                )}
              </div>
            </div>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Create API Key</h3>
              </div>
              <div className="command-section__content">
                <button 
                  onClick={handleGenerateAPIKey} 
                  disabled={loading}
                  className="btn btn--primary"
                >
                  Create API Key
                </button>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  Requires context to be loaded first (uses company ID)
                </p>
                {apiKeyData && (
                  <JsonViewer data={JSON.stringify(apiKeyData, null, 2)} title="Result" />
                )}
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ marginTop: '20px', color: 'red' }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

