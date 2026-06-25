import type { InterceptorPoint, InterceptorReturn } from "../../interceptors/types";

export interface OpenExtensionOverlayParams {
    point: InterceptorPoint;
    payload?: unknown;
    /** Owning extension id. Injected by the host for interceptor-originated calls; optional for direct calls. */
    extensionId?: string;
}

export type OpenExtensionOverlayResponse = InterceptorReturn;

export type OpenExtensionOverlay = (params: OpenExtensionOverlayParams) => Promise<OpenExtensionOverlayResponse>;
