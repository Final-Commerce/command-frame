/**
 * Topic Subscriber for iframe communication
 * Manages subscriptions to topics and receives events from the host window
 */

import type {
    TopicDefinition,
    TopicEvent,
    TopicSubscription,
    TopicSubscriptionCallback
} from "./types";

/**
 * Internal message types for pub/sub communication
 */
interface PubSubMessage {
    type: "topic-event" | "topics-list";
    payload?: any;
}

interface TopicEventMessage extends PubSubMessage {
    type: "topic-event";
    payload: TopicEvent;
}

interface TopicsListMessage extends PubSubMessage {
    type: "topics-list";
    payload: TopicDefinition[];
}

export class TopicSubscriber {
    private subscriptions: Map<string, TopicSubscription[]> = new Map();
    private topics: TopicDefinition[] = [];
    private origin: string;
    private debug: boolean;
    private useGlobalDebug: boolean;
    private boundHandleMessage: (event: MessageEvent) => void;
    private subscriptionIdCounter: number = 0;

    constructor(options: { origin?: string; debug?: boolean } = {}) {
        this.origin = options.origin || "*";
        this.debug = options.debug ?? false;
        this.useGlobalDebug = options.debug === undefined;

        // Store bound handler for cleanup
        this.boundHandleMessage = this.handleMessage.bind(this);

        if (typeof window !== "undefined") {
            window.addEventListener("message", this.boundHandleMessage);
        }

        // Request topics list on initialization
        this.requestTopics();

        if (this.isDebugEnabled()) {
            console.log("[TopicSubscriber] Initialized", {
                origin: this.origin,
                debug: this.isDebugEnabled()
            });
        }
    }

    private isDebugEnabled(): boolean {
        if (!this.useGlobalDebug) {
            return this.debug;
        }
        return typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true;
    }

    /**
     * Request the list of available topics from the host
     */
    private requestTopics(): void {
        if (typeof window !== "undefined" && window.parent && window.parent !== window) {
            const message = {
                type: "pubsub-request-topics",
                requestId: `topics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };

            if (this.isDebugEnabled()) {
                console.log("[TopicSubscriber] Requesting topics list", message);
            }

            window.parent.postMessage(message, this.origin);
        }
    }

    /**
     * Subscribe to a topic with a callback
     * Returns a subscription ID that can be used to unsubscribe
     */
    subscribe<T = any>(topic: string, callback: TopicSubscriptionCallback<T>): string {
        const subscriptionId = `sub_${++this.subscriptionIdCounter}_${Date.now()}`;

        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, []);
        }

        const subscription: TopicSubscription = {
            id: subscriptionId,
            topic,
            callback: callback as TopicSubscriptionCallback
        };

        this.subscriptions.get(topic)!.push(subscription);

        // Notify host about the subscription
        this.notifySubscription(topic, true);

        if (this.isDebugEnabled()) {
            console.log("[TopicSubscriber] Subscribed to topic", {
                topic,
                subscriptionId,
                totalSubscriptions: this.subscriptions.get(topic)!.length
            });
        }

        return subscriptionId;
    }

    /**
     * Unsubscribe from a topic using subscription ID
     */
    unsubscribe(topic: string, subscriptionId: string): boolean {
        const topicSubscriptions = this.subscriptions.get(topic);
        if (!topicSubscriptions) {
            if (this.isDebugEnabled()) {
                console.warn("[TopicSubscriber] Topic not found for unsubscribe", { topic });
            }
            return false;
        }

        const index = topicSubscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index === -1) {
            if (this.isDebugEnabled()) {
                console.warn("[TopicSubscriber] Subscription ID not found", { topic, subscriptionId });
            }
            return false;
        }

        topicSubscriptions.splice(index, 1);

        // If no more subscriptions for this topic, remove it
        if (topicSubscriptions.length === 0) {
            this.subscriptions.delete(topic);
            // Notify host about unsubscription
            this.notifySubscription(topic, false);
        }

        if (this.isDebugEnabled()) {
            console.log("[TopicSubscriber] Unsubscribed from topic", {
                topic,
                subscriptionId,
                remainingSubscriptions: topicSubscriptions.length
            });
        }

        return true;
    }

    /**
     * Unsubscribe all callbacks for a topic
     */
    unsubscribeAll(topic: string): number {
        const topicSubscriptions = this.subscriptions.get(topic);
        if (!topicSubscriptions) {
            return 0;
        }

        const count = topicSubscriptions.length;
        this.subscriptions.delete(topic);
        this.notifySubscription(topic, false);

        if (this.isDebugEnabled()) {
            console.log("[TopicSubscriber] Unsubscribed all from topic", { topic, count });
        }

        return count;
    }

    /**
     * Get list of available topics
     */
    async getTopics(): Promise<TopicDefinition[]> {
        // Request fresh topics list
        this.requestTopics();

        // Return cached topics (host will send updated list via message)
        return [...this.topics];
    }

    /**
     * Notify host about subscription changes
     */
    private notifySubscription(topic: string, isSubscribed: boolean): void {
        if (typeof window !== "undefined" && window.parent && window.parent !== window) {
            const message = {
                type: isSubscribed ? "pubsub-subscribe" : "pubsub-unsubscribe",
                topic,
                requestId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };

            if (this.isDebugEnabled()) {
                console.log("[TopicSubscriber] Notifying subscription change", message);
            }

            window.parent.postMessage(message, this.origin);
        }
    }

    /**
     * Handle incoming messages from host
     */
    private handleMessage(event: MessageEvent): void {
        if (this.origin !== "*" && event.origin !== this.origin) {
            if (this.isDebugEnabled()) {
                console.warn("[TopicSubscriber] Origin mismatch", {
                    expected: this.origin,
                    received: event.origin
                });
            }
            return;
        }

        const data = event.data;

        // Handle topic event
        if (data && data.type === "pubsub-event") {
            const eventMessage = data as TopicEventMessage;
            this.handleTopicEvent(eventMessage.payload);
            return;
        }

        // Handle topics list
        if (data && data.type === "pubsub-topics-list") {
            const topicsMessage = data as TopicsListMessage;
            this.topics = topicsMessage.payload || [];
            if (this.isDebugEnabled()) {
                console.log("[TopicSubscriber] Received topics list", this.topics);
            }
            return;
        }
    }

    /**
     * Handle incoming topic event and dispatch to callbacks
     */
    private handleTopicEvent(event: TopicEvent): void {
        const topicSubscriptions = this.subscriptions.get(event.topic);
        if (!topicSubscriptions || topicSubscriptions.length === 0) {
            if (this.isDebugEnabled()) {
                console.warn("[TopicSubscriber] Received event for topic with no subscriptions", {
                    topic: event.topic
                });
            }
            return;
        }

        if (this.isDebugEnabled()) {
            console.log("[TopicSubscriber] Dispatching event to callbacks", {
                topic: event.topic,
                type: event.type,
                subscriptionCount: topicSubscriptions.length
            });
        }

        // Call all callbacks for this topic
        topicSubscriptions.forEach(subscription => {
            try {
                subscription.callback(event);
            } catch (error) {
                console.error("[TopicSubscriber] Error in subscription callback", {
                    topic: event.topic,
                    subscriptionId: subscription.id,
                    error
                });
            }
        });
    }

    /**
     * Cleanup and destroy the subscriber
     */
    destroy(): void {
        this.subscriptions.clear();
        this.topics = [];

        if (typeof window !== "undefined") {
            window.removeEventListener("message", this.boundHandleMessage);
        }

        if (this.isDebugEnabled()) {
            console.log("[TopicSubscriber] Destroyed");
        }
    }
}

