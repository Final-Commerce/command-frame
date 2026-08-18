import { commandFrameClient } from '../../client';
import type { DeleteAttribute, DeleteAttributeParams, DeleteAttributeResponse } from './types';

export const deleteAttribute: DeleteAttribute = async (
  params: DeleteAttributeParams,
): Promise<DeleteAttributeResponse> => {
  return await commandFrameClient.call<DeleteAttributeParams, DeleteAttributeResponse>('deleteAttribute', params);
};
