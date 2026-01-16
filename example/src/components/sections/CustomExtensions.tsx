import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from "../CommandSection";
import { SectionProps } from './types';
import { useState } from 'react';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

export function CustomExtensions({ isInIframe }: SectionProps) {
  const [customExtensions, setCustomExtensions] = useState<any[]>([]);
  const [customExtensionsLoading, setCustomExtensionsLoading] = useState(false);

  const handleGetCustomExtensions = async () => {
    if (!isInIframe) {
      console.error('Error: Not running in iframe');
      return;
    }

    setCustomExtensionsLoading(true);

    try {
      const result = await command.getCustomExtensions();
      setCustomExtensions(result.customExtensions);
    } catch (error) {
      console.error(error);
    } finally {
      setCustomExtensionsLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Custom Extensions">
        <p className="section-description">
          This is a custom extension section.
        </p>

        <button 
          onClick={handleGetCustomExtensions} 
          disabled={customExtensionsLoading}
          className="btn btn--primary"
        >
          {customExtensionsLoading ? 'Loading...' : 'Get Custom Extensions'}
        </button>

        {customExtensions.length > 0 && (
          customExtensions.map((customExtension) => (
            <JsonViewer key={customExtension._id} data={customExtension} title={customExtension.label} />
          ))
        )}
      </CommandSection>
    </div>
  );
}
