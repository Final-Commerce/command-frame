/**
 * Pub/Sub Types for Command Frame
 * Defines topic and event structures for pub/sub communication
 */

/**
 * Event type definition for a topic
 */
export interface TopicEventType {
    id: string;
    name: string;
    description?: string;
}

/**
 * Topic definition with metadata
 */
export interface TopicDefinition {
    id: string;
    name: string;
    description?: string;
    eventTypes: TopicEventType[];
}

/**
 * Event payload structure
 */
export interface TopicEvent<T = any> {
    topic: string;
    type: string;
    data: T;
    timestamp: string;
}

/**
 * Subscription callback function type
 */
export type TopicSubscriptionCallback<T = any> = (event: TopicEvent<T>) => void;

/**
 * Subscription information
 */
export interface TopicSubscription {
    id: string;
    topic: string;
    callback: TopicSubscriptionCallback;
}

export interface TopicRegistration {
    definition: TopicDefinition;
    subscribers: {
        iframeWindow: Window;
        topic: string;
        subscribedAt: number;
        subscriptionCount: number;
    }[];
}

/**
 * Hook callback function type (host-side, session-scoped)
 */
export type HookCallback<T = any> = (event: TopicEvent<T>) => void | Promise<void>;

/**
 * Options when registering a host-side hook
 */
export interface HookOptions {
    /** Only fire for these event types; omit to receive all event types for the topic */
    eventTypes?: string[];
}

/**
 * Single hook registration (stored by TopicPublisher)
 */
export interface HookRegistration {
    id: string;
    topicId: string;
    callback: HookCallback;
    eventTypes?: string[];
    /** Origin of the iframe that registered this hook (for debugging) */
    sourceOrigin?: string;
}
