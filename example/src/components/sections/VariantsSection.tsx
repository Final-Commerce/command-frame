import { useState, useEffect, useRef } from "react";
import { topics, type TopicEvent } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface VariantsSectionProps {
    isInIframe: boolean;
}

interface ReceivedEvent {
    id: string;
    event: TopicEvent;
    receivedAt: string;
}

export function VariantsSection({ isInIframe }: VariantsSectionProps) {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [events, setEvents] = useState<ReceivedEvent[]>([]);
    const eventCounter = useRef(0);
    const callbackRef = useRef<((event: TopicEvent) => void) | null>(null);

    // Clean up subscription on unmount
    useEffect(() => {
        return () => {
            if (subscriptionId && callbackRef.current) {
                topics.unsubscribe("variants", subscriptionId);
            }
        };
    }, [subscriptionId]);

    const handleSubscribe = () => {
        if (!isInIframe) {
            alert("Must be running in an iframe to subscribe to topics.");
            return;
        }
        if (subscriptionId) return;

        const callback = (event: TopicEvent) => {
            const id = `event_${Date.now()}_${++eventCounter.current}`;
            setEvents(prev => [{ id, event, receivedAt: new Date().toISOString() }, ...prev].slice(0, 50));
        };
        callbackRef.current = callback;
        const subId = topics.subscribe("variants", callback);
        setSubscriptionId(subId);
    };

    const handleUnsubscribe = () => {
        if (!subscriptionId) return;
        topics.unsubscribe("variants", subscriptionId);
        setSubscriptionId(null);
        callbackRef.current = null;
    };

    return (
        <div className="section-content">
            <CommandSection title="Variants Topic">
                <p className="section-description">
                    The <strong>variants</strong> topic publishes events whenever product variant records change in the database via sync. Subscribe
                    to react to variant catalogue updates in real time.
                </p>

                <div className="event-types-list" style={{ marginBottom: "1rem" }}>
                    <div className="event-type-item">
                        <strong>variant-created</strong>
                        <span className="event-type-desc"> — a new variant was synced into the database</span>
                    </div>
                    <div className="event-type-item">
                        <strong>variant-updated</strong>
                        <span className="event-type-desc"> — an existing variant was updated via sync</span>
                    </div>
                </div>

                <div className="button-group">
                    {!subscriptionId ? (
                        <button onClick={handleSubscribe} className="btn btn--primary">
                            Subscribe to variants
                        </button>
                    ) : (
                        <button onClick={handleUnsubscribe} className="btn btn--danger">
                            Unsubscribe
                        </button>
                    )}
                </div>

                {subscriptionId && (
                    <div className="subscription-status" style={{ marginTop: "0.5rem" }}>
                        <span className="status-indicator status-indicator--active"></span>
                        <span>Subscribed — waiting for variant events…</span>
                    </div>
                )}
            </CommandSection>

            <CommandSection title="Received Events">
                <div className="events-header">
                    <span>Events received: {events.length}</span>
                    {events.length > 0 && (
                        <button onClick={() => setEvents([])} className="btn btn--small">
                            Clear
                        </button>
                    )}
                </div>

                {events.length === 0 ? (
                    <p className="section-description">No events yet. Subscribe above and wait for variant sync events.</p>
                ) : (
                    <div className="events-list">
                        {events.map(e => (
                            <div key={e.id} className="event-item">
                                <div className="event-header">
                                    <span className="event-topic">{e.event.topic}</span>
                                    <span className="event-type">{e.event.type}</span>
                                    <span className="event-timestamp">{new Date(e.event.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <JsonViewer data={JSON.stringify(e.event.data, null, 2)} title="Payload" />
                            </div>
                        ))}
                    </div>
                )}
            </CommandSection>
        </div>
    );
}
