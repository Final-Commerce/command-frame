import { useState, useEffect } from "react";
import { topics } from "@final-commerce/command-frame";
import { canTransition } from "../../../../src/actions/can-transition/action";
import { canTransitionMock } from "../../../../src/actions/can-transition/mock";
import { getAvailableTransitions } from "../../../../src/actions/get-available-transitions/action";
import { getAvailableTransitionsMock } from "../../../../src/actions/get-available-transitions/mock";
import { cashPayment } from "../../../../src/actions/cash-payment/action";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

const PAYMENT_STATES = ["unpaid", "partially_paid", "paid", "refunded", "partially_refunded", "voided"];
const FULFILLMENT_STATES = ["draft", "pending", "in_progress", "on_hold", "fulfilled", "partially_returned", "returned", "cancelled"];

/**
 * Try the real host command first; fall back to local mock if the host
 * doesn't support the action yet (e.g. staging Render without the new handlers).
 */
async function callWithFallback<P, R>(
    hostCall: (params: P) => Promise<R>,
    mockCall: (params: P) => Promise<R>,
    params: P
): Promise<{ result: R; source: "host" | "mock" }> {
    try {
        const result = await hostCall(params);
        return { result, source: "host" };
    } catch (err) {
        if (err instanceof Error && (err.message.includes("Unknown action") || err.message.includes("not implemented"))) {
            const result = await mockCall(params);
            return { result, source: "mock" };
        }
        throw err;
    }
}

export function StateMachineSection({ isInIframe: _ }: { isInIframe: boolean }) {
    // canTransition
    const [ctOrderId, setCtOrderId] = useState("");
    const [ctPayment, setCtPayment] = useState("paid");
    const [ctFulfillment, setCtFulfillment] = useState("fulfilled");
    const [ctLoading, setCtLoading] = useState(false);
    const [ctResponse, setCtResponse] = useState("");

    // getAvailableTransitions
    const [atOrderId, setAtOrderId] = useState("order_1001");
    const [atLoading, setAtLoading] = useState(false);
    const [atResponse, setAtResponse] = useState("");

    // Cash payment with checkoutFulfillmentTarget
    const [cftTarget, setCftTarget] = useState("fulfilled");
    const [cftLoading, setCftLoading] = useState(false);
    const [cftResponse, setCftResponse] = useState("");

    // Event log
    const [eventLog, setEventLog] = useState<string[]>([]);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (!subscribed) return;
        const subId = topics.subscribe("orders", event => {
            if (event.type === "state-transition-completed" || event.type === "state-transition-blocked") {
                setEventLog(prev => [`[${new Date().toLocaleTimeString()}] ${event.type}: ${JSON.stringify(event.data)}`, ...prev.slice(0, 49)]);
            }
        });
        return () => {
            topics.unsubscribe("orders", subId);
        };
    }, [subscribed]);

    return (
        <div className="section-content">
            <CommandSection title="Can Transition">
                <p className="section-description">
                    Check whether an order can transition to a target state pair. Leave Order ID blank to evaluate against a new (null) order.
                </p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Order ID (optional):</label>
                        <input type="text" value={ctOrderId} onChange={e => setCtOrderId(e.target.value)} placeholder="order_1001" />
                    </div>
                    <div className="form-field">
                        <label>Target Payment State:</label>
                        <select value={ctPayment} onChange={e => setCtPayment(e.target.value)}>
                            {PAYMENT_STATES.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Target Fulfillment State:</label>
                        <select value={ctFulfillment} onChange={e => setCtFulfillment(e.target.value)}>
                            {FULFILLMENT_STATES.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        setCtLoading(true);
                        setCtResponse("");
                        try {
                            const params = {
                                ...(ctOrderId ? { orderId: ctOrderId } : {}),
                                to: { payment: ctPayment, fulfillment: ctFulfillment }
                            };
                            const { result, source } = await callWithFallback(canTransition, canTransitionMock, params);
                            const output = { ...result, _source: source };
                            setCtResponse(JSON.stringify(output, null, 2));
                        } catch (error) {
                            setCtResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setCtLoading(false);
                        }
                    }}
                    disabled={ctLoading}
                    className="btn btn--primary"
                >
                    {ctLoading ? "Checking..." : "Check Transition"}
                </button>

                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    <button
                        className="btn btn--secondary"
                        onClick={() => {
                            setCtPayment("paid");
                            setCtFulfillment("fulfilled");
                        }}
                    >
                        Try: paid + fulfilled
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={() => {
                            setCtPayment("refunded");
                            setCtFulfillment("draft");
                        }}
                    >
                        Try: refunded + draft (blocked)
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={() => {
                            setCtPayment("paid");
                            setCtFulfillment("cancelled");
                        }}
                    >
                        Try: paid + cancelled (blocked)
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={() => {
                            setCtPayment("unpaid");
                            setCtFulfillment("on_hold");
                        }}
                    >
                        Try: unpaid + on_hold (park)
                    </button>
                </div>

                {ctResponse && (
                    <JsonViewer
                        data={ctResponse}
                        title={ctResponse.includes('"allowed": true') ? "Allowed" : ctResponse.startsWith("Error") ? "Error" : "Blocked"}
                    />
                )}
            </CommandSection>

            <CommandSection title="Get Available Transitions">
                <p className="section-description">
                    Retrieve all transitions currently available for an order. Returns each target state pair with a display label and condition
                    statuses.
                </p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Order ID:</label>
                        <input type="text" value={atOrderId} onChange={e => setAtOrderId(e.target.value)} placeholder="order_1001" />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!atOrderId) {
                            setAtResponse("Error: Order ID is required");
                            return;
                        }
                        setAtLoading(true);
                        setAtResponse("");
                        try {
                            const params = { orderId: atOrderId };
                            const { result, source } = await callWithFallback(getAvailableTransitions, getAvailableTransitionsMock, params);
                            const output = { ...result, _source: source };
                            setAtResponse(JSON.stringify(output, null, 2));
                        } catch (error) {
                            setAtResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setAtLoading(false);
                        }
                    }}
                    disabled={atLoading}
                    className="btn btn--primary"
                >
                    {atLoading ? "Loading..." : "Get Available Transitions"}
                </button>
                {atResponse && <JsonViewer data={atResponse} title={atResponse.startsWith("Error") ? "Error" : "Transitions"} />}
            </CommandSection>

            <CommandSection title="Payment with Checkout Fulfillment Target">
                <p className="section-description">
                    Trigger a cash payment with an explicit <code>checkoutFulfillmentTarget</code>. This override tells Render what fulfillment state
                    the order should land in after full payment (e.g. <code>in_progress</code> for restaurants, <code>fulfilled</code> for retail).
                    <br />
                    <strong>Note:</strong> Add items to cart first (use the Cart section).
                </p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Checkout Fulfillment Target:</label>
                        <select value={cftTarget} onChange={e => setCftTarget(e.target.value)}>
                            {FULFILLMENT_STATES.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        setCftLoading(true);
                        setCftResponse("");
                        try {
                            const result = await cashPayment({
                                openChangeCalculator: false,
                                checkoutFulfillmentTarget: cftTarget
                            });
                            setCftResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setCftResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setCftLoading(false);
                        }
                    }}
                    disabled={cftLoading}
                    className="btn btn--primary"
                >
                    {cftLoading ? "Processing..." : `Cash Payment → ${cftTarget}`}
                </button>
                {cftResponse && <JsonViewer data={cftResponse} title={cftResponse.startsWith("Error") ? "Error" : "Payment Result"} />}
            </CommandSection>

            <CommandSection title="State Transition Events">
                <p className="section-description">
                    Subscribe to <code>state-transition-completed</code> and <code>state-transition-blocked</code> events on the orders topic. Events
                    appear here in real time when the host publishes them.
                </p>
                <button onClick={() => setSubscribed(true)} disabled={subscribed} className={`btn ${subscribed ? "btn--secondary" : "btn--primary"}`}>
                    {subscribed ? "Subscribed" : "Subscribe to State Events"}
                </button>
                {eventLog.length > 0 ? (
                    <div style={{ marginTop: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <strong>Event Log ({eventLog.length})</strong>
                            <button className="btn btn--secondary" onClick={() => setEventLog([])}>
                                Clear
                            </button>
                        </div>
                        <pre
                            style={{
                                background: "var(--color-bg-secondary, #1e1e2e)",
                                padding: "12px",
                                borderRadius: "8px",
                                maxHeight: "300px",
                                overflow: "auto",
                                fontSize: "12px",
                                lineHeight: "1.5"
                            }}
                        >
                            {eventLog.join("\n")}
                        </pre>
                    </div>
                ) : subscribed ? (
                    <p style={{ marginTop: "8px", opacity: 0.6 }}>Waiting for events...</p>
                ) : null}
            </CommandSection>
        </div>
    );
}
