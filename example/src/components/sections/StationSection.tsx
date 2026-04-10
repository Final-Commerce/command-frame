import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface StationSectionProps {
    isInIframe: boolean;
}

export function StationSection({ isInIframe }: StationSectionProps) {
    const [stationId, setStationId] = useState("");
    const [setLoading, setSetLoading] = useState(false);
    const [setResponse, setSetResponse] = useState("");
    const [getLoading, setGetLoading] = useState(false);
    const [getResponse, setGetResponse] = useState("");

    return (
        <div className="section-content">
            <CommandSection title="Get Active Station">
                <p className="section-description">Returns the active station from POS state.</p>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setGetResponse("Error: Not running in iframe");
                            return;
                        }
                        setGetLoading(true);
                        setGetResponse("");
                        try {
                            const result = await command.getActiveStation();
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
                    {getLoading ? "Loading..." : "Get Active Station"}
                </button>
                {getResponse ? (
                    <JsonViewer
                        data={getResponse}
                        title={getResponse.startsWith("Error") ? "Error" : "Success"}
                    />
                ) : null}
            </CommandSection>

            <CommandSection title="Set Active Station">
                <p className="section-description">Loads a station by id and sets it as active.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Station ID:</label>
                        <input
                            type="text"
                            value={stationId}
                            onChange={e => setStationId(e.target.value)}
                            placeholder="station-id"
                        />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!isInIframe) {
                            setSetResponse("Error: Not running in iframe");
                            return;
                        }
                        if (!stationId) {
                            setSetResponse("Error: Please enter a station ID");
                            return;
                        }
                        setSetLoading(true);
                        setSetResponse("");
                        try {
                            const result = await command.setActiveStation({ stationId });
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
                    {setLoading ? "Setting..." : "Set Active Station"}
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
