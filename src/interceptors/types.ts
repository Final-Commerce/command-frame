/**
 * Interceptors let an installed extension gate a host flow at a named point.
 * Registration mirrors hooks: the callback is serialized and reconstructed on the host,
 * so it must be self-contained (use only its payload arg and the injected host commands).
 */
export type InterceptorPoint = "refund_start";

/** false = stop the flow; true = continue, no data; object = continue and merge into the flow payload. */
export type InterceptorReturn<T extends Record<string, any> = Record<string, any>> = boolean | T;

export interface InterceptorHostCommands {
    openExtensionOverlay: (params: { point: InterceptorPoint; payload?: any }) => Promise<InterceptorReturn>;
    [command: string]: (params?: any) => Promise<any>;
}

export type InterceptorFunction = (
    payload: any,
    cmds: InterceptorHostCommands,
    callCommand: (action: string, params?: any) => Promise<any>
) => InterceptorReturn | Promise<InterceptorReturn>;

export interface InterceptorRegisterOptions {
    /** Stable id; re-registering with the same id replaces the previous one. */
    interceptorId: string;
    /** Per-interceptor timeout override (ms). */
    timeoutMs?: number;
}

export interface InterceptorOverlayContext {
    point: InterceptorPoint;
    payload: any;
}
