import { commandFrameClient } from '../../client';
import type { PreviewVariants, PreviewVariantsParams, PreviewVariantsResponse } from './types';

export const previewVariants: PreviewVariants = async (
  params: PreviewVariantsParams,
): Promise<PreviewVariantsResponse> => {
  return await commandFrameClient.call<PreviewVariantsParams, PreviewVariantsResponse>('previewVariants', params);
};
