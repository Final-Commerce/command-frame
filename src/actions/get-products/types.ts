import { CFProduct } from '../../CommonTypes';

// Get Products Types
export interface GetProductsParams {
  /**
   * MongoDB-like query object.
   *
   * BOOKABLE SERVICES ARE EXCLUDED unless this query mentions `productType`. A service is not
   * catalogue stock: it is sold by claiming a time with `addBookingToCart`, and
   * `addProductToCart` refuses it. Returned by default it appeared in ordinary product grids,
   * where the obvious gesture took the money and reserved nothing.
   *
   * Ask for them explicitly when the user actually wants services — a "Book" tab, a services
   * screen, a search across everything:
   *
   *   getProducts({ query: { productType: 'booking' } })   // services only
   *   getProducts({ query: { productType: { $in: ['simple', 'variable', 'booking'] } } })  // both
   *
   * Any query naming `productType` is used exactly as written.
   */
  query?: {
    // MongoDB query fields
    name?: string | { $regex?: string; $options?: string };
    sku?: string | { $regex?: string; $options?: string };
    status?: string;
    /**
     * `simple` | `variable` | `booking`. Naming it at all switches OFF the default exclusion
     * of bookable services — including `{ $ne: 'booking' }`, which then means what it says.
     */
    productType?: string | { $in?: string[]; $ne?: string };
    categories?: string | { $in?: string[] };
    tags?: string | { $in?: string[] };
    supplier?: string;
    externalId?: string;
    // Text search (searches across name, sku)
    // This is handled by the handler, not directly in query
    [key: string]: any;
  };
  /** Defaults to 0. */
  offset?: number;
  /** Defaults to 100. */
  limit?: number;
}

export interface GetProductsResponse {
  products: CFProduct[];
  /** Total number of products matching the query, ignoring offset/limit. Optional — hosts that cannot cheaply compute the total may omit it. */
  total?: number;
  timestamp: string;
}

export type GetProducts = (params?: GetProductsParams) => Promise<GetProductsResponse>;
