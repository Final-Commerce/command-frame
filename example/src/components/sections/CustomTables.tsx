import { useState } from "react";
import { CommandSection } from "../CommandSection";
import { SectionProps } from "./types";
import { JsonViewer } from '../JsonViewer';
import { renderClient as command } from '@final-commerce/command-frame';
import './Sections.css';

export function CustomTables({ isInIframe }: SectionProps) {
  const [customTables, setCustomTables] = useState<any[]>([]);
  const [customTablesLoading, setCustomTablesLoading] = useState(false);

  const [customExtensionCustomTables, setCustomExtensionCustomTables] = useState<any[]>([]);
  const [customExtensionCustomTablesLoading, setCustomExtensionCustomTablesLoading] = useState(false);

  const [customExtensionId, setCustomExtensionId] = useState('');

  const [customTableName, setCustomTableName] = useState('');
  const [customTableData, setCustomTableData] = useState<any[]>([]);
  const [customTableDataLoading, setCustomTableDataLoading] = useState(false);

  const handleGetCustomTables = async () => {
    if (!isInIframe) {
      console.error('Error: Not running in iframe');
      return;
    }

    setCustomTablesLoading(true);

    try {
      const result = await command.getCustomTables();
      setCustomTables(result.customTables);
    } catch (error) {
      console.error(error);
    } finally {
      setCustomTablesLoading(false);
    }
  };

  const handleGetCustomExtensionCustomTables = async () => {
    if (!isInIframe) {
      console.error('Error: Not running in iframe');
      return;
    }

    setCustomExtensionCustomTablesLoading(true);

    try {
      const result = await command.getCustomExtensionCustomTables({ extensionId: customExtensionId });
      setCustomExtensionCustomTables(result.customTables);
    } catch (error) {
      console.error(error);
    } finally {
      setCustomExtensionCustomTablesLoading(false);
    }
  };

  const handleGetCustomTableData = async () => {
    if (!isInIframe) {
      console.error('Error: Not running in iframe');
      return;
    }

    setCustomTableDataLoading(true);

    try {
      const result = await command.getCustomTableData({ tableName: customTableName });
      setCustomTableData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCustomTableDataLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Custom Tables">
        <button 
          onClick={handleGetCustomTables} 
          disabled={customTablesLoading}
          className="btn btn--primary"
        >
          {customTablesLoading ? 'Loading...' : 'Get Custom Tables'}
        </button>

        {customTables.length > 0 && (
          customTables.map((customTable) => (
            <JsonViewer key={customTable._id} data={customTable} title={customTable.name} />
          ))
        )}
      </CommandSection>

      <CommandSection title="Custom Extension Custom Tables">
        <p className="section-description">
          Get custom tables available for a custom extension.
        </p>
        <div className="form-group">
          <label className="form-label">Custom Extension ID:</label>
          <input
            type="text"
            value={customExtensionId}
            onChange={(e) => setCustomExtensionId(e.target.value)}
            className="form-input"
            placeholder="Enter Custom Extension ID"
          />
        </div>

        
        <button
          onClick={handleGetCustomExtensionCustomTables} 
          disabled={customExtensionCustomTablesLoading}
          className="btn btn--primary"
        >
          {customExtensionCustomTablesLoading ? 'Loading...' : 'Get Custom Extension Custom Tables'}
        </button>

        {customExtensionCustomTables.length > 0 && (
          customExtensionCustomTables.map((customTable) => (
            <JsonViewer key={customTable._id} data={customTable} title={customTable.name} />
          ))
        )}
      </CommandSection>

      <CommandSection title="Get Custom Table Data">
        <p className="section-description">
          Get data for a custom table.
        </p>
        <div className="form-group">
          <label className="form-label">Custom Table Name:</label>
          <input
            type="text"
            value={customTableName}
            onChange={(e) => setCustomTableName(e.target.value)}
            className="form-input"
            placeholder="Enter Custom Table Name"
          />
        </div>
        
        <button
          onClick={handleGetCustomTableData} 
          disabled={customTableDataLoading}
          className="btn btn--primary"
        >
          {customTableDataLoading ? 'Loading...' : 'Get Custom Table Data'}
        </button>

        {customTableData.length > 0 && (
          customTableData.map((customTable) => (
            <JsonViewer key={customTable._id} data={customTable} title={customTable.name} />
          ))
        )}
      </CommandSection>
    </div>
  );
}
