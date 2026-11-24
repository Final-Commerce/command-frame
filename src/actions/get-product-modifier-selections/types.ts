// Get Product Modifier Selections Types
import type { CFModifierSelection, CFModifierChoiceSelection, CFProdModifierBreakdown } from '../../CommonTypes';

/** Alias of common's — `quantity` is units PER LINE-ITEM UNIT. */
export type ModifierChoiceSelection = CFModifierChoiceSelection;

/** Alias of common's — the cashier's answer to one modifier. */
export type ModifierSelection = CFModifierSelection;

export interface GetProductModifierSelectionsParams {
  /** The cart line to read. Defaults to the active product's line. */
  internalId?: string;
}

export interface GetProductModifierSelectionsResponse {
  success: boolean;
  /** Set when the read failed (e.g. no such line, no active product). */
  reason?: string;
  internalId?: string;
  /** Raw ids — round-trips back into the setter. No names, no money: use `rows` to display. */
  selections: ModifierSelection[];
  /** Display-ready: "Toppings - Avocado" x2, `amount` 1000. One row per chosen choice. */
  rows: CFProdModifierBreakdown[];
  /** Sum of `rows[].amount` for THIS line, in minor units. */
  modifiersTotal: number;
  /** The whole line as the cart prices it (item, its discounts, fees and modifiers), in minor units. */
  lineTotal: number;
  /** The same for ONE unit, for an "each" price. */
  unitTotal: number;
  timestamp: string;
}

export type GetProductModifierSelections = (
  params?: GetProductModifierSelectionsParams,
) => Promise<GetProductModifierSelectionsResponse>;
