import { commandFrameClient } from '../../client';
import type { GetAttributes, GetAttributesResponse } from './types';

export const getAttributes: GetAttributes = async (): Promise<GetAttributesResponse> => {
  return await commandFrameClient.call<undefined, GetAttributesResponse>('getAttributes');
};
