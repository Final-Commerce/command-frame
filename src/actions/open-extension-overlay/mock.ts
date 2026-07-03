import type { OpenExtensionOverlay, OpenExtensionOverlayParams, OpenExtensionOverlayResponse } from "./types";
export const mockOpenExtensionOverlay: OpenExtensionOverlay = async (_params: OpenExtensionOverlayParams): Promise<OpenExtensionOverlayResponse> => true;
