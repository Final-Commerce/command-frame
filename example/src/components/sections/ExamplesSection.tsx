import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface ExamplesSectionProps {
  isInIframe: boolean;
}

export function ExamplesSection({ isInIframe }: ExamplesSectionProps) {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCallAction = async () => {
    if (!isInIframe) {
      setResponse('Error: Not running in iframe');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const result = await command.exampleFunction({
        param1: 'Pram1 value',
        param2: 'Pram2 value',
        param3: 'Pram3 value',
      });
      
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Example Function">
        <p className="section-description">
          This is an example function that demonstrates how to call command from the iframe.
        </p>
        <button 
          onClick={handleCallAction} 
          disabled={loading}
          className="btn btn--primary"
        >
          {loading ? 'Calling...' : 'Call exampleFunction Action'}
        </button>
        
        {response && (
          <JsonViewer 
            data={response} 
            title={response.startsWith('Error') ? 'Error' : 'Success'} 
          />
        )}
      </CommandSection>
    </div>
  );
}

