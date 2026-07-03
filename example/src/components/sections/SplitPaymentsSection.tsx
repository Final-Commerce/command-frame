import { useState, useEffect, useRef } from "react";
import { topics, type TopicEvent } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface SplitPaymentsSectionProps {
    isInIframe: boolean;
}

interface ReceivedEvent {
    id: string;
    event: TopicEvent;
    receivedAt: string;
}

export function SplitPaymentsSection({ isInIframe }: SplitPaymentsSectionProps) {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [events, setEvents] = useState<ReceivedEvent[]>([]);
    const eventCounter = useRef(0);
    const callbackRef = useRef<((event: TopicEvent) => void) | null>(null);

    useEffect(() => {
        return () => {
            if (subscriptionId && callbackRef.current) {
                topics.unsubscribe("split-payments", subscriptionId);
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
        const subId = topics.subscribe("split-payments", callback);
        setSubscriptionId(subId);
    };

    const handleUnsubscribe = () => {
        if (!subscriptionId) return;
        topics.unsubscribe("split-payments", subscriptionId);
        setSubscriptionId(null);
        callbackRef.current = null;
    };

    return (
        <div className="section-content">
            <CommandSection title="Split Payments Topic">
                <p className="section-description">
                    The <strong>split-payments</strong> topic mirrors the host's in-progress split-payment session. The host publishes the full
                    current <code>CFSplitPayment</code> (or <code>null</code> when no session is active) on every mutation — partial payment captured,
                    slice reset on order completion or park — and once on the command-frame handshake so subscribers can pick up an in-flight session
                    on reconnect.
                </p>
                <p className="section-description">
                    Use this to drive UI that reflects partial-tender progress (e.g. a cart-payments list, "amount remaining" readouts, paid-amount
                    running totals) without owning the host's underlying state.
                </p>

                <div className="event-types-list" style={{ marginBottom: "1rem" }}>
                    <div className="event-type-item">
                        <strong>split-payment-updated</strong>
                        <span className="event-type-desc">
                            {" "}
                            — the host's split-payment slice changed (or was reset to <code>null</code>). Payload:{" "}
                            <code>{`{ splitPayment: CFSplitPayment | null }`}</code>
                        </span>
                    </div>
                </div>

                <div className="button-group">
                    {!subscriptionId ? (
                        <button onClick={handleSubscribe} className="btn btn--primary">
                            Subscribe to split-payments
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
                        <span>Subscribed — waiting for split-payment updates…</span>
                    </div>
                )}

                <p className="section-description" style={{ marginTop: "1rem" }}>
                    <strong>Tip:</strong> trigger a partial tender from the <em>Payments</em> section ("Partial Payment") to see a{" "}
                    <code>split-payment-updated</code> event arrive here with the appended payment in <code>splitPayment.payments</code>.
                </p>
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
                    <p className="section-description">No events yet. Subscribe above, then run a partial payment from the Payments section.</p>
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
