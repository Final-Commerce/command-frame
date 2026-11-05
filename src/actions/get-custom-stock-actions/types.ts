// Get Custom Stock Actions Types

export interface CustomStockActionPayload {
  _id: string;
  /** Name the company gave the action, shown in pickers and stock history. */
  name: string;
  /** What the action does to stock — pass the matching `stockType` to adjustInventory. */
  baseAction: 'ADD' | 'REMOVE' | 'RECOUNT';
}

export interface GetCustomStockActionsResponse {
  customStockActions: CustomStockActionPayload[];
  timestamp: string;
}

export type GetCustomStockActions = () => Promise<GetCustomStockActionsResponse>;
