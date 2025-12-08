import { useState } from 'react';
import { command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface EnvironmentSectionProps {
  isInIframe: boolean;
}

export function EnvironmentSection({ isInIframe }: EnvironmentSectionProps) {
  const [contextData, setContextData] = useState<any>(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [contextError, setContextError] = useState<string>('');

  const handleGetContext = async () => {
    if (!isInIframe) {
      setContextError('Error: Not running in iframe');
      return;
    }

    setContextLoading(true);
    setContextError('');
    setContextData(null);

    try {
      const result = await command.getContext();
      setContextData(result);
    } catch (error) {
      setContextError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setContextLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Context">
        <p className="section-description">
          Get current environment/context information including user, company, device, station, outlet, and build details.
          The response includes full objects for user, company (without settings), station, and outlet.
        </p>
        <button 
          onClick={handleGetContext} 
          disabled={contextLoading}
          className="btn btn--primary"
        >
          {contextLoading ? 'Loading...' : 'Get Context'}
        </button>
        
        {contextData && (
          <JsonViewer 
            data={JSON.stringify(contextData, null, 2)} 
            title="Context Data" 
          />
        )}
        
        {contextError && (
          <JsonViewer 
            data={contextError} 
            title="Error" 
          />
        )}
      </CommandSection>
    </div>
  );
}

