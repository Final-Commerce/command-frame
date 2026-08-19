import { DeleteAttribute, DeleteAttributeParams, DeleteAttributeResponse } from './types';
import { MOCK_ATTRIBUTES } from '../../demo/database';

export const mockDeleteAttribute: DeleteAttribute = async (
  params: DeleteAttributeParams,
): Promise<DeleteAttributeResponse> => {
  console.log('[Mock] deleteAttribute called', params);

  const index = MOCK_ATTRIBUTES.findIndex((a) => a.id === params.attributeId);
  if (index !== -1) MOCK_ATTRIBUTES.splice(index, 1);

  return {
    success: true,
    attributeId: params.attributeId,
    timestamp: new Date().toISOString(),
  };
};
