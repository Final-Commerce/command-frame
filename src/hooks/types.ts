import type { TopicEvent } from "../pubsub/types";

/**
 * Function signature for extension hook callbacks.
 * The function is serialized and sent to the host; it receives event and hostCommands when executed.
 */
export type HookFunction = (
    event: TopicEvent,
    hostCommands: Record<string, (params?: any) => Promise<any>>,
    callCommand: (action: string, params?: any) => Promise<any>
) => void | Promise<void>;

/**
 * Options when registering a hook from the extension iframe.
 */
export interface HookRegisterOptions {
    /** Stable identifier for this hook. Used to deduplicate on reload. Must be unique per hook. */
    hookId: string;
    /** Only fire for these event types; omit to receive all events for the topic */
    eventTypes?: string[];
}
