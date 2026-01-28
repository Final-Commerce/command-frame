import { useState, useEffect } from 'react';
import { manageClient } from '@final-commerce/command-frame';
import { JsonViewer } from '../components/JsonViewer';
import '../App.css';
import '../components/sections/Sections.css';

// Custom table type matching backend response (includes optional fields from CFCustomTable)
interface CustomTable {
  _id: string;
  name: string;
  organizationId?: string;
  availability?: string;
  description?: string;
  metadata?: Array<{ key: string; val?: any; value?: any; _id?: string }>;
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
  const [tableIdInput, setTableIdInput] = useState('');
  const [deleteRowId, setDeleteRowId] = useState('');
  const [deleteResult, setDeleteResult] = useState<any>(null);
  
  // Pagination state
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationOffset, setPaginationOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  
  // Navigation menu state
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  
  // Create document state
  const [createJson, setCreateJson] = useState('{}');
  const [createResult, setCreateResult] = useState<any>(null);
  const [createError, setCreateError] = useState<string>('');
  
  // Upsert state
  const [upsertJson, setUpsertJson] = useState('{}');
  const [upsertResult, setUpsertResult] = useState<any>(null);
  const [upsertError, setUpsertError] = useState<string>('');
  
  // Custom Extensions state
  const [customExtensions, setCustomExtensions] = useState<any[]>([]);
  const [currentCompanyExtensions, setCurrentCompanyExtensions] = useState<any[]>([]);
  const [extensionIdInput, setExtensionIdInput] = useState('');
  const [extensionCustomTables, setExtensionCustomTables] = useState<any[]>([]);
  
  const isInIframe = window.self !== window.top;

  // Auto-fetch context on mount when in iframe
  useEffect(() => {
    if (isInIframe && !contextData) {
      manageClient.getContext()
        .then(setContextData)
        .catch((err) => console.error('Failed to auto-fetch context:', err));
    }
  }, [isInIframe]);

  // When a table is selected, update the inputs
  useEffect(() => {
    if (selectedTable) {
      setTableNameInput(selectedTable.name);
      setTableIdInput(selectedTable._id);
      // Clear previous data when switching tables
      setCustomTableData([]);
      setSelectedRow(null);
    }
  }, [selectedTable]);

  // When context is loaded, set the extension ID input
  useEffect(() => {
    if (contextData?.extensionId && !extensionIdInput) {
      setExtensionIdInput(contextData.extensionId);
    }
  }, [contextData, extensionIdInput]);

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

  // Get Custom Tables for Extension
  const handleGetCustomTablesForExtension = async () => {
    setLoading(true);
    setError('');
    try {
      if (!extensionIdInput) {
        throw new Error('Extension ID is required. Get context first or enter an extension ID.');
      }
      const result = await manageClient.getCustomExtensionCustomTables({ 
        extensionId: extensionIdInput 
      });
      const tables = result.customTables || [];
      setCustomTables(tables as CustomTable[]);
      if (tables.length === 0) {
        setError('No custom tables found for this extension.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching custom tables for extension');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTable = (table: CustomTable) => {
    setSelectedTable(table);
  };

  // Get Custom Table Data by Table ID
  const handleGetCustomTableDataById = async (newOffset?: number) => {
    setLoading(true);
    setError('');
    try {
      if (!tableIdInput) {
        throw new Error('Table ID is required');
      }
      const offset = newOffset !== undefined ? newOffset : paginationOffset;
      // Use tableId if the types support it
      const result = await manageClient.getCustomTableData({ 
        tableId: tableIdInput,
        offset,
        limit: paginationLimit,
      } as any);
      const data = Array.isArray(result.data) ? result.data : [];
      setCustomTableData(data);
      setSelectedRow(null);
      if (newOffset !== undefined) setPaginationOffset(newOffset);
      // Try to get total count from response if available
      if ((result as any).count !== undefined) {
        setTotalCount((result as any).count);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching custom table data');
    } finally {
      setLoading(false);
    }
  };

  // Get Custom Table Data by Table Name
  const handleGetCustomTableDataByName = async (newOffset?: number) => {
    setLoading(true);
    setError('');
    try {
      if (!tableNameInput) {
        throw new Error('Table name is required');
      }
      const offset = newOffset !== undefined ? newOffset : paginationOffset;
      const result = await manageClient.getCustomTableData({ 
        tableName: tableNameInput,
        offset,
        limit: paginationLimit,
      });
      const data = Array.isArray(result.data) ? result.data : [];
      setCustomTableData(data);
      setSelectedRow(null);
      if (newOffset !== undefined) setPaginationOffset(newOffset);
      // Try to get total count from response if available
      if ((result as any).count !== undefined) {
        setTotalCount((result as any).count);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching custom table data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRow = (row: CustomTableRow) => {
    setSelectedRow(row);
    setDeleteRowId(row._id);
    // Pre-populate upsert JSON with selected row data
    setUpsertJson(JSON.stringify(row, null, 2));
  };

  // Create new document (POST with validation)
  const handleCreateDocument = async () => {
    setLoading(true);
    setCreateError('');
    setCreateResult(null);
    try {
      if (!tableNameInput) {
        throw new Error('Table name is required');
      }
      let data;
      try {
        data = JSON.parse(createJson);
      } catch (parseErr) {
        throw new Error('Invalid JSON: ' + (parseErr as Error).message);
      }
      // Remove _id if present since we're creating new
      delete data._id;
      delete data.createdAt;
      delete data.updatedAt;
      
      const result = await manageClient.upsertCustomTableData({ 
        tableName: tableNameInput, 
        data 
      });
      
      if (!result.success) {
        throw new Error((result as any).error || 'Create failed');
      }
      
      setCreateResult(result);
      // Refresh data after create
      handleGetCustomTableDataByName();
    } catch (err: any) {
      const errorMsg = err.message || JSON.stringify(err) || 'Error creating document';
      setCreateError(errorMsg);
      console.error('Create document error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upsert document (update existing)
  const handleUpsertCustomTableData = async () => {
    setLoading(true);
    setUpsertError('');
    setUpsertResult(null);
    try {
      if (!tableNameInput) {
        throw new Error('Table name is required');
      }
      let data;
      try {
        data = JSON.parse(upsertJson);
      } catch (parseErr) {
        throw new Error('Invalid JSON: ' + (parseErr as Error).message);
      }
      if (!data._id) {
        throw new Error('_id is required for update. Use "Create Document" for new records.');
      }
      const result = await manageClient.upsertCustomTableData({ 
        tableName: tableNameInput, 
        data 
      });
      
      if (!result.success) {
        throw new Error((result as any).error || 'Update failed');
      }
      
      setUpsertResult(result);
      // Refresh data after upsert
      handleGetCustomTableDataByName();
    } catch (err: any) {
      const errorMsg = err.message || JSON.stringify(err) || 'Error updating document';
      setUpsertError(errorMsg);
      console.error('Upsert error:', err);
    } finally {
      setLoading(false);
    }
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
      handleGetCustomTableDataByName();
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

  // Navigation menu items
  const navItems = [
    { id: 'section-context', label: 'Context' },
    { id: 'section-custom-tables', label: 'Custom Tables' },
    { id: 'section-get-data', label: '↳ Get Data' },
    { id: 'section-create', label: '↳ Create Document' },
    { id: 'section-update', label: '↳ Update Document' },
    { id: 'section-delete', label: '↳ Delete Document' },
    { id: 'section-extensions', label: 'Custom Extensions' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setNavMenuOpen(false);
    }
  };

  return (
    <div className="app">
      <div className="app__main" style={{ marginLeft: 0, width: '100%' }}>
        <div className="app__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="app__title">Manage Integration Example</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="app__status">
              <span className={`app__status-indicator ${isInIframe ? 'app__status-indicator--active' : ''}`}></span>
              <span className="app__status-text">
                {isInIframe ? 'Running in iframe' : 'Not in iframe (Mock Mode)'}
              </span>
            </div>
            
            {/* Navigation Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNavMenuOpen(!navMenuOpen)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
                title="Navigation Menu"
              >
                {navMenuOpen ? '✕' : '☰'}
              </button>
              
              {navMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '44px',
                  right: '0',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 1000,
                }}>
                  <div style={{ 
                    padding: '12px 16px', 
                    backgroundColor: '#1976d2', 
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    Jump to Section
                  </div>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#333',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <h2 id="section-context" style={{ marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Context</h2>
            
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
            <h2 id="section-custom-tables" style={{ marginTop: '32px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Custom Tables</h2>

            <div className="command-section">
              <div className="command-section__header">
                <h3>Get Custom Tables for Extension</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves custom tables linked to a specific extension. The extension ID is auto-filled from context.
                </p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Extension ID:</label>
                  <input
                    type="text"
                    value={extensionIdInput}
                    onChange={(e) => setExtensionIdInput(e.target.value)}
                    className="form-input"
                    placeholder="Get context first or enter extension ID"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </div>
                <button 
                  onClick={handleGetCustomTablesForExtension} 
                  disabled={loading || !extensionIdInput}
                  className="btn btn--primary"
                >
                  Get Custom Tables for Extension
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
                
                {customTables.length === 0 && extensionIdInput && (
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '12px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    No custom tables found for this extension. Make sure you have linked custom tables to this extension.
                  </p>
                )}
              </div>
            </div>

            <div className="command-section" id="section-get-data">
              <div className="command-section__header">
                <h3>Get Custom Table Data</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Retrieves data (rows) from a custom table. You can query by table ID or by table name.
                </p>
                
                {/* Pagination Controls */}
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  marginBottom: '16px', 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500 }}>Limit:</label>
                    <select 
                      value={paginationLimit} 
                      onChange={(e) => setPaginationLimit(Number(e.target.value))}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500 }}>Offset:</label>
                    <input 
                      type="number" 
                      value={paginationOffset} 
                      onChange={(e) => setPaginationOffset(Number(e.target.value))}
                      min={0}
                      style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  {totalCount !== null && (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      Total: {totalCount} rows
                    </span>
                  )}
                </div>
                
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Table ID:</label>
                  <input
                    type="text"
                    value={tableIdInput}
                    onChange={(e) => setTableIdInput(e.target.value)}
                    className="form-input"
                    placeholder="Select a table above or enter ID"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </div>
                <button 
                  onClick={() => handleGetCustomTableDataById()} 
                  disabled={loading || !tableIdInput}
                  className="btn btn--primary"
                  style={{ marginRight: '8px' }}
                >
                  Get by Table ID
                </button>
                
                <div className="form-group" style={{ marginTop: '16px', marginBottom: '12px' }}>
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
                  onClick={() => handleGetCustomTableDataByName()} 
                  disabled={loading || !tableNameInput}
                  className="btn btn--primary"
                >
                  Get by Table Name
                </button>
                
                {customTableData.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        <strong>{customTableData.length} row(s) shown</strong> (offset: {paginationOffset}, limit: {paginationLimit})
                        {totalCount !== null && <span> of {totalCount} total</span>}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            const newOffset = Math.max(0, paginationOffset - paginationLimit);
                            setPaginationOffset(newOffset);
                            if (tableNameInput) handleGetCustomTableDataByName(newOffset);
                            else if (tableIdInput) handleGetCustomTableDataById(newOffset);
                          }}
                          disabled={loading || paginationOffset === 0}
                          style={{ 
                            padding: '4px 12px', 
                            fontSize: '12px',
                            backgroundColor: paginationOffset === 0 ? '#e0e0e0' : '#1976d2',
                            color: paginationOffset === 0 ? '#999' : '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: paginationOffset === 0 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          ← Prev
                        </button>
                        <button
                          onClick={() => {
                            const newOffset = paginationOffset + paginationLimit;
                            setPaginationOffset(newOffset);
                            if (tableNameInput) handleGetCustomTableDataByName(newOffset);
                            else if (tableIdInput) handleGetCustomTableDataById(newOffset);
                          }}
                          disabled={loading || customTableData.length < paginationLimit || (totalCount !== null && paginationOffset + paginationLimit >= totalCount)}
                          style={{ 
                            padding: '4px 12px', 
                            fontSize: '12px',
                            backgroundColor: (customTableData.length < paginationLimit || (totalCount !== null && paginationOffset + paginationLimit >= totalCount)) ? '#e0e0e0' : '#1976d2',
                            color: (customTableData.length < paginationLimit || (totalCount !== null && paginationOffset + paginationLimit >= totalCount)) ? '#999' : '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (customTableData.length < paginationLimit || (totalCount !== null && paginationOffset + paginationLimit >= totalCount)) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>Click to select:
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
                
                {customTableData.length === 0 && (tableNameInput || tableIdInput) && (
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
                    No data found. Click one of the "Get" buttons to fetch rows.
                  </p>
                )}
              </div>
            </div>

            <div className="command-section" id="section-create">
              <div className="command-section__header">
                <h3>Create Document (POST)</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Create a new row in a custom table. The backend validates that all field names exist in the table schema and that value types match. Uses a transaction for atomicity.
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
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Data (JSON - do NOT include _id):</label>
                  <textarea
                    value={createJson}
                    onChange={(e) => setCreateJson(e.target.value)}
                    className="form-input"
                    placeholder='{"fieldName": "value", ...}'
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      marginTop: '4px',
                      minHeight: '120px',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                  />
                </div>
                <button 
                  onClick={handleCreateDocument} 
                  disabled={loading || !tableNameInput}
                  className="btn btn--primary"
                  style={{ backgroundColor: '#2e7d32' }}
                >
                  Create Document
                </button>
                {createError && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '12px', 
                    backgroundColor: '#ffebee', 
                    color: '#c62828', 
                    borderRadius: '4px',
                    border: '1px solid #ef9a9a',
                    fontSize: '13px'
                  }}>
                    <strong>❌ Create Error:</strong>
                    <pre style={{ 
                      margin: '8px 0 0 0', 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-all',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}>
                      {createError}
                    </pre>
                  </div>
                )}
                {createResult && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#e8f5e9', 
                      color: '#2e7d32', 
                      borderRadius: '4px',
                      marginBottom: '8px',
                      fontSize: '13px'
                    }}>
                      ✅ Document created successfully!
                    </div>
                    <JsonViewer data={createResult} title="Create Result" />
                  </div>
                )}
              </div>
            </div>

            <div className="command-section" id="section-update">
              <div className="command-section__header">
                <h3>Update Document (Upsert)</h3>
              </div>
              <div className="command-section__content">
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Update an existing row. The JSON <strong>must include the _id</strong> field. Select a row above to pre-populate.
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
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Data (JSON - must include _id):</label>
                  <textarea
                    value={upsertJson}
                    onChange={(e) => setUpsertJson(e.target.value)}
                    className="form-input"
                    placeholder='{"_id": "...", "fieldName": "value", ...}'
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      marginTop: '4px',
                      minHeight: '120px',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                    Tip: Select a row above to pre-populate this field for editing
                  </p>
                </div>
                <button 
                  onClick={handleUpsertCustomTableData} 
                  disabled={loading || !tableNameInput}
                  className="btn btn--primary"
                  style={{ backgroundColor: '#1976d2' }}
                >
                  Update Document
                </button>
                {upsertError && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '12px', 
                    backgroundColor: '#ffebee', 
                    color: '#c62828', 
                    borderRadius: '4px',
                    border: '1px solid #ef9a9a',
                    fontSize: '13px'
                  }}>
                    <strong>❌ Update Error:</strong>
                    <pre style={{ 
                      margin: '8px 0 0 0', 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-all',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}>
                      {upsertError}
                    </pre>
                  </div>
                )}
                {upsertResult && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#e8f5e9', 
                      color: '#2e7d32', 
                      borderRadius: '4px',
                      marginBottom: '8px',
                      fontSize: '13px'
                    }}>
                      ✅ Document updated successfully!
                    </div>
                    <JsonViewer data={upsertResult} title="Update Result" />
                  </div>
                )}
              </div>
            </div>

            <div className="command-section" id="section-delete">
              <div className="command-section__header">
                <h3>Delete Document</h3>
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
            <h2 id="section-extensions" style={{ marginTop: '32px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Custom Extensions</h2>

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
                  Retrieves custom extensions installed for the current company. Uses aggregation to lookup extension details.
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
