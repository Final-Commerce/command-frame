import { useState, useEffect } from 'react';
import { manageClient } from '@final-commerce/command-frame';
import { JsonViewer } from '../components/JsonViewer';
import '../App.css';
import '../components/sections/Sections.css';

// Custom table type matching backend response
interface CustomTable {
  _id: string;
  organizationId: string;
  availability: string;
  name: string;
  description?: string;
  metadata?: Array<{ key: string; val: any; _id?: string }>;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Custom table data row type
interface CustomTableRow {
  _id: string;
  [key: string]: any;
}

export function ManageApp() {
  const [contextData, setContextData] = useState<any>(null);
  const [finalContextData, setFinalContextData] = useState<any>(null);
  const [apiKeyData, setApiKeyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Custom Tables state
  const [customTables, setCustomTables] = useState<CustomTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<CustomTable | null>(null);
  const [customTableData, setCustomTableData] = useState<CustomTableRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<CustomTableRow | null>(null);
  const [tableNameInput, setTableNameInput] = useState('');
  const [deleteRowId, setDeleteRowId] = useState('');
  const [deleteResult, setDeleteResult] = useState<any>(null);
  
  // Custom Extensions state
  const [customExtensions, setCustomExtensions] = useState<any[]>([]);
  const [currentCompanyExtensions, setCurrentCompanyExtensions] = useState<any[]>([]);
  const [extensionIdInput, setExtensionIdInput] = useState('');
  const [extensionCustomTables, setExtensionCustomTables] = useState<any[]>([]);
  
  const isInIframe = window.self !== window.top;

  // When a table is selected, update the tableNameInput
  useEffect(() => {
    if (selectedTable) {
      setTableNameInput(selectedTable.name);
      // Clear previous data when switching tables
      setCustomTableData([]);
      setSelectedRow(null);
    }
  }, [selectedTable]);

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
      const context = contextData || await manageClient.getContext();
      if (!context?.company?._id) {
        throw new Error('No company ID available. Please get context first.');
      }
      const result = await manageClient.generateAPIKey({ 
        companyId: context.company._id
      });
      setApiKeyData(result);
    } catch (err: any) {
      setError(err.message || 'Error creating API key');
    } finally {
      setLoading(false);
    }
  };

  // Custom Tables handlers
  const handleGetCustomTables = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await manageClient.getCustomTables();
      // Handle both array and { data: [], count: number } formats
      const tables = Array.isArray(result.customTables) 
        ? result.customTables 
        : (result as any).data || [];
      setCustomTables(tables);
    } catch (err: any) {
      setError(err.message || 'Error fetching custom tables');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTable = (table: CustomTable) => {
    setSelectedTable(table);
  };

  const handleGetCustomTableData = async () => {
    setLoading(true);
    setError('');
    try {
      if (!tableNameInput) {
        throw new Error('Table name is required');
      }
      const result = await manageClient.getCustomTableData({ tableName: tableNameInput });
      // Handle both array and { data: [], count: number } formats
      const data = Array.isArray(result.data) ? result.data : [];
      setCustomTableData(data);
      setSelectedRow(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching custom table data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRow = (row: CustomTableRow) => {
    setSelectedRow(row);
    setDeleteRowId(row._id);
  };

  const handleDeleteCustomTableData = async () => {
    setLoading(true);
    setError('');
    try {
      if (!tableNameInput || !deleteRowId) {
        throw new Error('Table name and row ID are required');
      }
      const result = await manageClient.deleteCustomTableData({ 
        tableName: tableNameInput, 
        rowId: deleteRowId 
      });
      setDeleteResult(result);
      // Refresh data after delete
      handleGetCustomTableData();
    } catch (err: any) {
      setError(err.message || 'Error deleting custom table data');
    } finally {
      setLoading(false);
    }
  };

  // Custom Extensions handlers
  const handleGetCustomExtensions = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await manageClient.getCustomExtensions();
      setCustomExtensions(result.customExtensions || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching custom extensions');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentCompanyCustomExtensions = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await manageClient.getCurrentCompanyCustomExtensions({});
      setCurrentCompanyExtensions(result.customExtensions || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching current company custom extensions');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCustomExtensionCustomTables = async () => {
    setLoading(true);
    setError('');
    try {
      if (!extensionIdInput) {
        throw new Error('Extension ID is required');
      }
      const result = await manageClient.getCustomExtensionCustomTables({ 
        extensionId: extensionIdInput 
      });
      setExtensionCustomTables(result.customTables || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching custom extension custom tables');
    } finally {
      setLoading(false);
    }
  };

  // Styles for selectable cards
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
  };

  const selectedCardStyle = {
    ...cardStyle,
    border: '2px solid #1976d2',
    backgroundColor: '#e3f2fd',
  };

  const cardHoverStyle = {
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
        
        <div className="app__content" style={{ padding: '20px', overflowY: 'auto' }}>
          {error && (
            <div className="error-message" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="section-content">
            {/* Context Section */}
            <h2 style={{ marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Context</h2>
            
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

            {/* Custom Tables Section */}
            <h2 style={{ marginTop: '32px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Custom Tables</h2>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Custom Tables</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves custom tables linked to <strong>this extension</strong>. Click on a table to select it for data operations.
                </p>
                <button 
                  onClick={handleGetCustomTables} 
                  disabled={loading}
                  className="btn btn--primary"
                >
                  Get Custom Tables
                </button>
                
                {customTables.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                      <strong>{customTables.length} table(s) found.</strong> Click to select:
                    </p>
                    {customTables.map((table) => (
                      <div
                        key={table._id}
                        style={selectedTable?._id === table._id ? selectedCardStyle : cardStyle}
                        onClick={() => handleSelectTable(table)}
                        onMouseEnter={(e) => {
                          if (selectedTable?._id !== table._id) {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTable?._id !== table._id) {
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#333' }}>{table.name}</strong>
                            {table.description && (
                              <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                                {table.description}
                              </p>
                            )}
                          </div>
                          {selectedTable?._id === table._id && (
                            <span style={{ 
                              backgroundColor: '#1976d2', 
                              color: '#fff', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              Selected
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                          ID: {table._id}
                        </div>
                        {table.metadata && table.metadata.length > 0 && (
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                            Metadata: {table.metadata.map(m => `${m.key}=${m.val}`).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Custom Table Data</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves data (rows) from a custom table by name. Click a row to select it for deletion.
                </p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Table Name:</label>
                  <input
                    type="text"
                    value={tableNameInput}
                    onChange={(e) => setTableNameInput(e.target.value)}
                    className="form-input"
                    placeholder="Select a table above or enter name"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </div>
                <button 
                  onClick={handleGetCustomTableData} 
                  disabled={loading || !tableNameInput}
                  className="btn btn--primary"
                >
                  Get Custom Table Data
                </button>
                
                {customTableData.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                      <strong>{customTableData.length} row(s) found.</strong> Click to select:
                    </p>
                    {customTableData.map((row, index) => (
                      <div
                        key={row._id || index}
                        style={selectedRow?._id === row._id ? selectedCardStyle : cardStyle}
                        onClick={() => handleSelectRow(row)}
                        onMouseEnter={(e) => {
                          if (selectedRow?._id !== row._id) {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRow?._id !== row._id) {
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <strong style={{ fontSize: '13px', color: '#333' }}>Row {index + 1}</strong>
                          {selectedRow?._id === row._id && (
                            <span style={{ 
                              backgroundColor: '#1976d2', 
                              color: '#fff', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              Selected
                            </span>
                          )}
                        </div>
                        <pre style={{ 
                          fontSize: '11px', 
                          color: '#666', 
                          margin: '8px 0 0 0',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          maxHeight: '100px',
                          overflow: 'auto'
                        }}>
                          {JSON.stringify(row, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
                
                {customTableData.length === 0 && tableNameInput && (
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
                    No data found. Click "Get Custom Table Data" to fetch rows.
                  </p>
                )}
              </div>
            </div>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Delete Custom Table Data</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Delete a row from a custom table. Select a row above to auto-fill the ID.
                </p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Table Name:</label>
                  <input
                    type="text"
                    value={tableNameInput}
                    onChange={(e) => setTableNameInput(e.target.value)}
                    className="form-input"
                    placeholder="Enter Table Name"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Row ID:</label>
                  <input
                    type="text"
                    value={deleteRowId}
                    onChange={(e) => setDeleteRowId(e.target.value)}
                    className="form-input"
                    placeholder="Select a row above or enter ID"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </div>
                <button 
                  onClick={handleDeleteCustomTableData} 
                  disabled={loading || !tableNameInput || !deleteRowId}
                  className="btn btn--primary"
                  style={{ backgroundColor: '#c62828' }}
                >
                  Delete Row
                </button>
                {deleteResult && (
                  <JsonViewer data={deleteResult} title="Delete Result" />
                )}
              </div>
            </div>

            {/* Custom Extensions Section */}
            <h2 style={{ marginTop: '32px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Custom Extensions</h2>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Custom Extensions</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves all custom extensions available for the organization.
                </p>
                <button 
                  onClick={handleGetCustomExtensions} 
                  disabled={loading}
                  className="btn btn--primary"
                >
                  Get Custom Extensions
                </button>
                {customExtensions.length > 0 && customExtensions.map((ext) => (
                  <JsonViewer key={ext._id} data={ext} title={ext.label} />
                ))}
              </div>
            </div>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Current Company Custom Extensions</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves custom extensions installed for the current company.
                </p>
                <button 
                  onClick={handleGetCurrentCompanyCustomExtensions} 
                  disabled={loading}
                  className="btn btn--primary"
                >
                  Get Current Company Extensions
                </button>
                {currentCompanyExtensions.length > 0 && currentCompanyExtensions.map((ext) => (
                  <JsonViewer key={ext._id} data={ext} title={ext.label} />
                ))}
              </div>
            </div>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Custom Extension Custom Tables</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves custom tables linked to a specific extension by ID.
                </p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Extension ID:</label>
                  <input
                    type="text"
                    value={extensionIdInput}
                    onChange={(e) => setExtensionIdInput(e.target.value)}
                    className="form-input"
                    placeholder="Enter Extension ID"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </div>
                <button 
                  onClick={handleGetCustomExtensionCustomTables} 
                  disabled={loading || !extensionIdInput}
                  className="btn btn--primary"
                >
                  Get Extension Custom Tables
                </button>
                {extensionCustomTables.length > 0 && extensionCustomTables.map((table) => (
                  <JsonViewer key={table._id} data={table} title={table.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
