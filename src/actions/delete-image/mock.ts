import { DeleteImage, DeleteImageParams, DeleteImageResponse } from './types';
import { MOCK_IMAGES } from '../../demo/database';

export const mockDeleteImage: DeleteImage = async (params: DeleteImageParams): Promise<DeleteImageResponse> => {
  console.log('[Mock] deleteImage called', params);

  const index = MOCK_IMAGES.findIndex((i) => i._id === params.attachmentId);
  if (index !== -1) MOCK_IMAGES.splice(index, 1);

  return {
    success: true,
    attachmentId: params.attachmentId,
    timestamp: new Date().toISOString(),
  };
};
