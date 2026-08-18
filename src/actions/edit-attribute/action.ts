import { commandFrameClient } from '../../client';
import type { EditAttribute, EditAttributeParams, EditAttributeResponse } from './types';

export const editAttribute: EditAttribute = async (params: EditAttributeParams): Promise<EditAttributeResponse> => {
  return await commandFrameClient.call<EditAttributeParams, EditAttributeResponse>('editAttribute', params);
};
