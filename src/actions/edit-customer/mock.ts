import { EditCustomer, EditCustomerParams, EditCustomerResponse } from "./types";
import { MOCK_CUSTOMERS } from "../../demo/database";

export const mockEditCustomer: EditCustomer = async (params?: EditCustomerParams): Promise<EditCustomerResponse> => {
    console.log("[Mock] editCustomer called", params);

    if (!params?.customerId) throw new Error("Customer ID required");
    if (!params?.changes) throw new Error("Changes object required");

    const customer = MOCK_CUSTOMERS.find(c => c._id === params.customerId);
    if (!customer) throw new Error(`Customer not found: ${params.customerId}`);

    Object.assign(customer, params.changes, { updatedAt: new Date().toISOString() });

    window.alert(`Demo: Customer Updated!\nName: ${customer.firstName} ${customer.lastName}`);

    return {
        success: true,
        customer: { ...customer },
        timestamp: new Date().toISOString()
    };
};
