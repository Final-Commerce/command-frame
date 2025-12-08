// Remove Customer From Cart Types
export interface RemoveCustomerFromCartResponse {
    success: boolean;
    timestamp: string;
}

export type RemoveCustomerFromCart = () => Promise<RemoveCustomerFromCartResponse>;

