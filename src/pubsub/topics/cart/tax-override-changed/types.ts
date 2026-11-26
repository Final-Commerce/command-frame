import type { CFActiveCart, CFTaxOverride } from '../../../../CommonTypes';
import type { TopicEvent } from '../../../types';

/**
 * Payload for cart tax-override-changed: tax was turned off or back on for one line or the whole sale
 * (`setTaxOverride`, FT-315). The cart is already repriced.
 */
export interface CartTaxOverrideChangedPayload {
  /** The line that changed (a product's or booking's internalId, a custom sale's id), or null for the whole sale. */
  internalId: string | null;
  /** The record now on the line or the sale, or null when tax is back on. */
  taxOverride: CFTaxOverride | null;
  cart: CFActiveCart;
}

/**
 * Typed event for cart tax-override-changed
 */
export type CartTaxOverrideChangedEvent = TopicEvent<CartTaxOverrideChangedPayload>;
