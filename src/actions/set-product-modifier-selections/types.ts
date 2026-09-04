// Set Product Modifier Selections Types
import type { ModifierSelection } from "../get-product-modifier-selections/types";

export interface SetProductModifierSelectionsParams {
    /** The cart line to edit. Defaults to the active product's line. */
    internalId?: string;
    /**
     * The line's COMPLETE new answers — replaces every existing selection on the
     * line (send [] to clear all optional modifiers). Validated against the
     * product's category-modifier rules exactly like addProductToCart({ modifiers }):
     * a selection that breaks a rule rejects the edit and the line is unchanged.
     */
    selections: ModifierSelection[];
}

export interface SetProductModifierSelectionsResponse {
    success: boolean;
    /** Set when the edit was rejected (rule violation) — the line is unchanged. */
    reason?: string;
    internalId?: string;
    /** The selections now on the line (the new ones on success, the old ones on rejection). */
    selections: ModifierSelection[];
    timestamp: string;
}

export type SetProductModifierSelections = (
    params?: SetProductModifierSelectionsParams
) => Promise<SetProductModifierSelectionsResponse>;
