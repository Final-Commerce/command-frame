// Set Active Product Fee Types
export interface SetActiveProductFeeParams {
    /** The fee amount in integer MINOR currency units (e.g. 500 = $5.00). If isPercent is true, this is a percentage (0-100) instead. */
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
