import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import type { AddCustomerParams } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface CustomersSectionProps {
    isInIframe: boolean;
}

interface CustomerListItem {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export function CustomersSection({ isInIframe }: CustomersSectionProps) {
    const [customers, setCustomers] = useState<CustomerListItem[]>([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [customersError, setCustomersError] = useState<string>("");
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(100);
    const [total, setTotal] = useState<number | undefined>(undefined);

    const [assignCustomerId, setAssignCustomerId] = useState<string>("");
    const [assignCustomerLoading, setAssignCustomerLoading] = useState(false);
    const [assignCustomerResponse, setAssignCustomerResponse] = useState<string>("");

    const [newCustomer, setNewCustomer] = useState<AddCustomerParams["customer"]>({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        companyId: "", // Will be set from context if available
        billing: null,
        shipping: null
    });
    const [addCustomerLoading, setAddCustomerLoading] = useState(false);
    const [addCustomerResponse, setAddCustomerResponse] = useState<string>("");

    // Customer Note
    const [customerNoteId, setCustomerNoteId] = useState<string>("");
    const [customerNote, setCustomerNote] = useState<string>("");
    const [addCustomerNoteLoading, setAddCustomerNoteLoading] = useState(false);
    const [addCustomerNoteResponse, setAddCustomerNoteResponse] = useState<string>("");

    // Remove Customer Note
    const [removeCustomerNoteId, setRemoveCustomerNoteId] = useState<string>("");
    const [removeCustomerNoteLoading, setRemoveCustomerNoteLoading] = useState(false);
    const [removeCustomerNoteResponse, setRemoveCustomerNoteResponse] = useState<string>("");

    const [activeCustomerId, setActiveCustomerId] = useState<string>("");
    const [setActiveCustomerLoading, setSetActiveCustomerLoading] = useState(false);
    const [setActiveCustomerResponse, setSetActiveCustomerResponse] = useState<string>("");
    const [getActiveCustomerLoading, setGetActiveCustomerLoading] = useState(false);
    const [getActiveCustomerResponse, setGetActiveCustomerResponse] = useState<string>("");

    // Remove Customer from Cart
    const [removeCustomerLoading, setRemoveCustomerLoading] = useState(false);
    const [removeCustomerResponse, setRemoveCustomerResponse] = useState<string>("");

    const handleGetCustomers = async () => {
        // if (!isInIframe) {
        //   setCustomersError('Error: Not running in iframe');
        //   return;
        // }

        setCustomersLoading(true);
        setCustomers([]);
        setCustomersError("");

        try {
            const result = await command.getCustomers({
                offset: offset,
                limit: limit
            });

            if (result && typeof result === "object") {
                if (result.customers && Array.isArray(result.customers)) {
                    setCustomers(result.customers);
                    setTotal(result.total);
                } else {
                    setCustomersError(`Invalid response format. Expected customers array, got: ${JSON.stringify(result).substring(0, 100)}`);
                }
            } else {
                setCustomersError("Invalid response format: result is not an object");
            }
        } catch (error) {
            setCustomersError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setCustomersLoading(false);
        }
    };

    const handleAssignCustomer = async () => {
        // if (!isInIframe) {
        //   setAssignCustomerResponse('Error: Not running in iframe');
        //   return;
        // }

        if (!assignCustomerId) {
            setAssignCustomerResponse("Error: Please enter a customer ID");
            return;
        }

        setAssignCustomerLoading(true);
        setAssignCustomerResponse("");

        try {
            const result = await command.assignCustomer({
                customerId: assignCustomerId
            });

            setAssignCustomerResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setAssignCustomerResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setAssignCustomerLoading(false);
        }
    };

    const handleAddCustomer = async () => {
        // if (!isInIframe) {
        //   setAddCustomerResponse('Error: Not running in iframe');
        //   return;
        // }

        setAddCustomerLoading(true);
        setAddCustomerResponse("");

        try {
            // Get companyId from context if not already set
            const customerData = { ...newCustomer };
            if (!customerData.companyId) {
                try {
                    const context = await command.getContext();
                    if (context?.company) {
                        const company = context.company as Record<string, unknown>;
                        if (typeof company._id === "string") {
                            customerData.companyId = company._id;
                        } else {
                            throw new Error("Company ID is not a string");
                        }
                    }
                } catch (error) {
                    // If context fetch fails, continue without companyId
                    console.warn("Could not fetch context for companyId:", error);
                }
            }

            const result = await command.addCustomer({
                customer: customerData
            });

            setAddCustomerResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setAddCustomerResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setAddCustomerLoading(false);
        }
    };

    return (
        <div className="section-content">
            <CommandSection title="Get Customers">
                <div className="form-group">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Offset:</label>
                            <input
                                type="number"
                                value={offset}
                                onChange={e => setOffset(parseInt(e.target.value) || 0)}
                                className="form-input"
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Limit:</label>
                            <input
                                type="number"
                                value={limit}
                                onChange={e => setLimit(parseInt(e.target.value) || 100)}
                                className="form-input"
                                min="1"
                            />
                        </div>
                    </div>
                </div>
                <button onClick={handleGetCustomers} disabled={customersLoading} className="btn btn--primary">
                    {customersLoading ? "Loading..." : "Get Customers"}
                </button>

                {customersError && <JsonViewer data={customersError} title="Error" />}

                {total !== undefined && (
                    <p className="section-description">
                        Showing {customers.length} of {total} customers (offset: {offset}, limit: {limit})
                    </p>
                )}

                {customers.length > 0 && (
                    <div className="data-table-wrapper">
                        <h4>Customers ({customers.length})</h4>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer, index) => (
                                    <tr key={customer._id || customer.id || index}>
                                        <td>
                                            {customer.firstName} {customer.lastName}
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => {
                                                    const id = customer._id || customer.id || "";
                                                    setAssignCustomerId(id);
                                                    setActiveCustomerId(id);
                                                }}
                                                className="btn btn--small"
                                            >
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CommandSection>

            <CommandSection title="Assign Customer">
                <div className="form-group">
                    <label className="form-label">Customer ID:</label>
                    <input
                        type="text"
                        value={assignCustomerId}
                        onChange={e => setAssignCustomerId(e.target.value)}
                        className="form-input"
                        placeholder="Enter Customer ID"
                    />
                </div>
                <button onClick={handleAssignCustomer} disabled={assignCustomerLoading} className="btn btn--primary">
                    {assignCustomerLoading ? "Assigning..." : "Assign Customer"}
                </button>

                {assignCustomerResponse && (
                    <JsonViewer data={assignCustomerResponse} title={assignCustomerResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            <CommandSection title="Get Active Customer">
                <p className="section-description">Returns the active customer from POS state (may differ from cart assign in some flows).</p>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setGetActiveCustomerResponse("Error: Not running in iframe");
                            return;
                        }
                        setGetActiveCustomerLoading(true);
                        setGetActiveCustomerResponse("");
                        try {
                            const result = await command.getActiveCustomer();
                            setGetActiveCustomerResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setGetActiveCustomerResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setGetActiveCustomerLoading(false);
                        }
                    }}
                    disabled={getActiveCustomerLoading}
                    className="btn btn--primary"
                >
                    {getActiveCustomerLoading ? "Loading..." : "Get Active Customer"}
                </button>
                {getActiveCustomerResponse && (
                    <JsonViewer data={getActiveCustomerResponse} title={getActiveCustomerResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            <CommandSection title="Set Active Customer">
                <p className="section-description">Loads a customer by id from local DB and sets as active customer.</p>
                <div className="form-group">
                    <label className="form-label">Customer ID:</label>
                    <input
                        type="text"
                        value={activeCustomerId}
                        onChange={e => setActiveCustomerId(e.target.value)}
                        className="form-input"
                        placeholder="customer-id"
                    />
                </div>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setSetActiveCustomerResponse("Error: Not running in iframe");
                            return;
                        }
                        if (!activeCustomerId) {
                            setSetActiveCustomerResponse("Error: Please enter a customer ID");
                            return;
                        }
                        setSetActiveCustomerLoading(true);
                        setSetActiveCustomerResponse("");
                        try {
                            const result = await command.setActiveCustomer({ customerId: activeCustomerId });
                            setSetActiveCustomerResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setSetActiveCustomerResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setSetActiveCustomerLoading(false);
                        }
                    }}
                    disabled={setActiveCustomerLoading}
                    className="btn btn--primary"
                >
                    {setActiveCustomerLoading ? "Setting..." : "Set Active Customer"}
                </button>
                {setActiveCustomerResponse && (
                    <JsonViewer data={setActiveCustomerResponse} title={setActiveCustomerResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            <CommandSection title="Add New Customer">
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            value={newCustomer.firstName}
                            onChange={e => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            value={newCustomer.lastName}
                            onChange={e => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={newCustomer.email}
                            onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            value={newCustomer.phone}
                            onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            className="form-input"
                        />
                    </div>
                </div>
                <button onClick={handleAddCustomer} disabled={addCustomerLoading} className="btn btn--primary">
                    {addCustomerLoading ? "Adding..." : "Add Customer"}
                </button>

                {addCustomerResponse && (
                    <JsonViewer data={addCustomerResponse} title={addCustomerResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            <CommandSection title="Add Customer Note">
                <p className="section-description">Adds a note to a customer's record.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Customer ID:</label>
                        <input type="text" value={customerNoteId} onChange={e => setCustomerNoteId(e.target.value)} placeholder="customer-123" />
                    </div>
                    <div className="form-field">
                        <label>Note:</label>
                        <textarea value={customerNote} onChange={e => setCustomerNote(e.target.value)} placeholder="Enter note text" rows={3} />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        // if (!isInIframe) {
                        //   setAddCustomerNoteResponse('Error: Not running in iframe');
                        //   return;
                        // }
                        if (!customerNoteId) {
                            setAddCustomerNoteResponse("Error: Customer ID is required");
                            return;
                        }
                        if (!customerNote) {
                            setAddCustomerNoteResponse("Error: Note is required");
                            return;
                        }
                        setAddCustomerNoteLoading(true);
                        setAddCustomerNoteResponse("");
                        try {
                            const result = await command.addCustomerNote({
                                customerId: customerNoteId,
                                note: customerNote
                            });
                            setAddCustomerNoteResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setAddCustomerNoteResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setAddCustomerNoteLoading(false);
                        }
                    }}
                    disabled={addCustomerNoteLoading}
                    className="btn btn--primary"
                >
                    {addCustomerNoteLoading ? "Adding..." : "Add Customer Note"}
                </button>
                {addCustomerNoteResponse && (
                    <JsonViewer data={addCustomerNoteResponse} title={addCustomerNoteResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            {/* remove customer note */}
            <CommandSection title="Remove Customer Note">
                <p className="section-description">Removes a note from a customer's record.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Note ID:</label>
                        <input
                            type="text"
                            value={removeCustomerNoteId}
                            onChange={e => setRemoveCustomerNoteId(e.target.value)}
                            placeholder="note-id-123"
                        />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!removeCustomerNoteId) {
                            setRemoveCustomerNoteResponse("Error: Note ID is required");
                            return;
                        }

                        setRemoveCustomerNoteLoading(true);
                        setRemoveCustomerNoteResponse("");
                        try {
                            const result = await command.removeCustomerNote({ noteId: removeCustomerNoteId });
                            setRemoveCustomerNoteResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setRemoveCustomerNoteResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setRemoveCustomerNoteLoading(false);
                        }
                    }}
                    disabled={removeCustomerNoteLoading}
                    className="btn btn--primary"
                >
                    {removeCustomerNoteLoading ? "Removing..." : "Remove Customer Note"}
                </button>
                {removeCustomerNoteResponse && (
                    <JsonViewer data={removeCustomerNoteResponse} title={removeCustomerNoteResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            <CommandSection title="Remove Customer from Cart">
                <p className="section-description">Removes the currently assigned customer from the cart.</p>
                <button
                    onClick={async () => {
                        // if (!isInIframe) {
                        //   setRemoveCustomerResponse('Error: Not running in iframe');
                        //   return;
                        // }
                        setRemoveCustomerLoading(true);
                        setRemoveCustomerResponse("");
                        try {
                            const result = await command.removeCustomerFromCart();
                            setRemoveCustomerResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setRemoveCustomerResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setRemoveCustomerLoading(false);
                        }
                    }}
                    disabled={removeCustomerLoading}
                    className="btn btn--primary"
                >
                    {removeCustomerLoading ? "Removing..." : "Remove Customer"}
                </button>
                {removeCustomerResponse && (
                    <JsonViewer data={removeCustomerResponse} title={removeCustomerResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>
        </div>
    );
}
