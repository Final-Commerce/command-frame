import type { CFMetadataItem } from '../../CommonTypes';

export interface SetOrderMetadataParams {
  /**
   * Order to update. Omit to target the live cart's order — including a cart
   * that hasn't become an order yet (the metadata is carried onto the order
   * when it is created).
   */
  orderId?: string;
  /** Keys to set (string) or remove (null). Keys not listed are left as they are. */
  metadata: Record<string, string | null>;
}

export interface SetOrderMetadataResponse {
  success: boolean;
  /** The order that was updated, or null when the live cart has no order yet. */
  orderId: string | null;
  /** The full metadata after the update. */
  metadata: CFMetadataItem[];
  timestamp: string;
}

export type SetOrderMetadata = (params: SetOrderMetadataParams) => Promise<SetOrderMetadataResponse>;
