import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ActiveEntityType } from "@final-commerce/common/pos-types";
import {
    bootBrain,
    openSession,
    isBooted,
    subscribeStore,
    getStoreState,
    getHydrationStatus,
    getWsUrl,
    setWsUrl,
    type BootInputs,
    type HydrationStatus,
} from "./posBrainHarness";

/**
 * Standalone harness bootstrap panel (Topology B). Mounted above the command
 * sections. Reads `?token=` from the URL (then strips it), takes the selection
 * IDs, boots pos-brain in-process, opens a session, and shows a live view of the
 * pos-brain runtime store so the tester can watch commands take effect.
 */
function readTokenFromUrl(): string {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") ?? "";
    if (token) {
        params.delete("token");
        const qs = params.toString();
        const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
        window.history.replaceState({}, "", url);
    }
    return token;
}

const box: React.CSSProperties = {
    border: "1px solid #2a2a3a",
    borderRadius: 8,
    padding: 16,
    margin: "12px 0",
    background: "#16161e",
    color: "#e6e6f0",
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
};
const input: React.CSSProperties = {
    background: "#0d0d14",
    color: "#e6e6f0",
    border: "1px solid #33334a",
    borderRadius: 4,
    padding: "4px 8px",
    margin: "2px 6px 2px 0",
    width: 200,
};
const btn: React.CSSProperties = {
    background: "#3b3bff",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "6px 14px",
    cursor: "pointer",
    marginRight: 8,
};

export function BootstrapPanel() {
    const tokenRef = useRef<string>("");
    const [hasToken, setHasToken] = useState(false);
    const [companyId, setCompanyId] = useState("");
    const [outletId, setOutletId] = useState("");
    const [stationId, setStationId] = useState("");
    const [userId, setUserId] = useState("");
    const [flowId, setFlowId] = useState("");
    const [ws, setWs] = useState(getWsUrl());

    const [booted, setBooted] = useState(isBooted());
    const [status, setStatus] = useState<string>("idle");
    const [sessionId, setSessionId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [hydration, setHydration] = useState<HydrationStatus | null>(null);

    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        tokenRef.current = readTokenFromUrl();
        setHasToken(Boolean(tokenRef.current));
    }, []);

    // Live pos-brain store snapshot (cart / order / session / shell).
    const snapshot = useSyncExternalStore(subscribeStore, getStoreState, getStoreState);

    const onBoot = async () => {
        setError("");
        if (!tokenRef.current) {
            setError("No token. Open the app with ?token=<jwt>.");
            return;
        }
        if (!companyId || !outletId || !stationId) {
            setError("companyId, outletId and stationId are required.");
            return;
        }
        if (!mountRef.current) {
            setError("Mount node not ready.");
            return;
        }
        setWsUrl(ws);
        setStatus("booting…");
        try {
            const inputs: BootInputs = {
                token: tokenRef.current,
                companyId,
                outletId,
                stationId,
                userId: userId || undefined,
                flowId: flowId || undefined,
            };
            setStatus("booting — waiting for sync to hydrate context…");
            await bootBrain(inputs, mountRef.current);
            setBooted(true);
            setHydration(getHydrationStatus());
            setStatus("booted — context hydrated");
        } catch (e) {
            setStatus("boot failed");
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const onOpenSession = async () => {
        setError("");
        setStatus("opening session…");
        try {
            const id = await openSession(companyId, stationId);
            setSessionId(id);
            setStatus("session open");
        } catch (e) {
            setStatus("open-session failed");
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const session = snapshot.session.activeSession;
    const activeEntities = snapshot.activeEntities;

    return (
        <div style={box}>
            <strong>pos-brain standalone harness (Topology B)</strong>
            <div style={{ margin: "8px 0" }}>
                token: <b style={{ color: hasToken ? "#5bff8a" : "#ff6b6b" }}>{hasToken ? "set" : "missing"}</b>
                {"  |  "}brain: <b style={{ color: booted ? "#5bff8a" : "#ffd166" }}>{booted ? "booted" : "not booted"}</b>
                {"  |  "}status: <b>{status}</b>
                {sessionId ? <> {"  |  "}session: <b>{sessionId}</b></> : null}
            </div>

            {hydration ? (
                <div style={{ margin: "8px 0" }}>
                    context:{" "}
                    <b style={{ color: hydration.currency ? "#5bff8a" : "#ff6b6b" }}>
                        company(+currency) {hydration.currency ? "✓" : "✗"}
                    </b>
                    {" / "}
                    <b style={{ color: hydration.outlet ? "#5bff8a" : "#ff6b6b" }}>
                        outlet {hydration.outlet ? "✓" : "✗"}
                    </b>
                    {" / "}
                    <b style={{ color: hydration.station ? "#5bff8a" : "#ff6b6b" }}>
                        station {hydration.station ? "✓" : "✗"}
                    </b>
                    {hydration.detail ? (
                        <span style={{ color: "#9999b3" }}> — {hydration.detail}</span>
                    ) : null}
                </div>
            ) : null}

            <div style={{ margin: "8px 0" }}>
                <input style={input} placeholder="companyId *" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
                <input style={input} placeholder="outletId *" value={outletId} onChange={(e) => setOutletId(e.target.value)} />
                <input style={input} placeholder="stationId *" value={stationId} onChange={(e) => setStationId(e.target.value)} />
            </div>
            <div style={{ margin: "8px 0" }}>
                <input style={input} placeholder="userId (optional)" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <input style={input} placeholder="flowId (optional)" value={flowId} onChange={(e) => setFlowId(e.target.value)} />
                <input style={{ ...input, width: 280 }} placeholder="ws url" value={ws} onChange={(e) => setWs(e.target.value)} />
            </div>

            <div style={{ margin: "8px 0" }}>
                <button style={btn} onClick={onBoot} disabled={booted}>Boot</button>
                <button style={btn} onClick={onOpenSession} disabled={!booted}>Open session</button>
            </div>

            {error ? (
                <div style={{ color: "#ff6b6b", whiteSpace: "pre-wrap", margin: "8px 0" }}>error: {error}</div>
            ) : null}

            {/* pos-brain mounts its runtime Provider here. */}
            <div ref={mountRef} data-pos-brain-mount />

            <details style={{ marginTop: 8 }} open>
                <summary style={{ cursor: "pointer" }}>live posStore (cart / order / session)</summary>
                <pre style={{ maxHeight: 280, overflow: "auto", background: "#0d0d14", padding: 8, borderRadius: 4 }}>
{JSON.stringify(
    {
        session,
        activeStation: snapshot.activeShell.activeStation?._id ?? null,
        activeOrder: activeEntities[ActiveEntityType.ORDER] ?? null,
        activeCart: activeEntities[ActiveEntityType.CART] ?? null,
    },
    null,
    2,
)}
                </pre>
            </details>
        </div>
    );
}
