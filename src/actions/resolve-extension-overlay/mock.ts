import type { ResolveExtensionOverlay, ResolveExtensionOverlayParams, ResolveExtensionOverlayResponse } from "./types";
export const mockResolveExtensionOverlay: ResolveExtensionOverlay = async (_params: ResolveExtensionOverlayParams): Promise<ResolveExtensionOverlayResponse> => ({ success: true });
