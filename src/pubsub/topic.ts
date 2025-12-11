/**
 * Pub/Sub module for Command Frame
 * Provides topic subscription functionality for iframe apps
 */

export * from "./types";
export { TopicSubscriber } from "./subscriber";

// Singleton instance
import { TopicSubscriber } from "./subscriber";

let subscriberInstance: TopicSubscriber | null = null;

/**
 * Get or create the singleton TopicSubscriber instance
 */
export function getTopicSubscriber(options?: { origin?: string; debug?: boolean }): TopicSubscriber {
    if (!subscriberInstance) {
        subscriberInstance = new TopicSubscriber(options);
    }
    return subscriberInstance;
}

/**
 * Topics API for iframe apps
 */
const topicsApi = {
    /**
     * Subscribe to a topic
     */
    subscribe: <T = any>(topic: string, callback: (event: import("./types").TopicEvent<T>) => void): string => {
        const subscriber = getTopicSubscriber();
        return subscriber.subscribe(topic, callback);
    },

    /**
     * Unsubscribe from a topic
     */
    unsubscribe: (topic: string, subscriptionId: string): boolean => {
        const subscriber = getTopicSubscriber();
        return subscriber.unsubscribe(topic, subscriptionId);
    },

    /**
     * Unsubscribe all callbacks for a topic
     */
    unsubscribeAll: (topic: string): number => {
        const subscriber = getTopicSubscriber();
        return subscriber.unsubscribeAll(topic);
    },

    /**
     * Get available topics
     */
    getTopics: async (): Promise<import("./types").TopicDefinition[]> => {
        const subscriber = getTopicSubscriber();
        return await subscriber.getTopics();
    }
};

export { topicsApi as topics };

