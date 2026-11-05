import { GetCustomStockActions, GetCustomStockActionsResponse } from './types';

export const mockGetCustomStockActions: GetCustomStockActions = async (): Promise<GetCustomStockActionsResponse> => {
  console.log('[Mock] getCustomStockActions called');

  return {
    customStockActions: [
      { _id: 'mock_custom_action_1', name: 'Opening stock', baseAction: 'ADD' },
      { _id: 'mock_custom_action_2', name: 'Exhibition loan', baseAction: 'REMOVE' },
      { _id: 'mock_custom_action_3', name: 'Year-end count', baseAction: 'RECOUNT' },
    ],
    timestamp: new Date().toISOString(),
  };
};
