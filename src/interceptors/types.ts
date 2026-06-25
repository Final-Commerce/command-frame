/**
 * Interceptors let an installed extension gate a host flow at a named point.
 * Registration mirrors hooks: the callback is serialized and reconstructed on the host,
 * so it must be self-contained (use only its payload arg and the injected host commands).
 */
export type InterceptorPoint = "refund_start";

/** false = stop the flow; true = continue, no data; object = continue and merge into the flow payload. */
export type InterceptorReturn<T extends Record<string, unknown> = Record<string, unknown>> = boolean | T;

/** Params accepted by the host-injected `openExtensionOverlay` command. */
export interface OpenExtensionOverlayCommandParams {
    point: InterceptorPoint;
    payload?: unknown;
}

/**
 * Host commands injected into an interceptor callback. `openExtensionOverlay` is the one
 * always-present command; additional host commands are dispatched through the same shape.
 * Heterogeneous command payloads are sent via the separate `callCommand` arg of
 * `InterceptorFunction`, so the indexed entries here share the overlay command's param type.
 */
export interface InterceptorHostCommands {
    openExtensionOverlay: (params: OpenExtensionOverlayCommandParams) => Promise<InterceptorReturn>;
    [command: string]: (params: OpenExtensionOverlayCommandParams) => Promise<InterceptorReturn>;
}

export type InterceptorFunction = (
    payload: unknown,
    cmds: InterceptorHostCommands,
    callCommand: (action: string, params?: unknown) => Promise<unknown>
) => InterceptorReturn | Promise<InterceptorReturn>;

export interface InterceptorRegisterOptions {
    /** Stable id; re-registering with the same id replaces the previous one. */
    interceptorId: string;
    /** Per-interceptor timeout override (ms). */
    timeoutMs?: number;
}

export interface InterceptorOverlayContext {
    point: InterceptorPoint;
    payload: unknown;
}
