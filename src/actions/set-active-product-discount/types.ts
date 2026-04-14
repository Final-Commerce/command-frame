// Set Active Product Discount Types
export interface SetActiveProductDiscountParams {
    /** The discount amount. If isPercent is true, this is a percentage. */
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
