// In-process pos-brain harness (Topology B, spec §5).
//
// Drives pos-brain DIRECTLY in the example app's window — no iframe, no
// postMessage. The example app's command sections keep calling the command-frame
// CLIENT (`renderClient.cartAddProduct(...)`), but instead of posting to
// `window.top`, the client runs in "mock mode" against a registry whose entries
// ARE pos-brain's lifted business handlers. Device-leg handlers (print ×3,
// cash-drawer, card-present captures) reject with the Stage-4 DeviceBridge
// marker; the harness surfaces that error rather than crashing.
//
// This module owns the single POSBrain instance + the in-process client. It is
// imported by:
//   - the command-frame shim (`commandFrameShim.ts`) → exposes `renderClient`
//   - the BootstrapPanel → boot / open-session / live store view.

import {
    POSBrain,
    PosBrainCommandFrameHost,
    posStore,
    setCompany,
    ShellActions,
    type HydrationStatus,
    type PosState,
} from "@final-commerce/pos-brain";
import type { ActiveCompany } from "@final-commerce-public/common/pos-types";
import { syncManager } from "@final-commerce/port-louis/sync";
import { SYNC_CLIENT_CHANGES_STREAMS } from "@final-commerce/port-louis/sync/constants";
import { RenderClient } from "@final-commerce/command-frame-real";

/** WS endpoint for station-sync. Priority: `?ws=` runtime override > VITE_WS_URL env > localhost default. */
const DEFAULT_WS_URL =
    (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("ws")) ||
    import.meta.env.VITE_WS_URL ||
    "wss://localhost:8080";

let wsUrl = DEFAULT_WS_URL;
export const setWsUrl = (url: string): void => {
    wsUrl = url;
};
export const getWsUrl = (): string => wsUrl;

// The command-frame HOST machinery, constructed standalone (origin `*`). We never
// call `.start()` (that would attach a postMessage listener we don't need); we
// only borrow `buildActions()` — the full BUSINESS-local + DEVICE-bridge map — and
// invoke handlers directly. Device legs reject with the Stage-4 marker, exactly as
// they would over the real seam.
const host = new PosBrainCommandFrameHost({ origin: "*" });
const actions = host.buildActions();

/**
 * The in-process command-frame client. `mockMode: true` makes every
 * `client.call(name, params)` resolve against `mockRegistry[name](params)` instead
 * of posting to `window.top`. We point the registry at pos-brain's handler map, so
 * the SAME `renderClient.foo(params)` calls the example sections already make now
 * run pos-brain's lifted handlers in-process.
 */
export const renderClient = new RenderClient({
    mockMode: true,
    mockRegistry: actions,
    debug:
        typeof window !== "undefined" &&
        (window as { __POSTMESSAGE_DEBUG__?: boolean }).__POSTMESSAGE_DEBUG__ ===
            true,
});

let brain: POSBrain | null = null;

export interface BootInputs {
    token: string;
    companyId: string;
    outletId: string;
    stationId: string;
    userId?: string;
    flowId?: string;
    /**
     * The company object (with `settings.currency`). NOT synced to the client —
     * station-home fetches it over HTTP at selection time. The harness stands in
     * for station-home: the tester pastes Render's company JSON into the panel.
     */
    company?: ActiveCompany;
}

/**
 * Post-boot shell-context hydration status. Re-exported from pos-brain (the
 * hydration logic now lives in `POSBrain.hydrateContext`); the panel polls this
 * so the tester knows when Open-session + commands are safe.
 */
export type { HydrationStatus };

let hydration: HydrationStatus = {
    company: false,
    currency: false,
    outlet: false,
    station: false,
    user: false,
    detail: "not booted",
};

export function getHydrationStatus(): HydrationStatus {
    return hydration;
}

/**
 * Boot pos-brain in-process — now a THIN caller over the POSBrain facade:
 *   new POSBrain({ wsUrl, apiUrl }) → injectToken(token) → start(selection, rootEl).
 *
 * `start` records the IDs-only selection, mounts the runtime, and hydrates the
 * shell-context slices from the synced DB (the station-home stand-in logic now
 * lives in `POSBrain.hydrateContext`). The pasted-company-JSON override, if
 * supplied, is dispatched into the company slices BEFORE `start`; the synced
 * company then takes precedence once it lands.
 */
export async function bootBrain(
    inputs: BootInputs,
    rootEl: HTMLElement,
): Promise<void> {
    if (brain) {
        throw new Error("[harness] pos-brain already booted");
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || undefined;
    const b = new POSBrain({
        wsUrl: getWsUrl(),
        apiUrl,
        onAuthRequired: (reason) =>
            console.warn("[harness] pos-brain auth required:", reason),
    });

    console.log("[harness] boot: injecting token; ws =", getWsUrl());
    await b.injectToken(inputs.token);
    console.log("[harness] boot: token injected → company DB opened");

    // Optional pasted-company-JSON fallback: seed the company slices up front so a
    // tester can run before sync delivers the company. The synced company (read in
    // hydrateContext) overrides this once available.
    if (inputs.company) {
        posStore.dispatch(setCompany(inputs.company));
        posStore.dispatch(ShellActions.updateActiveCompany(inputs.company));
    }

    brain = b;
    notifyBootStatus();
    console.log("[harness] boot: starting (selection + mount + hydrate)…");

    hydration = {
        company: false,
        currency: false,
        outlet: false,
        station: false,
        user: false,
        detail: "hydrating…",
    };
    hydration = await b.start(
        {
            companyId: inputs.companyId,
            outletId: inputs.outletId,
            stationId: inputs.stationId,
            userId: inputs.userId,
            flowId: inputs.flowId,
        },
        rootEl,
    );
    console.log("[harness] boot: started →", hydration.detail);
}

export function isBooted(): boolean {
    return brain !== null;
}

// --- Boot-status subscription -------------------------------------------------
// The example treats "pos-brain booted in-process" as equivalent to "in iframe"
// (commands can run), so App subscribes to this to override its `isInIframe` gate.
const bootListeners = new Set<() => void>();
function notifyBootStatus(): void {
    bootListeners.forEach((l) => l());
}
export function subscribeBootStatus(listener: () => void): () => void {
    bootListeners.add(listener);
    return () => {
        bootListeners.delete(listener);
    };
}

// --- Sync progress ------------------------------------------------------------
// Surfaces port-louis' per-stream FINISHED status so the tester knows when the
// initial sync of the subscribed collections is done (safe to open a session and
// drive cart/order commands). Backed by syncManager's status-change listeners.
export interface SyncProgress {
    finished: number;
    total: number;
    done: boolean;
}
let syncSnapshot: SyncProgress = {
    finished: 0,
    total: SYNC_CLIENT_CHANGES_STREAMS.length,
    done: false,
};
function recomputeSync(): void {
    const finished = SYNC_CLIENT_CHANGES_STREAMS.filter((s) =>
        syncManager.checkSyncFinishedByStreamKey(s),
    ).length;
    const total = SYNC_CLIENT_CHANGES_STREAMS.length;
    syncSnapshot = { finished, total, done: total > 0 && finished === total };
}
export function getSyncProgress(): SyncProgress {
    return syncSnapshot;
}
export function subscribeSyncStatus(listener: () => void): () => void {
    const cb = () => {
        recomputeSync();
        listener();
    };
    SYNC_CLIENT_CHANGES_STREAMS.forEach((s) =>
        syncManager.addSyncStatusChangeListener(s, cb),
    );
    recomputeSync();
    return () => {
        SYNC_CLIENT_CHANGES_STREAMS.forEach((s) =>
            syncManager.removeSyncStatusChangeListener(s, cb),
        );
    };
}

/**
 * Open a session — delegates to `POSBrain.openSession`. companyId/stationId come
 * from the brain's current selection now, so the args are kept only for the
 * stable BootstrapPanel signature (and ignored).
 */
export async function openSession(
    _companyId: string,
    _stationId: string,
): Promise<string> {
    if (!brain) {
        throw new Error("[harness] boot pos-brain before opening a session");
    }
    const session = await brain.openSession({ openedBy: "Test" });
    return session._id;
}

/** Close the current open session — delegates to `POSBrain.closeSession`. */
export async function closeSession(): Promise<void> {
    if (!brain) {
        throw new Error("[harness] boot pos-brain before closing a session");
    }
    await brain.closeSession({ closedBy: "Test", closingNote: "" });
}

/** Subscribe to the live pos-brain runtime store (cart/order view). */
export function subscribeStore(listener: () => void): () => void {
    return posStore.subscribe(listener);
}

export function getStoreState(): PosState {
    return posStore.getState();
}
