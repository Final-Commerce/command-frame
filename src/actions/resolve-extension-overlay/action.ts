import { commandFrameClient } from '../../client';
import type { ResolveExtensionOverlay, ResolveExtensionOverlayParams, ResolveExtensionOverlayResponse } from './types';

export const resolveExtensionOverlay: ResolveExtensionOverlay = async (
  params: ResolveExtensionOverlayParams,
): Promise<ResolveExtensionOverlayResponse> => {
  return await commandFrameClient.call<ResolveExtensionOverlayParams, ResolveExtensionOverlayResponse>(
    'resolveExtensionOverlay',
    params,
  );
};
