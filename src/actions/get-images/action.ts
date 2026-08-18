import { commandFrameClient } from '../../client';
import type { GetImages, GetImagesResponse } from './types';

export const getImages: GetImages = async (): Promise<GetImagesResponse> => {
  return await commandFrameClient.call<undefined, GetImagesResponse>('getImages');
};
