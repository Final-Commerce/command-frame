// Set Active Product Fee Types
export interface SetActiveProductFeeParams {
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Fee". */
    label?: string;
    /** Defaults to `false`. */
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface SetActiveProductFeeResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    timestamp: string;
}

export type SetActiveProductFee = (params: SetActiveProductFeeParams) => Promise<SetActiveProductFeeResponse>;
