import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface OutletSectionProps {
    isInIframe: boolean;
}

export function OutletSection({ isInIframe }: OutletSectionProps) {
    const [outletId, setOutletId] = useState("");
    const [setLoading, setSetLoading] = useState(false);
    const [setResponse, setSetResponse] = useState("");
    const [getLoading, setGetLoading] = useState(false);
    const [getResponse, setGetResponse] = useState("");

    return (
        <div className="section-content">
            <CommandSection title="Get Active Outlet">
                <p className="section-description">Returns the active outlet from POS state.</p>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setGetResponse("Error: Not running in iframe");
                            return;
                        }
                        setGetLoading(true);
                        setGetResponse("");
                        try {
                            const result = await command.getActiveOutlet();
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
                    {getLoading ? "Loading..." : "Get Active Outlet"}
                </button>
                {getResponse ? (
                    <JsonViewer
                        data={getResponse}
                        title={getResponse.startsWith("Error") ? "Error" : "Success"}
                    />
                ) : null}
            </CommandSection>

            <CommandSection title="Set Active Outlet">
                <p className="section-description">Loads an outlet by id and sets it as active.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Outlet ID:</label>
                        <input
                            type="text"
                            value={outletId}
                            onChange={e => setOutletId(e.target.value)}
                            placeholder="outlet-id"
                        />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setSetResponse("Error: Not running in iframe");
                            return;
                        }
                        if (!outletId) {
                            setSetResponse("Error: Please enter an outlet ID");
                            return;
                        }
                        setSetLoading(true);
                        setSetResponse("");
                        try {
                            const result = await command.setActiveOutlet({ outletId });
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
                    {setLoading ? "Setting..." : "Set Active Outlet"}
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
