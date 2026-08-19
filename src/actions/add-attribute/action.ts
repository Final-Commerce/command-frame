import { commandFrameClient } from '../../client';
import type { AddAttribute, AddAttributeParams, AddAttributeResponse } from './types';

export const addAttribute: AddAttribute = async (params: AddAttributeParams): Promise<AddAttributeResponse> => {
  return await commandFrameClient.call<AddAttributeParams, AddAttributeResponse>('addAttribute', params);
};
