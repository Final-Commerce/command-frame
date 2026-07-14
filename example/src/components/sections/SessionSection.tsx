import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface SessionSectionProps {
  isInIframe: boolean;
}

export function SessionSection({ isInIframe }: SessionSectionProps) {
  const [getLoading, setGetLoading] = useState(false);
  const [getResponse, setGetResponse] = useState('');

  return (
    <div className="section-content">
      <CommandSection title="Get Active Session">
        <p className="section-description">Returns the active register (cash) session.</p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetResponse('Error: Not running in iframe');
              return;
            }
            setGetLoading(true);
            setGetResponse('');
            try {
              const result = await command.getActiveSession();
              setGetResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetLoading(false);
            }
          }}
          disabled={getLoading}
          className="btn btn--primary"
        >
          {getLoading ? 'Loading...' : 'Get Active Session'}
        </button>
        {getResponse ? (
          <JsonViewer data={getResponse} title={getResponse.startsWith('Error') ? 'Error' : 'Success'} />
        ) : null}
      </CommandSection>
    </div>
  );
}
