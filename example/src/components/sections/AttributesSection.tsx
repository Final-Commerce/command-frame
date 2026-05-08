import { useState, useEffect, useRef } from "react";
import { topics, type TopicEvent } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface AttributesSectionProps {
    isInIframe: boolean;
}

interface ReceivedEvent {
    id: string;
    event: TopicEvent;
    receivedAt: string;
}

export function AttributesSection({ isInIframe }: AttributesSectionProps) {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [events, setEvents] = useState<ReceivedEvent[]>([]);
    const eventCounter = useRef(0);
    const callbackRef = useRef<((event: TopicEvent) => void) | null>(null);

    useEffect(() => {
        return () => {
            if (subscriptionId && callbackRef.current) {
                topics.unsubscribe("attributes", subscriptionId);
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
        const subId = topics.subscribe("attributes", callback);
        setSubscriptionId(subId);
    };

    const handleUnsubscribe = () => {
        if (!subscriptionId) return;
        topics.unsubscribe("attributes", subscriptionId);
        setSubscriptionId(null);
        callbackRef.current = null;
    };

    return (
        <div className="section-content">
            <CommandSection title="Attributes Topic">
                <p className="section-description">
                    The <strong>attributes</strong> topic publishes events when product attribute definitions (e.g. <em>Color</em>, <em>Size</em>) are
                    created or updated via sync. Use this to keep attribute option lists up to date without polling.
                </p>
                <p className="section-description">
                    <strong>Note:</strong> The attributes sync stream must be enabled on the backend for events to flow. The client-side
                    infrastructure is in place and ready.
                </p>

                <div className="event-types-list" style={{ marginBottom: "1rem" }}>
                    <div className="event-type-item">
                        <strong>attribute-created</strong>
                        <span className="event-type-desc"> — a new attribute definition was synced/created</span>
                    </div>
                    <div className="event-type-item">
                        <strong>attribute-updated</strong>
                        <span className="event-type-desc"> — an attribute definition was updated via sync</span>
                    </div>
                </div>

                <div className="button-group">
                    {!subscriptionId ? (
                        <button onClick={handleSubscribe} className="btn btn--primary">
                            Subscribe to attributes
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
                        <span>Subscribed — waiting for attribute events…</span>
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
                    <p className="section-description">No events yet. Subscribe above and wait for attribute sync events.</p>
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
