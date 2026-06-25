import type { InterceptorReturn } from "../../interceptors/types";

export interface ResolveExtensionOverlayParams {
    overlayId: string;
    result: InterceptorReturn;
}

export interface ResolveExtensionOverlayResponse {
    success: boolean;
}

export type ResolveExtensionOverlay = (params: ResolveExtensionOverlayParams) => Promise<ResolveExtensionOverlayResponse>;
