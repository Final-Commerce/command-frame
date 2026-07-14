// Set Active Product Discount Types
export interface SetActiveProductDiscountParams {
    /** The discount amount in integer MINOR currency units (e.g. 500 = $5.00). If isPercent is true, this is a percentage (0-100) instead. */
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Discount". */
    label?: string;
}

export interface SetActiveProductDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    timestamp: string;
}

export type SetActiveProductDiscount = (params: SetActiveProductDiscountParams) => Promise<SetActiveProductDiscountResponse>;
