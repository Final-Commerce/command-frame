import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface SessionSectionProps {
    isInIframe: boolean;
}

export function SessionSection({ isInIframe }: SessionSectionProps) {
    const [sessionId, setSessionId] = useState("");
    const [setLoading, setSetLoading] = useState(false);
    const [setResponse, setSetResponse] = useState("");
    const [getLoading, setGetLoading] = useState(false);
    const [getResponse, setGetResponse] = useState("");

    return (
        <div className="section-content">
            <CommandSection title="Get Active Session">
                <p className="section-description">Returns the active register (cash) session.</p>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setGetResponse("Error: Not running in iframe");
                            return;
                        }
                        setGetLoading(true);
                        setGetResponse("");
                        try {
                            const result = await command.getActiveSession();
                            setGetResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setGetResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setGetLoading(false);
                        }
                    }}
                    disabled={getLoading}
                    className="btn btn--primary"
                >
                    {getLoading ? "Loading..." : "Get Active Session"}
                </button>
                {getResponse ? (
                    <JsonViewer
                        data={getResponse}
                        title={getResponse.startsWith("Error") ? "Error" : "Success"}
                    />
                ) : null}
            </CommandSection>

            <CommandSection title="Set Active Session">
                <p className="section-description">Loads a session by id and sets it as the active register session.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Session ID:</label>
                        <input
                            type="text"
                            value={sessionId}
                            onChange={e => setSessionId(e.target.value)}
                            placeholder="session-id"
                        />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setSetResponse("Error: Not running in iframe");
                            return;
                        }
                        if (!sessionId) {
                            setSetResponse("Error: Please enter a session ID");
                            return;
                        }
                        setSetLoading(true);
                        setSetResponse("");
                        try {
                            const result = await command.setActiveSession({ sessionId });
                            setSetResponse(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setSetResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
                        } finally {
                            setSetLoading(false);
                        }
                    }}
                    disabled={setLoading}
                    className="btn btn--primary"
                >
                    {setLoading ? "Setting..." : "Set Active Session"}
                </button>
                {setResponse ? (
                    <JsonViewer
                        data={setResponse}
                        title={setResponse.startsWith("Error") ? "Error" : "Success"}
                    />
                ) : null}
            </CommandSection>
        </div>
    );
}
