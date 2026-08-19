import { commandFrameClient } from '../../client';
import type { UploadImage, UploadImageParams, UploadImageResponse } from './types';

export const uploadImage: UploadImage = async (params: UploadImageParams): Promise<UploadImageResponse> => {
  return await commandFrameClient.call<UploadImageParams, UploadImageResponse>('uploadImage', params);
};
