import { commandFrameClient } from '../../client';
import type { DeleteImage, DeleteImageParams, DeleteImageResponse } from './types';

export const deleteImage: DeleteImage = async (params: DeleteImageParams): Promise<DeleteImageResponse> => {
  return await commandFrameClient.call<DeleteImageParams, DeleteImageResponse>('deleteImage', params);
};
