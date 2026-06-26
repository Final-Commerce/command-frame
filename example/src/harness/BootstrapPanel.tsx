import { useRef, useState, useSyncExternalStore } from "react";
import { ActiveEntityType, type ActiveCompany } from "@final-commerce/common/pos-types";
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

// Persist every field to sessionStorage so the whole form survives a page reload
// (incl. Vite's one-off "new dependencies optimized" reload on first Boot).
const persist = (key: string, value: string): void => {
    try {
        sessionStorage.setItem(`harness.${key}`, value);
    } catch {
        /* sessionStorage unavailable — non-fatal */
    }
};
const restore = (key: string, fallback = ""): string => {
    try {
        return sessionStorage.getItem(`harness.${key}`) ?? fallback;
    } catch {
        return fallback;
    }
};

// Resolve the initial token ONCE at module load (before React mounts). Priority:
// `?token=` URL (captured + stripped) > sessionStorage.
function readInitialToken(): string {
    const fromUrl = readTokenFromUrl();
    if (fromUrl) {
        persist("token", fromUrl);
        return fromUrl;
    }
    return restore("token");
}

const INITIAL_TOKEN = readInitialToken();

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
    const [token, setToken] = useState(INITIAL_TOKEN);
    const [companyJson, setCompanyJson] = useState(() => restore("companyJson"));
    const [companyId, setCompanyId] = useState(() => restore("companyId"));
    const [outletId, setOutletId] = useState(() => restore("outletId"));
    const [stationId, setStationId] = useState(() => restore("stationId"));
    const [userId, setUserId] = useState(() => restore("userId"));
    const [flowId, setFlowId] = useState(() => restore("flowId"));
    const [ws, setWs] = useState(() => restore("ws", getWsUrl()));

    const [booted, setBooted] = useState(isBooted());
    const [status, setStatus] = useState<string>("idle");
    const [sessionId, setSessionId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [hydration, setHydration] = useState<HydrationStatus | null>(null);

    const mountRef = useRef<HTMLDivElement>(null);

    // Live pos-brain store snapshot (cart / order / session / shell).
    const snapshot = useSyncExternalStore(subscribeStore, getStoreState, getStoreState);

    const onBoot = async () => {
        setError("");
        if (!token) {
            setError("No token. Paste a company JWT in the token field (or open with ?token=<jwt>).");
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
        let company: ActiveCompany | undefined;
        if (companyJson.trim()) {
            try {
                company = JSON.parse(companyJson) as ActiveCompany;
            } catch {
                setStatus("boot failed");
                setError("Company JSON is not valid JSON — paste Render's company object.");
                return;
            }
        }
        setWsUrl(ws);
        setStatus("booting…");
        try {
            const inputs: BootInputs = {
                token,
                companyId,
                outletId,
                stationId,
                userId: userId || undefined,
                flowId: flowId || undefined,
                company,
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
                token: <b style={{ color: token ? "#5bff8a" : "#ff6b6b" }}>{token ? "set" : "missing"}</b>
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
                <input style={{ ...input, width: 520 }} placeholder="company token (JWT) *" value={token} onChange={(e) => { setToken(e.target.value); persist("token", e.target.value); }} />
            </div>
            <div style={{ margin: "8px 0" }}>
                <textarea
                    style={{ ...input, width: 520, height: 96, fontFamily: "monospace", verticalAlign: "top" }}
                    placeholder="company JSON — paste Render's company object (must include settings.currency) *"
                    value={companyJson}
                    onChange={(e) => { setCompanyJson(e.target.value); persist("companyJson", e.target.value); }}
                />
            </div>
            <div style={{ margin: "8px 0" }}>
                <input style={input} placeholder="companyId *" value={companyId} onChange={(e) => { setCompanyId(e.target.value); persist("companyId", e.target.value); }} />
                <input style={input} placeholder="outletId *" value={outletId} onChange={(e) => { setOutletId(e.target.value); persist("outletId", e.target.value); }} />
                <input style={input} placeholder="stationId *" value={stationId} onChange={(e) => { setStationId(e.target.value); persist("stationId", e.target.value); }} />
            </div>
            <div style={{ margin: "8px 0" }}>
                <input style={input} placeholder="userId (optional)" value={userId} onChange={(e) => { setUserId(e.target.value); persist("userId", e.target.value); }} />
                <input style={input} placeholder="flowId (optional)" value={flowId} onChange={(e) => { setFlowId(e.target.value); persist("flowId", e.target.value); }} />
                <input style={{ ...input, width: 280 }} placeholder="ws url" value={ws} onChange={(e) => { setWs(e.target.value); persist("ws", e.target.value); }} />
            </div>

            <div style={{ margin: "8px 0" }}>
                <button type="button" style={btn} onClick={onBoot} disabled={booted}>Boot</button>
                <button type="button" style={btn} onClick={onOpenSession} disabled={!booted}>Open session</button>
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
