import { commandFrameClient } from '../../client';
import type { OpenExtensionOverlay, OpenExtensionOverlayParams, OpenExtensionOverlayResponse } from './types';

export const openExtensionOverlay: OpenExtensionOverlay = async (
  params: OpenExtensionOverlayParams,
): Promise<OpenExtensionOverlayResponse> => {
  return await commandFrameClient.call<OpenExtensionOverlayParams, OpenExtensionOverlayResponse>(
    'openExtensionOverlay',
    params,
  );
};
