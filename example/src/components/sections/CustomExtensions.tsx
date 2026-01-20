import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from "../CommandSection";
import { SectionProps } from './types';
import { useState } from 'react';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

export function CustomExtensions({ isInIframe }: SectionProps) {
  const [customExtensions, setCustomExtensions] = useState<any[]>([]);
  const [customExtensionsLoading, setCustomExtensionsLoading] = useState(false);

  const [currentCompanyCustomExtensions, setCurrentCompanyCustomExtensions] = useState<any[]>([]);
  const [currentCompanyCustomExtensionsLoading, setCurrentCompanyCustomExtensionsLoading] = useState(false);

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

  const handleGetCurrentCompanyCustomExtensions = async () => {
    if (!isInIframe) {
      console.error('Error: Not running in iframe');
      return;
    }

    setCurrentCompanyCustomExtensionsLoading(true);

    try {
      const result = await command.getCurrentCompanyCustomExtensions({});
      setCurrentCompanyCustomExtensions(result.customExtensions);
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentCompanyCustomExtensionsLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Current Company Custom Extensions">
        <p className="section-description">
          Retrieves all custom extensions associated with the current company from the local database.
        </p>

        <button 
          onClick={handleGetCurrentCompanyCustomExtensions} 
          disabled={currentCompanyCustomExtensionsLoading}
          className="btn btn--primary"
        >
          {currentCompanyCustomExtensionsLoading ? 'Loading...' : 'Get Current Company Custom Extensions'}
        </button>

        {currentCompanyCustomExtensions.length > 0 && (
          currentCompanyCustomExtensions.map((customExtension) => (
            <JsonViewer key={customExtension._id} data={customExtension} title={customExtension.label} />
          ))
        )}
      </CommandSection>

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
