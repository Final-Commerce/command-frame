import { GetAttributes, GetAttributesResponse } from './types';
import { MOCK_ATTRIBUTES, safeSerialize } from '../../demo/database';

export const mockGetAttributes: GetAttributes = async (): Promise<GetAttributesResponse> => {
  console.log('[Mock] getAttributes called');

  return {
    success: true,
    attributes: safeSerialize(MOCK_ATTRIBUTES),
    timestamp: new Date().toISOString(),
  };
};
