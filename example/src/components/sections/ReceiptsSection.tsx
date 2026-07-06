import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import type { SendSmsParams, SendEmailParams, SendReceiptType } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface ReceiptsSectionProps {
    isInIframe: boolean;
}

export function ReceiptsSection({ isInIframe }: ReceiptsSectionProps) {
    // SMS receipt
    const [smsPhone, setSmsPhone] = useState<string>("");
    const [smsId, setSmsId] = useState<string>("");
    const [smsType, setSmsType] = useState<SendReceiptType>("order");
    const [smsLoading, setSmsLoading] = useState(false);
    const [smsResponse, setSmsResponse] = useState<string>("");

    // Email receipt
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [emailId, setEmailId] = useState<string>("");
    const [emailType, setEmailType] = useState<SendReceiptType>("order");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailResponse, setEmailResponse] = useState<string>("");

    // The endpoint takes a single :id path param — orderId for sales, refundId for
    // refunds. The type picks which command-frame param the id maps to.
    const buildIdParam = (type: SendReceiptType, id: string): Partial<SendSmsParams> => {
        const trimmed = id.trim();
        if (!trimmed) return {};
        return type === "refund" ? { refundId: trimmed } : { orderId: trimmed };
    };

    const handleSendSms = async () => {
        // Reflect ReceiptSendDto validation client-side so the constraint is
        // visible even in mock mode (the real backend enforces the same rules).
        if (smsType === "refund" && !smsId.trim()) {
            setSmsResponse("Error: a refund id is required when type is 'refund'");
            return;
        }

        setSmsLoading(true);
        setSmsResponse("");

        const params: SendSmsParams = { type: smsType, ...buildIdParam(smsType, smsId) };
        if (smsPhone.trim()) params.phone = smsPhone.trim();

        try {
            const result = await command.sendSms(params);
            setSmsResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setSmsResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setSmsLoading(false);
        }
    };

    const handleSendEmail = async () => {
        if (emailType === "refund" && !emailId.trim()) {
            setEmailResponse("Error: a refund id is required when type is 'refund'");
            return;
        }

        setEmailLoading(true);
        setEmailResponse("");

        const params: SendEmailParams = { type: emailType, ...buildIdParam(emailType, emailId) };
        if (emailAddress.trim()) params.email = emailAddress.trim();

        try {
            const result = await command.sendEmail(params);
            setEmailResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setEmailResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="section-content">
            <p className="section-description">
                Both actions resolve to the host's <code>POST /receipt/send/:companyId/:id</code> endpoint
                (<code>ReceiptSendDto</code>: <code>{"{ channel, email?, phone?, type? }"}</code>). There is a single{" "}
                <code>:id</code> — the order id for sales, or the refund id when <code>type</code> is <code>refund</code> —
                and <code>channel</code> is fixed per action. {" "}
                {isInIframe
                    ? "Running in a host — calls hit the real endpoint."
                    : "Not in an iframe — calls resolve to the mock handler (mockSendSms / mockSendEmail), so the response is illustrative."}
            </p>

            <CommandSection title="Send SMS Receipt">
                <p className="section-description">
                    Sends <code>channel: "text"</code>. Text the customer the active order's (or a refund's) receipt.
                    Leave the id blank for an order to use the active order, and the phone blank to use the active
                    customer's phone. Phone must be E.164 (<code>^\+[1-9]\d{"{6,14}"}$</code>).
                </p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Type:</label>
                        <select value={smsType} onChange={e => setSmsType(e.target.value as SendReceiptType)}>
                            <option value="order">order</option>
                            <option value="refund">refund</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Order/Refund ID:</label>
                        <input
                            type="text"
                            value={smsId}
                            onChange={e => setSmsId(e.target.value)}
                            placeholder={smsType === "refund" ? "refund_123" : "Defaults to active order"}
                        />
                    </div>
                    <div className="form-field">
                        <label>Phone (E.164, optional):</label>
                        <input type="text" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} placeholder="+15555550123" />
                    </div>
                </div>
                <button onClick={handleSendSms} disabled={smsLoading} className="btn btn--primary">
                    {smsLoading ? "Sending..." : "Send SMS"}
                </button>
                {smsResponse && <JsonViewer data={smsResponse} title={smsResponse.startsWith("Error") ? "Error" : "Success"} />}
            </CommandSection>

            <CommandSection title="Send Email Receipt">
                <p className="section-description">
                    Sends <code>channel: "email"</code>. Email the customer the active order's (or a refund's) receipt.
                    Leave the id blank for an order to use the active order, and the email blank to use the active
                    customer's email.
                </p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Type:</label>
                        <select value={emailType} onChange={e => setEmailType(e.target.value as SendReceiptType)}>
                            <option value="order">order</option>
                            <option value="refund">refund</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Order/Refund ID:</label>
                        <input
                            type="text"
                            value={emailId}
                            onChange={e => setEmailId(e.target.value)}
                            placeholder={emailType === "refund" ? "refund_123" : "Defaults to active order"}
                        />
                    </div>
                    <div className="form-field">
                        <label>Email (optional):</label>
                        <input type="text" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="customer@example.com" />
                    </div>
                </div>
                <button onClick={handleSendEmail} disabled={emailLoading} className="btn btn--primary">
                    {emailLoading ? "Sending..." : "Send Email"}
                </button>
                {emailResponse && <JsonViewer data={emailResponse} title={emailResponse.startsWith("Error") ? "Error" : "Success"} />}
            </CommandSection>
        </div>
    );
}
