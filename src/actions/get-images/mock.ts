import { GetImages, GetImagesResponse } from './types';
import { MOCK_IMAGES, safeSerialize } from '../../demo/database';

export const mockGetImages: GetImages = async (): Promise<GetImagesResponse> => {
  console.log('[Mock] getImages called');

  return {
    success: true,
    images: safeSerialize(MOCK_IMAGES),
    timestamp: new Date().toISOString(),
  };
};
