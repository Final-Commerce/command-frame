import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface StationSectionProps {
    isInIframe: boolean;
}

export function StationSection({ isInIframe }: StationSectionProps) {
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
        </div>
    );
}
