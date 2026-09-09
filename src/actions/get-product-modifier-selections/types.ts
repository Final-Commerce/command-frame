// Get Product Modifier Selections Types

/** One chosen choice: `quantity` is units PER LINE-ITEM UNIT (1 unless the control is a stepper). */
export interface ModifierChoiceSelection {
    choiceId: string;
    quantity: number;
}

/** The cashier's answer to one modifier. */
export interface ModifierSelection {
    modifierId: string;
    choices: ModifierChoiceSelection[];
}

export interface GetProductModifierSelectionsParams {
    /** The cart line to read. Defaults to the active product's line. */
    internalId?: string;
}

export interface GetProductModifierSelectionsResponse {
    success: boolean;
    /** Set when the read failed (e.g. no such line, no active product). */
    reason?: string;
    internalId?: string;
    /**
     * The line's current modifier selections. Supplied at creation via
     * `addProductToCart({ modifiers })`; edit them with
     * `setProductModifierSelections` (full replacement, re-validated).
     * Modifier DEFINITIONS remain read-only — they flow one-way from
     * station-sync into the till.
     */
    selections: ModifierSelection[];
    timestamp: string;
}

export type GetProductModifierSelections = (
    params?: GetProductModifierSelectionsParams
) => Promise<GetProductModifierSelectionsResponse>;
