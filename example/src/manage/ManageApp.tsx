import { useState, useEffect, useRef } from "react";
import { manageClient } from "@final-commerce/command-frame";
import { JsonViewer } from "../components/JsonViewer";
import "../App.css";
import "../components/sections/Sections.css";

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
    const [error, setError] = useState<string>("");

    // Custom Tables state
    const [customTables, setCustomTables] = useState<CustomTable[]>([]);
    const [selectedTable, setSelectedTable] = useState<CustomTable | null>(null);
    const [customTableData, setCustomTableData] = useState<CustomTableRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<CustomTableRow | null>(null);
    const [tableNameInput, setTableNameInput] = useState("");
    const [tableIdInput, setTableIdInput] = useState("");
    const [deleteRowId, setDeleteRowId] = useState("");
    const [deleteResult, setDeleteResult] = useState<any>(null);

    // Pagination state
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [paginationOffset, setPaginationOffset] = useState(0);
    const [totalCount, setTotalCount] = useState<number | null>(null);

    // Navigation menu state
    const [navMenuOpen, setNavMenuOpen] = useState(false);

    // Create document state
    const [createJson, setCreateJson] = useState("{}");
    const [createResult, setCreateResult] = useState<any>(null);
    const [createError, setCreateError] = useState<string>("");

    // Upsert state
    const [upsertJson, setUpsertJson] = useState("{}");
    const [upsertResult, setUpsertResult] = useState<any>(null);
    const [upsertError, setUpsertError] = useState<string>("");

    // Custom Extensions state
    const [customExtensions, setCustomExtensions] = useState<any[]>([]);
    const [currentCompanyExtensions, setCurrentCompanyExtensions] = useState<any[]>([]);
    const [extensionIdInput, setExtensionIdInput] = useState("");
    const [extensionCustomTables, setExtensionCustomTables] = useState<any[]>([]);

    // Secrets state
    const [secretKeys, setSecretKeys] = useState<string[]>([]);
    const [secretKeyInput, setSecretKeyInput] = useState("");
    const [secretValueInput, setSecretValueInput] = useState("");
    const [secretExtensionIdInput, setSecretExtensionIdInput] = useState("");
    const [secretGetResult, setSecretGetResult] = useState<{ key: string; value: string } | null>(null);
    const [secretSetResult, setSecretSetResult] = useState<boolean | null>(null);
    const [secretError, setSecretError] = useState<string>("");

    // Only initialize extension ID inputs from context once (so clearing the field is not overwritten)
    const hasInitializedExtensionIdFromContext = useRef(false);
    const hasInitializedSecretExtensionIdFromContext = useRef(false);

    // Company Data state
    const [manageUsers, setManageUsers] = useState<any[]>([]);
    const [manageRoles, setManageRoles] = useState<any[]>([]);
    const [manageCustomers, setManageCustomers] = useState<any[]>([]);
    const [customersCount, setCustomersCount] = useState<number>(0);
    const [customersOffset, setCustomersOffset] = useState(0);
    const [customersLimit, setCustomersLimit] = useState(10);
    const [customersFilter, setCustomersFilter] = useState("");

    // Products state
    const [products, setProducts] = useState<any[]>([]);
    const [productsOffset, setProductsOffset] = useState(0);
    const [productsLimit, setProductsLimit] = useState(10);
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const [productsFetched, setProductsFetched] = useState(false);
    const [productsStatusFilter, setProductsStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [productsCategoryFilter, setProductsCategoryFilter] = useState("");
    const [showInventoryVariantId, setShowInventoryVariantId] = useState<string | null>(null);

    // Categories state
    const [categories, setCategories] = useState<any[]>([]);

    // Product CRUD state
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editProductName, setEditProductName] = useState("");
    const [editProductDescription, setEditProductDescription] = useState("");
    const [editProductStatus, setEditProductStatus] = useState<"active" | "inactive">("active");

    // Outlets state
    const [outlets, setOutlets] = useState<any[]>([]);
    const [outletsFetched, setOutletsFetched] = useState(false);

    // Stations state
    const [stations, setStations] = useState<any[]>([]);
    const [stationsFetched, setStationsFetched] = useState(false);
    const [selectedOutletForStations, setSelectedOutletForStations] = useState("");

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [ordersLimit, setOrdersLimit] = useState(10);
    const [ordersOffset, setOrdersOffset] = useState(0);
    const [ordersSearch, setOrdersSearch] = useState("");
    const [ordersStatusFilter, setOrdersStatusFilter] = useState<string>("all");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [ordersFetched, setOrdersFetched] = useState(false);

    const isInIframe = window.self !== window.top;

    // Auto-fetch context on mount when in iframe
    useEffect(() => {
        if (isInIframe && !contextData) {
            manageClient
                .getContext()
                .then(setContextData)
                .catch(err => console.error("Failed to auto-fetch context:", err));
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
            // Reset pagination state
            setPaginationOffset(0);
            setTotalCount(null);
        }
    }, [selectedTable]);

    // When context is loaded, set the extension ID input once (user can clear it afterward)
    useEffect(() => {
        if (contextData?.extensionId && !hasInitializedExtensionIdFromContext.current) {
            setExtensionIdInput(contextData.extensionId);
            hasInitializedExtensionIdFromContext.current = true;
        }
    }, [contextData]);

    // When context is loaded, set the secrets extension ID input once (user can clear it afterward)
    useEffect(() => {
        if (contextData?.extensionId && !hasInitializedSecretExtensionIdFromContext.current) {
            setSecretExtensionIdInput(contextData.extensionId);
            hasInitializedSecretExtensionIdFromContext.current = true;
        }
    }, [contextData]);

    const handleGetContext = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getContext();
            setContextData(result);
        } catch (err: any) {
            setError(err.message || "Error fetching context");
        } finally {
            setLoading(false);
        }
    };

    const handleGetFinalContext = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getFinalContext();
            setFinalContextData(result);
        } catch (err: any) {
            setError(err.message || "Error fetching final context");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAPIKey = async () => {
        setLoading(true);
        setError("");
        try {
            const context = contextData || (await manageClient.getContext());
            if (!context?.company?._id) {
                throw new Error("No company ID available. Please get context first.");
            }
            const result = await manageClient.generateAPIKey({
                companyId: context.company._id
            });
            setApiKeyData(result);
        } catch (err: any) {
            setError(err.message || "Error creating API key");
        } finally {
            setLoading(false);
        }
    };

    // Get Custom Tables for Extension
    const handleGetCustomTablesForExtension = async () => {
        setLoading(true);
        setError("");
        try {
            if (!extensionIdInput) {
                throw new Error("Extension ID is required. Get context first or enter an extension ID.");
            }
            const result = await manageClient.getCustomExtensionCustomTables({
                extensionId: extensionIdInput
            });
            const tables = result.customTables || [];
            setCustomTables(tables as CustomTable[]);
            if (tables.length === 0) {
                setError("No custom tables found for this extension.");
            }
        } catch (err: any) {
            setError(err.message || "Error fetching custom tables for extension");
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
        setError("");
        try {
            if (!tableIdInput) {
                throw new Error("Table ID is required");
            }
            const offset = newOffset !== undefined ? newOffset : paginationOffset;
            // Use tableId if the types support it
            const result = await manageClient.getCustomTableData({
                tableId: tableIdInput,
                offset,
                limit: paginationLimit
            });
            const data = Array.isArray(result.data) ? result.data : [];
            setCustomTableData(data);
            setSelectedRow(null);
            if (newOffset !== undefined) setPaginationOffset(newOffset);
            const resp = result as any;
            if (resp.count !== undefined) {
                setTotalCount(resp.count);
            }
        } catch (err: any) {
            setError(err.message || "Error fetching custom table data");
        } finally {
            setLoading(false);
        }
    };

    // Get Custom Table Data by Table Name
    const handleGetCustomTableDataByName = async (newOffset?: number) => {
        setLoading(true);
        setError("");
        try {
            if (!tableNameInput) {
                throw new Error("Table name is required");
            }
            const offset = newOffset !== undefined ? newOffset : paginationOffset;
            const result = await manageClient.getCustomTableData({
                tableName: tableNameInput,
                offset,
                limit: paginationLimit
            });
            const data = Array.isArray(result.data) ? result.data : [];
            setCustomTableData(data);
            setSelectedRow(null);
            if (newOffset !== undefined) setPaginationOffset(newOffset);
            const resp = result as any;
            if (resp.count !== undefined) {
                setTotalCount(resp.count);
            }
        } catch (err: any) {
            setError(err.message || "Error fetching custom table data");
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
        setCreateError("");
        setCreateResult(null);
        try {
            if (!tableNameInput) {
                throw new Error("Table name is required");
            }
            let data;
            try {
                data = JSON.parse(createJson);
            } catch (parseErr) {
                throw new Error("Invalid JSON: " + (parseErr as Error).message);
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
                throw new Error((result as any).error || "Create failed");
            }

            setCreateResult(result);
            // Refresh data after create
            await handleGetCustomTableDataByName();
        } catch (err: any) {
            const errorMsg = err.message || JSON.stringify(err) || "Error creating document";
            setCreateError(errorMsg);
            console.error("Create document error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Upsert document (update existing)
    const handleUpsertCustomTableData = async () => {
        setLoading(true);
        setUpsertError("");
        setUpsertResult(null);
        try {
            if (!tableNameInput) {
                throw new Error("Table name is required");
            }
            let data;
            try {
                data = JSON.parse(upsertJson);
            } catch (parseErr) {
                throw new Error("Invalid JSON: " + (parseErr as Error).message);
            }
            const result = await manageClient.upsertCustomTableData({
                tableName: tableNameInput,
                data
            });

            if (!result.success) {
                throw new Error((result as any).error || "Update failed");
            }

            setUpsertResult(result);
            // Refresh data after upsert
            await handleGetCustomTableDataByName();
        } catch (err: any) {
            const errorMsg = err.message || JSON.stringify(err) || "Error updating document";
            setUpsertError(errorMsg);
            console.error("Upsert error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCustomTableData = async () => {
        setLoading(true);
        setError("");
        try {
            if (!tableNameInput || !deleteRowId) {
                throw new Error("Table name and row ID are required");
            }
            const result = await manageClient.deleteCustomTableData({
                tableName: tableNameInput,
                rowId: deleteRowId
            });
            setDeleteResult(result);
            // Refresh data after delete
            await handleGetCustomTableDataByName();
        } catch (err: any) {
            setError(err.message || "Error deleting custom table data");
        } finally {
            setLoading(false);
        }
    };

    // Custom Extensions handlers
    const handleGetCustomExtensions = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getCustomExtensions();
            setCustomExtensions(result.customExtensions || []);
        } catch (err: any) {
            setError(err.message || "Error fetching custom extensions");
        } finally {
            setLoading(false);
        }
    };

    const handleGetCurrentCompanyCustomExtensions = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getCurrentCompanyCustomExtensions({});
            setCurrentCompanyExtensions(result.customExtensions || []);
        } catch (err: any) {
            setError(err.message || "Error fetching current company custom extensions");
        } finally {
            setLoading(false);
        }
    };

    const handleGetCustomExtensionCustomTables = async () => {
        setLoading(true);
        setError("");
        try {
            if (!extensionIdInput) {
                throw new Error("Extension ID is required");
            }
            const result = await manageClient.getCustomExtensionCustomTables({
                extensionId: extensionIdInput
            });
            setExtensionCustomTables(result.customTables || []);
        } catch (err: any) {
            setError(err.message || "Error fetching custom extension custom tables");
        } finally {
            setLoading(false);
        }
    };

    // Company Data handlers
    const handleGetUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getUsers();
            setManageUsers(result.users || []);
        } catch (err: any) {
            setError(err.message || "Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleGetRoles = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getRoles();
            setManageRoles(result.roles || []);
        } catch (err: any) {
            setError(err.message || "Error fetching roles");
        } finally {
            setLoading(false);
        }
    };

    const handleGetCustomers = async (newOffset?: number) => {
        setLoading(true);
        setError("");
        try {
            const offset = newOffset !== undefined ? newOffset : customersOffset;
            const result = await manageClient.getCustomers({
                offset,
                limit: customersLimit,
                ...(customersFilter ? { query: { searchValue: customersFilter } } : {})
            });
            setManageCustomers(result.customers || []);
            setCustomersCount(result.total || 0);
            if (newOffset !== undefined) setCustomersOffset(newOffset);
        } catch (err: any) {
            setError(err.message || "Error fetching customers");
        } finally {
            setLoading(false);
        }
    };

    // Products handler
    const handleGetProducts = async (newOffset?: number) => {
        setLoading(true);
        setError("");
        try {
            const offset = newOffset !== undefined ? newOffset : productsOffset;
            const query: Record<string, any> = {};
            if (productsStatusFilter !== "all") {
                query.status = productsStatusFilter;
            }
            if (productsCategoryFilter.trim()) {
                query.categories = { $in: [productsCategoryFilter.trim()] };
            }
            const result = await manageClient.getProducts({
                offset,
                limit: productsLimit,
                query: Object.keys(query).length > 0 ? query : undefined
            });
            setProducts(result.products || []);
            setProductsFetched(true);
            if (newOffset !== undefined) setProductsOffset(newOffset);
        } catch (err: any) {
            setError(err.message || "Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    // Categories handler
    const handleGetCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getCategories();
            setCategories(result.categories || []);
        } catch (err: any) {
            setError(err.message || "Error fetching categories");
        } finally {
            setLoading(false);
        }
    };

    // Product CRUD handlers
    const handleEditProduct = async (productId: string) => {
        setLoading(true);
        setError("");
        try {
            await manageClient.editProduct({
                productId,
                changes: {
                    name: editProductName || undefined,
                    description: editProductDescription || undefined,
                    status: editProductStatus
                }
            });
            setEditingProductId(null);
            handleGetProducts();
        } catch (err: any) {
            setError(err.message || "Error editing product");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setLoading(true);
        setError("");
        try {
            await manageClient.deleteProduct({ productId });
            setProducts(products.filter(p => p._id !== productId));
        } catch (err: any) {
            setError(err.message || "Error deleting product");
        } finally {
            setLoading(false);
        }
    };

    // Entity handlers
    const handleGetOutlets = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getOutlets();
            setOutlets(result.outlets || []);
            setOutletsFetched(true);
        } catch (err: any) {
            setError(err.message || "Error fetching outlets");
        } finally {
            setLoading(false);
        }
    };

    const handleGetStations = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await manageClient.getStations(selectedOutletForStations ? { outletId: selectedOutletForStations } : undefined);
            setStations(result.stations || []);
            setStationsFetched(true);
        } catch (err: any) {
            setError(err.message || "Error fetching stations");
        } finally {
            setLoading(false);
        }
    };

    const handleGetOrders = async (newOffset?: number) => {
        setLoading(true);
        setError("");
        try {
            const offset = newOffset !== undefined ? newOffset : ordersOffset;
            const params: Record<string, any> = { limit: ordersLimit, offset };
            if (ordersSearch.trim()) params.searchValue = ordersSearch.trim();
            if (ordersStatusFilter !== "all") params.status = ordersStatusFilter;
            const result = await manageClient.getOrders(params);
            setOrders(result.orders || []);
            setOrdersTotal(result.total || 0);
            setOrdersFetched(true);
            if (newOffset !== undefined) setOrdersOffset(newOffset);
        } catch (err: any) {
            setError(err.message || "Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    // Secrets handlers
    const handleGetSecretsKeys = async () => {
        setLoading(true);
        setSecretError("");
        setSecretKeys([]);
        try {
            const result = await manageClient.getSecretsKeys({
                extensionId: secretExtensionIdInput
            });
            setSecretKeys(result.keys || []);
        } catch (err: any) {
            setSecretError(err.message || "Error fetching secret keys");
        } finally {
            setLoading(false);
        }
    };

    const handleGetSecretVal = async () => {
        setLoading(true);
        setSecretError("");
        setSecretGetResult(null);
        try {
            if (!secretKeyInput) {
                throw new Error("Key is required");
            }
            const result = await manageClient.getSecretVal({
                key: secretKeyInput,
                extensionId: secretExtensionIdInput
            });
            setSecretGetResult(result);
        } catch (err: any) {
            setSecretError(err.message || "Error fetching secret value");
        } finally {
            setLoading(false);
        }
    };

    const handleSetSecretVal = async () => {
        setLoading(true);
        setSecretError("");
        setSecretSetResult(null);
        try {
            if (!secretKeyInput) {
                throw new Error("Key is required");
            }
            if (secretValueInput === undefined || secretValueInput === null) {
                throw new Error("Value is required");
            }
            await manageClient.setSecretVal({
                key: secretKeyInput,
                value: String(secretValueInput),
                extensionId: secretExtensionIdInput
            });
            setSecretSetResult(true);
        } catch (err: any) {
            setSecretError(err.message || "Error setting secret");
            setSecretSetResult(false);
        } finally {
            setLoading(false);
        }
    };

    // Styles for selectable cards
    const cardStyle = {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        backgroundColor: "#fff"
    };

    const selectedCardStyle = {
        ...cardStyle,
        border: "2px solid #1976d2",
        backgroundColor: "#e3f2fd"
    };

    const cardHoverStyle = {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    };

    // Navigation menu items
    const navItems = [
        { id: "section-context", label: "Context" },
        { id: "section-company-data", label: "Company Data" },
        { id: "section-products", label: "Products" },
        { id: "section-categories", label: "Categories" },
        { id: "section-outlets", label: "Outlets" },
        { id: "section-stations", label: "Stations" },
        { id: "section-orders", label: "Orders" },
        { id: "section-custom-tables", label: "Custom Tables" },
        { id: "section-get-data", label: "↳ Get Data" },
        { id: "section-create", label: "↳ Create Document" },
        { id: "section-update", label: "↳ Update Document" },
        { id: "section-delete", label: "↳ Delete Document" },
        { id: "section-extensions", label: "Custom Extensions" },
        { id: "section-secrets", label: "Secrets" }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setNavMenuOpen(false);
        }
    };

    return (
        <div className="app">
            <div className="app__main" style={{ marginLeft: 0, width: "100%" }}>
                <div className="app__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 className="app__title">Manage Integration Example</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="app__status">
                            <span className={`app__status-indicator ${isInIframe ? "app__status-indicator--active" : ""}`}></span>
                            <span className="app__status-text">{isInIframe ? "Running in iframe" : "Not in iframe (Mock Mode)"}</span>
                        </div>

                        {/* Navigation Menu */}
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setNavMenuOpen(!navMenuOpen)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "6px",
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "18px"
                                }}
                                title="Navigation Menu"
                            >
                                {navMenuOpen ? "✕" : "☰"}
                            </button>

                            {navMenuOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "44px",
                                        right: "0",
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                        minWidth: "200px",
                                        overflow: "hidden",
                                        zIndex: 1000
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                            fontWeight: 600,
                                            fontSize: "14px"
                                        }}
                                    >
                                        Jump to Section
                                    </div>
                                    {navItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px 16px",
                                                textAlign: "left",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                borderBottom: "1px solid #eee",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                color: "#333",
                                                transition: "background-color 0.2s"
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="app__content" style={{ padding: "20px", overflowY: "auto" }}>
                    {error && (
                        <div
                            className="error-message"
                            style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px" }}
                        >
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    <div className="section-content">
                        {/* Context Section */}
                        <h2 id="section-context" style={{ marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            Context
                        </h2>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Context</h3>
                            </div>
                            <div className="command-section__content">
                                <button onClick={handleGetContext} disabled={loading} className="btn btn--primary">
                                    Get Context
                                </button>
                                {contextData && <JsonViewer data={JSON.stringify(contextData, null, 2)} title="Result" />}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Final Context</h3>
                            </div>
                            <div className="command-section__content">
                                <button onClick={handleGetFinalContext} disabled={loading} className="btn btn--primary">
                                    Get Final Context
                                </button>
                                {finalContextData && <JsonViewer data={JSON.stringify(finalContextData, null, 2)} title="Result" />}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Create API Key</h3>
                            </div>
                            <div className="command-section__content">
                                <button onClick={handleGenerateAPIKey} disabled={loading} className="btn btn--primary">
                                    Create API Key
                                </button>
                                <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                                    Requires context to be loaded first (uses company ID)
                                </p>
                                {apiKeyData && <JsonViewer data={JSON.stringify(apiKeyData, null, 2)} title="Result" />}
                            </div>
                        </div>

                        {/* Company Data Section */}
                        <h2
                            id="section-company-data"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Company Data
                        </h2>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Users</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves all users (employees) for the current company.
                                </p>
                                <button onClick={handleGetUsers} disabled={loading} className="btn btn--primary">
                                    Get Users
                                </button>
                                {manageUsers.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                            <strong>{manageUsers.length} user(s) found:</strong>
                                        </p>
                                        {manageUsers.map(user => (
                                            <div
                                                key={user._id || user.id}
                                                style={{
                                                    ...cardStyle,
                                                    cursor: "default"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <div>
                                                        <strong style={{ fontSize: "14px", color: "#333" }}>
                                                            {user.firstName} {user.lastName}
                                                        </strong>
                                                        {user.email && (
                                                            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>{user.email}</p>
                                                        )}
                                                        {user.phone && (
                                                            <p style={{ fontSize: "11px", color: "#999", margin: "2px 0 0 0" }}>
                                                                {typeof user.phone === "object" ? JSON.stringify(user.phone) : user.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {user.role && (
                                                        <span
                                                            style={{
                                                                backgroundColor: "#e3f2fd",
                                                                color: "#1976d2",
                                                                padding: "2px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            {user.role?.name || "No role"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>
                                                    ID: {user._id || user.id} | Type:{" "}
                                                    {typeof user.type === "object"
                                                        ? (user.type as { name?: string })?.name || JSON.stringify(user.type)
                                                        : user.type}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Roles</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves all roles defined for the current company.
                                </p>
                                <button onClick={handleGetRoles} disabled={loading} className="btn btn--primary">
                                    Get Roles
                                </button>
                                {manageRoles.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                            <strong>{manageRoles.length} role(s) found:</strong>
                                        </p>
                                        {manageRoles.map(role => (
                                            <div
                                                key={role._id || role.id}
                                                style={{
                                                    ...cardStyle,
                                                    cursor: "default"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <strong style={{ fontSize: "14px", color: "#333" }}>{role.name}</strong>
                                                    {role.permissions && (
                                                        <span
                                                            style={{
                                                                backgroundColor: "#f5f5f5",
                                                                color: "#666",
                                                                padding: "2px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            {role.permissions.length} permissions
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>ID: {role._id || role.id}</div>
                                                {role.permissions && role.permissions.length > 0 && (
                                                    <div
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#666",
                                                            marginTop: "8px",
                                                            maxHeight: "60px",
                                                            overflow: "auto"
                                                        }}
                                                    >
                                                        Permissions:{" "}
                                                        {role.permissions
                                                            .filter((p: any) => p.value)
                                                            .map((p: any) => p.name)
                                                            .join(", ") || "None enabled"}
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
                                <h3>Get Customers</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves customers for the current company with pagination.
                                </p>

                                {/* Pagination Controls */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "16px",
                                        marginBottom: "16px",
                                        padding: "12px",
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "4px",
                                        alignItems: "center",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 500 }}>Limit:</label>
                                        <select
                                            value={customersLimit}
                                            onChange={e => setCustomersLimit(Number(e.target.value))}
                                            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd" }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 500 }}>Filter:</label>
                                        <input
                                            type="text"
                                            value={customersFilter}
                                            onChange={e => setCustomersFilter(e.target.value)}
                                            placeholder="Search name, email..."
                                            style={{
                                                width: "160px",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                                fontSize: "12px"
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setCustomersOffset(0);
                                        handleGetCustomers(0);
                                    }}
                                    disabled={loading}
                                    className="btn btn--primary"
                                >
                                    Get Customers
                                </button>
                                {manageCustomers.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                                                <strong>{manageCustomers.length} customer(s) shown</strong> (offset: {customersOffset}, limit:{" "}
                                                {customersLimit}){customersCount > 0 && <span> of {customersCount} total</span>}
                                            </p>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => {
                                                        const newOffset = Math.max(0, customersOffset - customersLimit);
                                                        setCustomersOffset(newOffset);
                                                        handleGetCustomers(newOffset);
                                                    }}
                                                    disabled={loading || customersOffset === 0}
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        backgroundColor: customersOffset === 0 ? "#e0e0e0" : "#1976d2",
                                                        color: customersOffset === 0 ? "#999" : "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: customersOffset === 0 ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    ← Prev
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newOffset = customersOffset + customersLimit;
                                                        setCustomersOffset(newOffset);
                                                        handleGetCustomers(newOffset);
                                                    }}
                                                    disabled={
                                                        loading ||
                                                        manageCustomers.length < customersLimit ||
                                                        (customersCount > 0 && customersOffset + customersLimit >= customersCount)
                                                    }
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            manageCustomers.length < customersLimit ||
                                                            (customersCount > 0 && customersOffset + customersLimit >= customersCount)
                                                                ? "#e0e0e0"
                                                                : "#1976d2",
                                                        color:
                                                            manageCustomers.length < customersLimit ||
                                                            (customersCount > 0 && customersOffset + customersLimit >= customersCount)
                                                                ? "#999"
                                                                : "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor:
                                                            manageCustomers.length < customersLimit ||
                                                            (customersCount > 0 && customersOffset + customersLimit >= customersCount)
                                                                ? "not-allowed"
                                                                : "pointer"
                                                    }}
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </div>
                                        {manageCustomers.map(customer => (
                                            <div
                                                key={customer._id}
                                                style={{
                                                    ...cardStyle,
                                                    cursor: "default"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <div>
                                                        <strong style={{ fontSize: "14px", color: "#333" }}>
                                                            {customer.firstName} {customer.lastName}
                                                        </strong>
                                                        {customer.email && (
                                                            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>{customer.email}</p>
                                                        )}
                                                        {customer.phone && (
                                                            <p style={{ fontSize: "11px", color: "#999", margin: "2px 0 0 0" }}>{customer.phone}</p>
                                                        )}
                                                    </div>
                                                    {customer.tags && customer.tags.length > 0 && (
                                                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                                            {customer.tags.slice(0, 3).map((tag: string) => (
                                                                <span
                                                                    key={tag}
                                                                    style={{
                                                                        backgroundColor: "#e8f5e9",
                                                                        color: "#2e7d32",
                                                                        padding: "2px 6px",
                                                                        borderRadius: "4px",
                                                                        fontSize: "10px"
                                                                    }}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>ID: {customer._id}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Products Section */}
                        <h2
                            id="section-products"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Products
                        </h2>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Products</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves products with their variants for the current company. Paginated.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        padding: "12px",
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "4px",
                                        alignItems: "flex-end",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Status:</label>
                                        <select
                                            value={productsStatusFilter}
                                            onChange={e => setProductsStatusFilter(e.target.value as "all" | "active" | "inactive")}
                                            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "12px" }}
                                        >
                                            <option value="all">All</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Category ID:</label>
                                        <input
                                            value={productsCategoryFilter}
                                            onChange={e => setProductsCategoryFilter(e.target.value)}
                                            placeholder="Category ID..."
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                                fontSize: "12px",
                                                width: "160px"
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Limit:</label>
                                        <select
                                            value={productsLimit}
                                            onChange={e => setProductsLimit(Number(e.target.value))}
                                            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "12px" }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Offset:</label>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <input
                                                type="number"
                                                value={productsOffset}
                                                onChange={e => setProductsOffset(Math.max(0, Number(e.target.value)))}
                                                min={0}
                                                style={{
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ddd",
                                                    fontSize: "12px",
                                                    width: "80px"
                                                }}
                                            />
                                            <button
                                                onClick={() => handleGetProducts(productsOffset)}
                                                disabled={loading}
                                                style={{
                                                    padding: "4px 10px",
                                                    fontSize: "11px",
                                                    backgroundColor: "#1976d2",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Go
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setProductsOffset(0);
                                        handleGetProducts(0);
                                    }}
                                    disabled={loading}
                                    className="btn btn--primary"
                                >
                                    Get Products
                                </button>
                                {products.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                                                <strong>{products.length} product(s) shown</strong> (offset: {productsOffset}, limit: {productsLimit})
                                            </p>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => {
                                                        const newOffset = Math.max(0, productsOffset - productsLimit);
                                                        setProductsOffset(newOffset);
                                                        handleGetProducts(newOffset);
                                                    }}
                                                    disabled={loading || productsOffset === 0}
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        backgroundColor: productsOffset === 0 ? "#e0e0e0" : "#1976d2",
                                                        color: productsOffset === 0 ? "#999" : "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: productsOffset === 0 ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    ← Prev
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newOffset = productsOffset + productsLimit;
                                                        setProductsOffset(newOffset);
                                                        handleGetProducts(newOffset);
                                                    }}
                                                    disabled={loading || products.length < productsLimit}
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        backgroundColor: products.length < productsLimit ? "#e0e0e0" : "#1976d2",
                                                        color: products.length < productsLimit ? "#999" : "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: products.length < productsLimit ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </div>
                                        {products.map(product => (
                                            <div
                                                key={product._id}
                                                style={{
                                                    ...cardStyle,
                                                    cursor: "pointer",
                                                    border: expandedProductId === product._id ? "2px solid #1976d2" : "1px solid #ddd",
                                                    backgroundColor: expandedProductId === product._id ? "#fafafa" : "#fff"
                                                }}
                                                onClick={() => setExpandedProductId(expandedProductId === product._id ? null : product._id)}
                                            >
                                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                objectFit: "cover",
                                                                borderRadius: "6px",
                                                                flexShrink: 0
                                                            }}
                                                            onError={e => {
                                                                (e.target as HTMLImageElement).style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                backgroundColor: "#f0f0f0",
                                                                borderRadius: "6px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#ccc",
                                                                fontSize: "20px",
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            ?
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                            <div>
                                                                <strong style={{ fontSize: "14px", color: "#333" }}>{product.name}</strong>
                                                                {product.sku && (
                                                                    <span style={{ fontSize: "11px", color: "#999", marginLeft: "8px" }}>
                                                                        SKU: {product.sku}
                                                                    </span>
                                                                )}
                                                                <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
                                                                    {product.minPrice && product.maxPrice
                                                                        ? product.minPrice === product.maxPrice
                                                                            ? `$${product.minPrice}`
                                                                            : `$${product.minPrice} - $${product.maxPrice}`
                                                                        : "No price"}
                                                                </p>
                                                            </div>
                                                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                                <span
                                                                    style={{
                                                                        backgroundColor: product.status === "active" ? "#e8f5e9" : "#fff3e0",
                                                                        color: product.status === "active" ? "#2e7d32" : "#e65100",
                                                                        padding: "2px 8px",
                                                                        borderRadius: "4px",
                                                                        fontSize: "11px"
                                                                    }}
                                                                >
                                                                    {product.status || "N/A"}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        backgroundColor: "#f3e5f5",
                                                                        color: "#7b1fa2",
                                                                        padding: "2px 8px",
                                                                        borderRadius: "4px",
                                                                        fontSize: "11px"
                                                                    }}
                                                                >
                                                                    {product.productType}
                                                                </span>
                                                                <span style={{ fontSize: "11px", color: "#999" }}>
                                                                    {product.variants?.length || 0} variant(s)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                marginTop: "6px"
                                                            }}
                                                        >
                                                            <span style={{ fontSize: "11px", color: "#999" }}>ID: {product._id}</span>
                                                            <div style={{ display: "flex", gap: "6px" }}>
                                                                {!product.externalId && (
                                                                    <>
                                                                        <button
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                setEditingProductId(
                                                                                    editingProductId === product._id ? null : product._id
                                                                                );
                                                                                setEditProductName(product.name);
                                                                                setEditProductDescription(product.description || "");
                                                                                setEditProductStatus(product.status || "active");
                                                                            }}
                                                                            style={{
                                                                                fontSize: "11px",
                                                                                color: "#1976d2",
                                                                                background: "none",
                                                                                border: "1px solid #1976d2",
                                                                                borderRadius: "4px",
                                                                                cursor: "pointer",
                                                                                padding: "2px 8px"
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                handleDeleteProduct(product._id);
                                                                            }}
                                                                            style={{
                                                                                fontSize: "11px",
                                                                                color: "#c62828",
                                                                                background: "none",
                                                                                border: "1px solid #c62828",
                                                                                borderRadius: "4px",
                                                                                cursor: "pointer",
                                                                                padding: "2px 8px"
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {editingProductId === product._id && (
                                                    <div
                                                        style={{
                                                            marginTop: "8px",
                                                            padding: "12px",
                                                            backgroundColor: "#f5f5f5",
                                                            borderRadius: "6px",
                                                            border: "1px solid #ddd"
                                                        }}
                                                    >
                                                        <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>Edit Product</p>
                                                        <input
                                                            value={editProductName}
                                                            onChange={e => setEditProductName(e.target.value)}
                                                            placeholder="Name"
                                                            style={{ width: "100%", padding: "6px", marginBottom: "6px", fontSize: "12px" }}
                                                        />
                                                        <input
                                                            value={editProductDescription}
                                                            onChange={e => setEditProductDescription(e.target.value)}
                                                            placeholder="Description"
                                                            style={{ width: "100%", padding: "6px", marginBottom: "6px", fontSize: "12px" }}
                                                        />
                                                        <select
                                                            value={editProductStatus}
                                                            onChange={e => setEditProductStatus(e.target.value as "active" | "inactive")}
                                                            style={{ padding: "6px", marginBottom: "8px", fontSize: "12px" }}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                        <div style={{ display: "flex", gap: "6px" }}>
                                                            <button
                                                                onClick={() => handleEditProduct(product._id)}
                                                                disabled={loading}
                                                                style={{
                                                                    fontSize: "11px",
                                                                    padding: "4px 12px",
                                                                    backgroundColor: "#1976d2",
                                                                    color: "#fff",
                                                                    border: "none",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingProductId(null)}
                                                                style={{
                                                                    fontSize: "11px",
                                                                    padding: "4px 12px",
                                                                    backgroundColor: "#eee",
                                                                    border: "none",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {expandedProductId === product._id && product.variants && product.variants.length > 0 && (
                                                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                                                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>
                                                            Variants ({product.variants.length}):
                                                        </p>
                                                        {product.variants.map((variant: any, idx: number) => (
                                                            <div
                                                                key={variant._id || idx}
                                                                style={{
                                                                    padding: "8px 12px",
                                                                    marginBottom: "6px",
                                                                    backgroundColor: "#f8f9fa",
                                                                    borderRadius: "6px",
                                                                    border: "1px solid #eee",
                                                                    fontSize: "12px"
                                                                }}
                                                            >
                                                                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                                                    {variant.images && variant.images.length > 0 ? (
                                                                        <img
                                                                            src={variant.images[0]}
                                                                            alt={`Variant ${variant.sku || idx}`}
                                                                            style={{
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "4px",
                                                                                flexShrink: 0
                                                                            }}
                                                                            onError={e => {
                                                                                (e.target as HTMLImageElement).style.display = "none";
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                backgroundColor: "#e8e8e8",
                                                                                borderRadius: "4px",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                color: "#ccc",
                                                                                fontSize: "12px",
                                                                                flexShrink: 0
                                                                            }}
                                                                        >
                                                                            ?
                                                                        </div>
                                                                    )}
                                                                    <div style={{ flex: 1 }}>
                                                                        <div
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "space-between",
                                                                                alignItems: "center"
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <strong>${variant.price}</strong>
                                                                                {variant.isOnSale && variant.salePrice !== "0" && (
                                                                                    <span style={{ color: "#c62828", marginLeft: "8px" }}>
                                                                                        Sale: ${variant.salePrice}
                                                                                    </span>
                                                                                )}
                                                                                {variant.sku && (
                                                                                    <span style={{ color: "#999", marginLeft: "8px" }}>
                                                                                        SKU: {variant.sku}
                                                                                    </span>
                                                                                )}
                                                                                {variant.barcode && (
                                                                                    <span style={{ color: "#999", marginLeft: "8px" }}>
                                                                                        Barcode: {variant.barcode}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {variant.manageStock && (
                                                                                <span
                                                                                    style={{
                                                                                        backgroundColor: "#e3f2fd",
                                                                                        color: "#1976d2",
                                                                                        padding: "1px 6px",
                                                                                        borderRadius: "3px",
                                                                                        fontSize: "10px"
                                                                                    }}
                                                                                >
                                                                                    Stock managed
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {variant.attributes && variant.attributes.length > 0 && (
                                                                            <div
                                                                                style={{
                                                                                    marginTop: "4px",
                                                                                    display: "flex",
                                                                                    gap: "6px",
                                                                                    flexWrap: "wrap"
                                                                                }}
                                                                            >
                                                                                {variant.attributes.map((attr: any, aIdx: number) => (
                                                                                    <span
                                                                                        key={aIdx}
                                                                                        style={{
                                                                                            backgroundColor: "#ede7f6",
                                                                                            color: "#4527a0",
                                                                                            padding: "1px 6px",
                                                                                            borderRadius: "3px",
                                                                                            fontSize: "10px"
                                                                                        }}
                                                                                    >
                                                                                        {attr.name}: {attr.value}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {variant.inventory && variant.inventory.length > 0 && (
                                                                            <div style={{ marginTop: "6px" }}>
                                                                                <button
                                                                                    onClick={e => {
                                                                                        e.stopPropagation();
                                                                                        setShowInventoryVariantId(
                                                                                            showInventoryVariantId === variant._id
                                                                                                ? null
                                                                                                : variant._id
                                                                                        );
                                                                                    }}
                                                                                    style={{
                                                                                        fontSize: "11px",
                                                                                        color: "#1976d2",
                                                                                        background: "none",
                                                                                        border: "none",
                                                                                        cursor: "pointer",
                                                                                        padding: 0,
                                                                                        textDecoration: "underline"
                                                                                    }}
                                                                                >
                                                                                    {showInventoryVariantId === variant._id
                                                                                        ? "Hide inventory"
                                                                                        : `Show inventory (${variant.inventory.length} outlet(s))`}
                                                                                </button>
                                                                                {showInventoryVariantId === variant._id && (
                                                                                    <table
                                                                                        style={{
                                                                                            marginTop: "6px",
                                                                                            width: "100%",
                                                                                            fontSize: "11px",
                                                                                            borderCollapse: "collapse"
                                                                                        }}
                                                                                    >
                                                                                        <thead>
                                                                                            <tr
                                                                                                style={{
                                                                                                    borderBottom: "1px solid #ddd",
                                                                                                    textAlign: "left"
                                                                                                }}
                                                                                            >
                                                                                                <th style={{ padding: "4px 8px" }}>Outlet ID</th>
                                                                                                <th style={{ padding: "4px 8px" }}>Stock</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {variant.inventory.map((inv: any, i: number) => (
                                                                                                <tr
                                                                                                    key={i}
                                                                                                    style={{ borderBottom: "1px solid #f0f0f0" }}
                                                                                                >
                                                                                                    <td
                                                                                                        style={{
                                                                                                            padding: "4px 8px",
                                                                                                            fontFamily: "monospace"
                                                                                                        }}
                                                                                                    >
                                                                                                        {inv.outletId}
                                                                                                    </td>
                                                                                                    <td style={{ padding: "4px 8px" }}>
                                                                                                        {inv.stock}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        <div style={{ fontSize: "10px", color: "#bbb", marginTop: "4px" }}>
                                                                            ID: {variant._id}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {expandedProductId === product._id && (!product.variants || product.variants.length === 0) && (
                                                    <p style={{ fontSize: "12px", color: "#999", marginTop: "12px", fontStyle: "italic" }}>
                                                        No variants for this product.
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {productsFetched && products.length === 0 && (
                                    <p
                                        style={{
                                            marginTop: "16px",
                                            padding: "24px",
                                            textAlign: "center",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "8px",
                                            color: "#999",
                                            fontSize: "13px"
                                        }}
                                    >
                                        No products found for this company.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Categories Section */}
                        <h2
                            id="section-categories"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Categories
                        </h2>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Categories</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves all product categories for the current company.
                                </p>
                                <button onClick={handleGetCategories} disabled={loading} className="btn btn--primary">
                                    Get Categories
                                </button>
                                {categories.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                            <strong>{categories.length} category(ies) found:</strong>
                                        </p>
                                        {categories.map(cat => (
                                            <div
                                                key={cat._id}
                                                style={{
                                                    ...cardStyle,
                                                    cursor: "default"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <strong style={{ fontSize: "14px", color: "#333" }}>{cat.name}</strong>
                                                    {cat.parentId && (
                                                        <span
                                                            style={{
                                                                backgroundColor: "#f5f5f5",
                                                                color: "#666",
                                                                padding: "2px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            Parent: {cat.parentId}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#999", marginTop: "6px" }}>
                                                    ID: {cat._id}
                                                    {cat.externalId && <span> | External: {cat.externalId}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Outlets Section */}
                        <h2
                            id="section-outlets"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Outlets
                        </h2>
                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Outlets</h3>
                            </div>
                            <div className="command-section__content">
                                <button onClick={handleGetOutlets} disabled={loading} className="btn btn--primary">
                                    Get Outlets
                                </button>
                                {outlets.length > 0 && (
                                    <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                                        {outlets.map((outlet: any) => (
                                            <div
                                                key={outlet._id}
                                                style={{
                                                    padding: "12px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "8px",
                                                    backgroundColor: "#fff"
                                                }}
                                            >
                                                <strong style={{ fontSize: "14px" }}>{outlet.name || "Unnamed Outlet"}</strong>
                                                {outlet.address && (
                                                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>
                                                        {typeof outlet.address === "string" ? outlet.address : outlet.address.address1}
                                                    </p>
                                                )}
                                                <p style={{ fontSize: "11px", color: "#999", margin: "4px 0 0" }}>
                                                    {[outlet.city, outlet.state, outlet.country].filter(Boolean).join(", ")}
                                                </p>
                                                <p style={{ fontSize: "10px", color: "#bbb", margin: "4px 0 0" }}>ID: {outlet._id}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {outletsFetched && outlets.length === 0 && (
                                    <p style={{ marginTop: "12px", fontSize: "13px", color: "#999", fontStyle: "italic" }}>No outlets found.</p>
                                )}
                            </div>
                        </div>

                        {/* Stations Section */}
                        <h2
                            id="section-stations"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Stations
                        </h2>
                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Stations</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Select an outlet first to fetch its stations.{!outletsFetched && " Fetch outlets above."}
                                </p>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Outlet:</label>
                                        <select
                                            value={selectedOutletForStations}
                                            onChange={e => setSelectedOutletForStations(e.target.value)}
                                            disabled={outlets.length === 0}
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                                fontSize: "12px",
                                                minWidth: "180px"
                                            }}
                                        >
                                            <option value="">{outlets.length === 0 ? "No outlets loaded" : "Select an outlet..."}</option>
                                            {outlets.map((o: any) => (
                                                <option key={o._id} value={o._id}>
                                                    {o.name} ({o._id.slice(-6)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={handleGetStations} disabled={loading || !selectedOutletForStations} className="btn btn--primary">
                                        Get Stations
                                    </button>
                                </div>
                                {stations.length > 0 && (
                                    <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                                        {stations.map((station: any) => (
                                            <div
                                                key={station._id}
                                                style={{
                                                    padding: "12px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "8px",
                                                    backgroundColor: "#fff"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <strong style={{ fontSize: "14px" }}>{station.name}</strong>
                                                    <span
                                                        style={{
                                                            backgroundColor: station.status === "active" ? "#e8f5e9" : "#fff3e0",
                                                            color: station.status === "active" ? "#2e7d32" : "#e65100",
                                                            padding: "2px 8px",
                                                            borderRadius: "4px",
                                                            fontSize: "11px"
                                                        }}
                                                    >
                                                        {station.status}
                                                    </span>
                                                </div>
                                                {station.sequenceNumber != null && (
                                                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>
                                                        Seq: {station.sequenceNumber}
                                                    </p>
                                                )}
                                                <p style={{ fontSize: "10px", color: "#bbb", margin: "4px 0 0" }}>ID: {station._id}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {stationsFetched && stations.length === 0 && (
                                    <p style={{ marginTop: "12px", fontSize: "13px", color: "#999", fontStyle: "italic" }}>No stations found.</p>
                                )}
                            </div>
                        </div>

                        {/* Orders Section */}
                        <h2
                            id="section-orders"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Orders
                        </h2>
                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Orders</h3>
                            </div>
                            <div className="command-section__content">
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        padding: "12px",
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "4px",
                                        alignItems: "flex-end",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Search:</label>
                                        <input
                                            value={ordersSearch}
                                            onChange={e => setOrdersSearch(e.target.value)}
                                            placeholder="Order ID, receipt..."
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                                fontSize: "12px",
                                                width: "160px"
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Status:</label>
                                        <select
                                            value={ordersStatusFilter}
                                            onChange={e => setOrdersStatusFilter(e.target.value)}
                                            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "12px" }}
                                        >
                                            <option value="all">All</option>
                                            <option value="completed">Completed</option>
                                            <option value="refunded">Refunded</option>
                                            <option value="parked">Parked</option>
                                            <option value="voided">Voided</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Limit:</label>
                                        <select
                                            value={ordersLimit}
                                            onChange={e => setOrdersLimit(Number(e.target.value))}
                                            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "12px" }}
                                        >
                                            {[5, 10, 25, 50].map(n => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>Offset:</label>
                                        <input
                                            type="number"
                                            value={ordersOffset}
                                            onChange={e => setOrdersOffset(Math.max(0, Number(e.target.value)))}
                                            min={0}
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                                fontSize: "12px",
                                                width: "80px"
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setOrdersOffset(0);
                                        handleGetOrders(0);
                                    }}
                                    disabled={loading}
                                    className="btn btn--primary"
                                >
                                    Get Orders
                                </button>

                                {ordersFetched && (
                                    <p style={{ fontSize: "12px", color: "#666", margin: "8px 0" }}>
                                        <strong>{orders.length} order(s) shown</strong> (offset: {ordersOffset}, limit: {ordersLimit}, total:{" "}
                                        {ordersTotal})
                                    </p>
                                )}

                                {orders.length > 0 && (
                                    <div>
                                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                            <button
                                                onClick={() => {
                                                    const o = Math.max(0, ordersOffset - ordersLimit);
                                                    setOrdersOffset(o);
                                                    handleGetOrders(o);
                                                }}
                                                disabled={loading || ordersOffset === 0}
                                                style={{
                                                    padding: "4px 12px",
                                                    fontSize: "12px",
                                                    backgroundColor: ordersOffset === 0 ? "#e0e0e0" : "#1976d2",
                                                    color: ordersOffset === 0 ? "#999" : "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: ordersOffset === 0 ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                &larr; Prev
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const o = ordersOffset + ordersLimit;
                                                    setOrdersOffset(o);
                                                    handleGetOrders(o);
                                                }}
                                                disabled={loading || orders.length < ordersLimit}
                                                style={{
                                                    padding: "4px 12px",
                                                    fontSize: "12px",
                                                    backgroundColor: orders.length < ordersLimit ? "#e0e0e0" : "#1976d2",
                                                    color: orders.length < ordersLimit ? "#999" : "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: orders.length < ordersLimit ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                Next &rarr;
                                            </button>
                                        </div>
                                        <div style={{ display: "grid", gap: "8px" }}>
                                            {orders.map((order: any) => (
                                                <div
                                                    key={order._id}
                                                    style={{
                                                        padding: "12px",
                                                        border: expandedOrderId === order._id ? "2px solid #1976d2" : "1px solid #ddd",
                                                        borderRadius: "8px",
                                                        backgroundColor: expandedOrderId === order._id ? "#fafafa" : "#fff",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                                                >
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <strong style={{ fontSize: "14px" }}>
                                                            {order.receiptId ? `#${order.receiptId}` : order._id.slice(-6)}
                                                        </strong>
                                                        <span
                                                            style={{
                                                                backgroundColor:
                                                                    order.status === "completed"
                                                                        ? "#e8f5e9"
                                                                        : order.status === "refunded"
                                                                          ? "#fce4ec"
                                                                          : "#fff3e0",
                                                                color:
                                                                    order.status === "completed"
                                                                        ? "#2e7d32"
                                                                        : order.status === "refunded"
                                                                          ? "#c62828"
                                                                          : "#e65100",
                                                                padding: "2px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    {order.customer && (
                                                        <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>
                                                            Customer: {order.customer.firstName} {order.customer.lastName}
                                                        </p>
                                                    )}
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                                                        <span style={{ fontSize: "12px", color: "#666" }}>
                                                            {order.summary?.total ? `$${order.summary.total}` : ""}
                                                        </span>
                                                        <span style={{ fontSize: "11px", color: "#999" }}>
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: "10px", color: "#bbb", margin: "4px 0 0" }}>
                                                        {order.lineItems?.length || 0} item(s) | Source: {order.source || "N/A"}
                                                        {expandedOrderId !== order._id && (
                                                            <span style={{ marginLeft: "8px", color: "#1976d2" }}>(click to expand)</span>
                                                        )}
                                                    </p>

                                                    {expandedOrderId === order._id && (
                                                        <div style={{ marginTop: "12px", borderTop: "1px solid #eee", paddingTop: "12px" }}>
                                                            {order.lineItems && order.lineItems.length > 0 && (
                                                                <div style={{ marginBottom: "12px" }}>
                                                                    <strong style={{ fontSize: "12px" }}>Line Items:</strong>
                                                                    <table
                                                                        style={{
                                                                            width: "100%",
                                                                            fontSize: "11px",
                                                                            borderCollapse: "collapse",
                                                                            marginTop: "4px"
                                                                        }}
                                                                    >
                                                                        <thead>
                                                                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                                                                <th
                                                                                    style={{
                                                                                        padding: "4px 6px",
                                                                                        textAlign: "left",
                                                                                        borderBottom: "1px solid #ddd"
                                                                                    }}
                                                                                >
                                                                                    Name
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        padding: "4px 6px",
                                                                                        textAlign: "right",
                                                                                        borderBottom: "1px solid #ddd"
                                                                                    }}
                                                                                >
                                                                                    Qty
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        padding: "4px 6px",
                                                                                        textAlign: "right",
                                                                                        borderBottom: "1px solid #ddd"
                                                                                    }}
                                                                                >
                                                                                    Price
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        padding: "4px 6px",
                                                                                        textAlign: "right",
                                                                                        borderBottom: "1px solid #ddd"
                                                                                    }}
                                                                                >
                                                                                    Total
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {order.lineItems.map((item: any, idx: number) => (
                                                                                <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                                                    <td style={{ padding: "4px 6px" }}>
                                                                                        {item.name || item.productName || "-"}
                                                                                    </td>
                                                                                    <td style={{ padding: "4px 6px", textAlign: "right" }}>
                                                                                        {item.quantity ?? "-"}
                                                                                    </td>
                                                                                    <td style={{ padding: "4px 6px", textAlign: "right" }}>
                                                                                        {item.price ?? "-"}
                                                                                    </td>
                                                                                    <td style={{ padding: "4px 6px", textAlign: "right" }}>
                                                                                        {item.total ?? item.subTotal ?? "-"}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                            {order.paymentMethods && order.paymentMethods.length > 0 && (
                                                                <div style={{ marginBottom: "8px" }}>
                                                                    <strong style={{ fontSize: "12px" }}>Payments:</strong>
                                                                    <span style={{ fontSize: "11px", marginLeft: "8px" }}>
                                                                        {order.paymentMethods
                                                                            .map(
                                                                                (pm: any) =>
                                                                                    `${pm.name || pm.type || "Unknown"}: $${pm.amount || "0"}`
                                                                            )
                                                                            .join(", ")}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {order.summary && (
                                                                <div style={{ marginBottom: "8px" }}>
                                                                    <strong style={{ fontSize: "12px" }}>Summary:</strong>
                                                                    <span style={{ fontSize: "11px", marginLeft: "8px" }}>
                                                                        Subtotal: ${order.summary.subTotal || "0"} | Tax: $
                                                                        {order.summary.totalTax || "0"} | Total: ${order.summary.total || "0"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {order.notes && (
                                                                <div style={{ marginBottom: "8px" }}>
                                                                    <strong style={{ fontSize: "12px" }}>Notes:</strong>
                                                                    <span style={{ fontSize: "11px", marginLeft: "8px" }}>{order.notes}</span>
                                                                </div>
                                                            )}
                                                            <details style={{ marginTop: "8px" }} onClick={e => e.stopPropagation()}>
                                                                <summary style={{ fontSize: "11px", color: "#1976d2", cursor: "pointer" }}>
                                                                    Full order JSON
                                                                </summary>
                                                                <JsonViewer data={order} />
                                                            </details>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {ordersFetched && orders.length === 0 && (
                                    <p style={{ marginTop: "12px", fontSize: "13px", color: "#999", fontStyle: "italic" }}>No orders found.</p>
                                )}
                            </div>
                        </div>

                        {/* Custom Tables Section */}
                        <h2
                            id="section-custom-tables"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Custom Tables
                        </h2>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Custom Tables for Extension</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves custom tables linked to a specific extension. The extension ID is auto-filled from context.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Extension ID:</label>
                                    <input
                                        type="text"
                                        value={extensionIdInput}
                                        onChange={e => setExtensionIdInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Get context first or enter extension ID"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
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
                                    <div style={{ marginTop: "16px" }}>
                                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                            <strong>{customTables.length} table(s) found.</strong> Click to select:
                                        </p>
                                        {customTables.map(table => (
                                            <div
                                                key={table._id}
                                                style={selectedTable?._id === table._id ? selectedCardStyle : cardStyle}
                                                onClick={() => handleSelectTable(table)}
                                                onMouseEnter={e => {
                                                    if (selectedTable?._id !== table._id) {
                                                        Object.assign(e.currentTarget.style, cardHoverStyle);
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (selectedTable?._id !== table._id) {
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <div>
                                                        <strong style={{ fontSize: "14px", color: "#333" }}>{table.name}</strong>
                                                        {table.description && (
                                                            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
                                                                {table.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {selectedTable?._id === table._id && (
                                                        <span
                                                            style={{
                                                                backgroundColor: "#1976d2",
                                                                color: "#fff",
                                                                padding: "2px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>ID: {table._id}</div>
                                                {table.metadata && table.metadata.length > 0 && (
                                                    <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                                                        Metadata: {table.metadata.map(m => `${m.key}=${m.val}`).join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {customTables.length === 0 && extensionIdInput && (
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            marginTop: "12px",
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px"
                                        }}
                                    >
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
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves data (rows) from a custom table. You can query by table ID or by table name.
                                </p>

                                {/* Pagination Controls */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "16px",
                                        marginBottom: "16px",
                                        padding: "12px",
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "4px",
                                        alignItems: "center",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 500 }}>Limit:</label>
                                        <select
                                            value={paginationLimit}
                                            onChange={e => setPaginationLimit(Number(e.target.value))}
                                            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd" }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 500 }}>Offset:</label>
                                        <input
                                            type="number"
                                            value={paginationOffset}
                                            onChange={e => setPaginationOffset(Number(e.target.value))}
                                            min={0}
                                            style={{ width: "80px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd" }}
                                        />
                                    </div>
                                    {totalCount !== null && <span style={{ fontSize: "12px", color: "#666" }}>Total: {totalCount} rows</span>}
                                </div>

                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Table ID:</label>
                                    <input
                                        type="text"
                                        value={tableIdInput}
                                        onChange={e => setTableIdInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Select a table above or enter ID"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <button
                                    onClick={() => handleGetCustomTableDataById()}
                                    disabled={loading || !tableIdInput}
                                    className="btn btn--primary"
                                    style={{ marginRight: "8px" }}
                                >
                                    Get by Table ID
                                </button>

                                <div className="form-group" style={{ marginTop: "16px", marginBottom: "12px" }}>
                                    <label className="form-label">Table Name:</label>
                                    <input
                                        type="text"
                                        value={tableNameInput}
                                        onChange={e => setTableNameInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Select a table above or enter name"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
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
                                    <div style={{ marginTop: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                                                <strong>{customTableData.length} row(s) shown</strong> (offset: {paginationOffset}, limit:{" "}
                                                {paginationLimit}){totalCount !== null && <span> of {totalCount} total</span>}
                                            </p>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => {
                                                        const newOffset = Math.max(0, paginationOffset - paginationLimit);
                                                        setPaginationOffset(newOffset);
                                                        if (tableNameInput) handleGetCustomTableDataByName(newOffset);
                                                        else if (tableIdInput) handleGetCustomTableDataById(newOffset);
                                                    }}
                                                    disabled={loading || paginationOffset === 0}
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        backgroundColor: paginationOffset === 0 ? "#e0e0e0" : "#1976d2",
                                                        color: paginationOffset === 0 ? "#999" : "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: paginationOffset === 0 ? "not-allowed" : "pointer"
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
                                                    disabled={
                                                        loading ||
                                                        customTableData.length < paginationLimit ||
                                                        (totalCount !== null && paginationOffset + paginationLimit >= totalCount)
                                                    }
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            customTableData.length < paginationLimit ||
                                                            (totalCount !== null && paginationOffset + paginationLimit >= totalCount)
                                                                ? "#e0e0e0"
                                                                : "#1976d2",
                                                        color:
                                                            customTableData.length < paginationLimit ||
                                                            (totalCount !== null && paginationOffset + paginationLimit >= totalCount)
                                                                ? "#999"
                                                                : "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor:
                                                            customTableData.length < paginationLimit ||
                                                            (totalCount !== null && paginationOffset + paginationLimit >= totalCount)
                                                                ? "not-allowed"
                                                                : "pointer"
                                                    }}
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: "11px", color: "#999", marginBottom: "8px" }}>Click to select:</p>
                                        {customTableData.map((row, index) => (
                                            <div
                                                key={row._id || index}
                                                style={selectedRow?._id === row._id ? selectedCardStyle : cardStyle}
                                                onClick={() => handleSelectRow(row)}
                                                onMouseEnter={e => {
                                                    if (selectedRow?._id !== row._id) {
                                                        Object.assign(e.currentTarget.style, cardHoverStyle);
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (selectedRow?._id !== row._id) {
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <strong style={{ fontSize: "13px", color: "#333" }}>Row {index + 1}</strong>
                                                    {selectedRow?._id === row._id && (
                                                        <span
                                                            style={{
                                                                backgroundColor: "#1976d2",
                                                                color: "#fff",
                                                                padding: "2px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                                <pre
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "#666",
                                                        margin: "8px 0 0 0",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-all",
                                                        maxHeight: "100px",
                                                        overflow: "auto"
                                                    }}
                                                >
                                                    {JSON.stringify(row, null, 2)}
                                                </pre>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {customTableData.length === 0 && (tableNameInput || tableIdInput) && (
                                    <p style={{ fontSize: "12px", color: "#999", marginTop: "12px" }}>
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
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Create a new row in a custom table. The backend validates that all field names exist in the table schema and that
                                    value types match. Uses a transaction for atomicity.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Table Name:</label>
                                    <input
                                        type="text"
                                        value={tableNameInput}
                                        onChange={e => setTableNameInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Select a table above or enter name"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Data (JSON - do NOT include _id):</label>
                                    <textarea
                                        value={createJson}
                                        onChange={e => setCreateJson(e.target.value)}
                                        className="form-input"
                                        placeholder='{"fieldName": "value", ...}'
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            marginTop: "4px",
                                            minHeight: "120px",
                                            fontFamily: "monospace",
                                            fontSize: "12px"
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleCreateDocument}
                                    disabled={loading || !tableNameInput}
                                    className="btn btn--primary"
                                    style={{ backgroundColor: "#2e7d32" }}
                                >
                                    Create Document
                                </button>
                                {createError && (
                                    <div
                                        style={{
                                            marginTop: "12px",
                                            padding: "12px",
                                            backgroundColor: "#ffebee",
                                            color: "#c62828",
                                            borderRadius: "4px",
                                            border: "1px solid #ef9a9a",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <strong>❌ Create Error:</strong>
                                        <pre
                                            style={{
                                                margin: "8px 0 0 0",
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-all",
                                                fontSize: "12px",
                                                fontFamily: "monospace"
                                            }}
                                        >
                                            {createError}
                                        </pre>
                                    </div>
                                )}
                                {createResult && (
                                    <div style={{ marginTop: "12px" }}>
                                        <div
                                            style={{
                                                padding: "8px 12px",
                                                backgroundColor: "#e8f5e9",
                                                color: "#2e7d32",
                                                borderRadius: "4px",
                                                marginBottom: "8px",
                                                fontSize: "13px"
                                            }}
                                        >
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
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Update an existing row. The JSON <strong>must include the _id</strong> field. Select a row above to pre-populate.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Table Name:</label>
                                    <input
                                        type="text"
                                        value={tableNameInput}
                                        onChange={e => setTableNameInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Select a table above or enter name"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Data (JSON - must include _id):</label>
                                    <textarea
                                        value={upsertJson}
                                        onChange={e => setUpsertJson(e.target.value)}
                                        className="form-input"
                                        placeholder='{"_id": "...", "fieldName": "value", ...}'
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            marginTop: "4px",
                                            minHeight: "120px",
                                            fontFamily: "monospace",
                                            fontSize: "12px"
                                        }}
                                    />
                                    <p style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                                        Tip: Select a row above to pre-populate this field for editing
                                    </p>
                                </div>
                                <button
                                    onClick={handleUpsertCustomTableData}
                                    disabled={loading || !tableNameInput}
                                    className="btn btn--primary"
                                    style={{ backgroundColor: "#1976d2" }}
                                >
                                    Update Document
                                </button>
                                {upsertError && (
                                    <div
                                        style={{
                                            marginTop: "12px",
                                            padding: "12px",
                                            backgroundColor: "#ffebee",
                                            color: "#c62828",
                                            borderRadius: "4px",
                                            border: "1px solid #ef9a9a",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <strong>❌ Update Error:</strong>
                                        <pre
                                            style={{
                                                margin: "8px 0 0 0",
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-all",
                                                fontSize: "12px",
                                                fontFamily: "monospace"
                                            }}
                                        >
                                            {upsertError}
                                        </pre>
                                    </div>
                                )}
                                {upsertResult && (
                                    <div style={{ marginTop: "12px" }}>
                                        <div
                                            style={{
                                                padding: "8px 12px",
                                                backgroundColor: "#e8f5e9",
                                                color: "#2e7d32",
                                                borderRadius: "4px",
                                                marginBottom: "8px",
                                                fontSize: "13px"
                                            }}
                                        >
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
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Delete a row from a custom table. Select a row above to auto-fill the ID.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Table Name:</label>
                                    <input
                                        type="text"
                                        value={tableNameInput}
                                        onChange={e => setTableNameInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter Table Name"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Row ID:</label>
                                    <input
                                        type="text"
                                        value={deleteRowId}
                                        onChange={e => setDeleteRowId(e.target.value)}
                                        className="form-input"
                                        placeholder="Select a row above or enter ID"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <button
                                    onClick={handleDeleteCustomTableData}
                                    disabled={loading || !tableNameInput || !deleteRowId}
                                    className="btn btn--primary"
                                    style={{ backgroundColor: "#c62828" }}
                                >
                                    Delete Row
                                </button>
                                {deleteResult && <JsonViewer data={deleteResult} title="Delete Result" />}
                            </div>
                        </div>

                        {/* Custom Extensions Section */}
                        <h2
                            id="section-extensions"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Custom Extensions
                        </h2>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Custom Extensions</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves all custom extensions available for the organization.
                                </p>
                                <button onClick={handleGetCustomExtensions} disabled={loading} className="btn btn--primary">
                                    Get Custom Extensions
                                </button>
                                {customExtensions.length > 0 &&
                                    customExtensions.map(ext => <JsonViewer key={ext._id} data={ext} title={ext.label} />)}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Current Company Custom Extensions</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves custom extensions installed for the current company. Uses aggregation to lookup extension details.
                                </p>
                                <button onClick={handleGetCurrentCompanyCustomExtensions} disabled={loading} className="btn btn--primary">
                                    Get Current Company Extensions
                                </button>
                                {currentCompanyExtensions.length > 0 &&
                                    currentCompanyExtensions.map(ext => <JsonViewer key={ext._id} data={ext} title={ext.label} />)}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Custom Extension Custom Tables</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Retrieves custom tables linked to a specific extension by ID.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Extension ID:</label>
                                    <input
                                        type="text"
                                        value={extensionIdInput}
                                        onChange={e => setExtensionIdInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter Extension ID"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <button
                                    onClick={handleGetCustomExtensionCustomTables}
                                    disabled={loading || !extensionIdInput}
                                    className="btn btn--primary"
                                >
                                    Get Extension Custom Tables
                                </button>
                                {extensionCustomTables.length > 0 &&
                                    extensionCustomTables.map(table => <JsonViewer key={table._id} data={table} title={table.name} />)}
                            </div>
                        </div>

                        {/* Secrets Section */}
                        <h2
                            id="section-secrets"
                            style={{ marginTop: "32px", marginBottom: "16px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
                        >
                            Secrets
                        </h2>
                        {secretError && (
                            <div style={{ marginBottom: "16px", padding: "10px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px" }}>
                                <strong>Error:</strong> {secretError}
                            </div>
                        )}

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Secrets Keys</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    List secret keys for the company, or for a specific extension. Leave extension ID empty for company-level keys.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Extension ID (optional):</label>
                                    <input
                                        type="text"
                                        value={secretExtensionIdInput}
                                        onChange={e => setSecretExtensionIdInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Leave empty for company-level"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <button onClick={handleGetSecretsKeys} disabled={loading} className="btn btn--primary">
                                    Get Secrets Keys
                                </button>
                                {secretKeys.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                            <strong>{secretKeys.length} key(s):</strong> {secretKeys.join(", ") || "(none)"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Get Secret Value</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Retrieve a secret value by key.</p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Key:</label>
                                    <input
                                        type="text"
                                        value={secretKeyInput}
                                        onChange={e => setSecretKeyInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Secret key name"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Extension ID (optional):</label>
                                    <input
                                        type="text"
                                        value={secretExtensionIdInput}
                                        onChange={e => setSecretExtensionIdInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Leave empty for company-level"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <button onClick={handleGetSecretVal} disabled={loading || !secretKeyInput} className="btn btn--primary">
                                    Get Secret Value
                                </button>
                                {secretGetResult && (
                                    <div style={{ marginTop: "16px" }}>
                                        <JsonViewer data={JSON.stringify(secretGetResult, null, 2)} title="Result" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="command-section">
                            <div className="command-section__header">
                                <h3>Set Secret Value</h3>
                            </div>
                            <div className="command-section__content">
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Create or update a secret. Uses extension ID from above if set.
                                </p>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Key:</label>
                                    <input
                                        type="text"
                                        value={secretKeyInput}
                                        onChange={e => setSecretKeyInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Secret key name"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Value:</label>
                                    <input
                                        type="text"
                                        value={secretValueInput}
                                        onChange={e => setSecretValueInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Secret value"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "12px" }}>
                                    <label className="form-label">Extension ID (optional):</label>
                                    <input
                                        type="text"
                                        value={secretExtensionIdInput}
                                        onChange={e => setSecretExtensionIdInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Leave empty for company-level"
                                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                                    />
                                </div>
                                <button onClick={handleSetSecretVal} disabled={loading || !secretKeyInput} className="btn btn--primary">
                                    Set Secret
                                </button>
                                {secretSetResult === true && (
                                    <div
                                        style={{
                                            marginTop: "12px",
                                            padding: "8px 12px",
                                            backgroundColor: "#e8f5e9",
                                            color: "#2e7d32",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Secret saved successfully.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
