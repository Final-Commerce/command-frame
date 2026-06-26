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
    addSessionToLocalDb,
    closeSessionInLocalDb,
    getCurrentSession,
    createSessionFromDb,
    setSession,
    setCompany,
    ShellActions,
    getCompanyById,
    getOutletById,
    getStationById,
    type Station,
    type PosSelection,
    type PosState,
} from "@final-commerce/pos-brain";
import type {
    ActiveCompany,
    ActiveOutlet,
    ActiveStation,
} from "@final-commerce/common/pos-types";
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
 * Post-boot shell-context hydration status. In the hosted flow station-home does
 * the company/outlet/station SELECTION and hands pos-brain a hydrated
 * `SelectionContext`; standalone has no station-home, so the harness stands in
 * for it by reading the synced DB by the provided IDs (see `hydrateShellContext`).
 * The panel polls this so the tester knows when Open-session + commands are safe.
 */
export interface HydrationStatus {
    company: boolean;
    /** company hydration is only meaningful with the currency the session path needs. */
    currency: boolean;
    outlet: boolean;
    station: boolean;
    /** Human-readable state, e.g. "waiting for sync: company-settings, outlet". */
    detail: string;
}

let hydration: HydrationStatus = {
    company: false,
    currency: false,
    outlet: false,
    station: false,
    detail: "not booted",
};

export function getHydrationStatus(): HydrationStatus {
    return hydration;
}

/**
 * Boot pos-brain in-process:
 *   new POSBrain(bindings) → injectToken(token) (decodes companyId, opens DB,
 *   starts sync) → setSelection(IDs-only) → mount(rootEl).
 *
 * We use the IDs-only `setSelection` rather than `setSelectionContext`: a fully
 * hydrated `SelectionContext` would require fabricating ActiveUser/ActiveCompany/
 * ActiveOutlet/ActiveStation/Flow entities, which we can't get honestly before
 * sync. The IDs-only path is pos-brain's real DB/sync-control entry point and
 * keeps types honest (no `any` stubs).
 *
 * The IDs-only path drives the DB/sync but does NOT populate pos-brain's
 * shell-context redux slices (company/outlet/station). In the hosted flow that's
 * station-home's job (hydrated `SelectionContext` → `setSelectionContext` →
 * populateShellContext). Standalone has no station-home, so after sync settles we
 * stand in for it: `hydrateShellContext` reads the REAL synced entities from
 * pos-brain's DB by the provided IDs and seeds the slices. Without this,
 * `company.activeCompany` stays null and Open-session throws "Missing company
 * currency".
 */
export async function bootBrain(
    inputs: BootInputs,
    rootEl: HTMLElement,
): Promise<void> {
    if (brain) {
        throw new Error("[harness] pos-brain already booted");
    }

    const b = new POSBrain({
        getWsUrl,
        onAuthRequired: (reason) =>
            console.warn("[harness] pos-brain auth required:", reason),
    });

    console.log("[harness] boot: injecting token; ws =", getWsUrl());
    await b.injectToken(inputs.token);
    console.log("[harness] boot: token injected → company DB opened");

    const selection: PosSelection = {
        companyId: inputs.companyId,
        outletId: inputs.outletId,
        stationId: inputs.stationId,
        userId: inputs.userId,
        flowId: inputs.flowId,
    };
    await b.setSelection(selection);
    console.log("[harness] boot: setSelection done (DB open + sync starting)", selection);

    b.mount(rootEl);
    brain = b;
    notifyBootStatus();
    console.log("[harness] boot: runtime mounted → hydrating shell context from synced DB…");

    // Stand in for station-home: hydrate the shell-context slices from the synced
    // DB so the lifted handlers (and Open-session's currency dependency) see real
    // company/outlet/station context. Awaits sync of the needed collections.
    await hydrateShellContext(inputs);
}

// --- Shell-context hydration (the station-home stand-in) ---------------------

/** Poll an async read until it returns a present value or the budget runs out. */
async function pollUntil<T>(
    read: () => Promise<T>,
    isPresent: (value: T) => boolean,
    { tries = 60, intervalMs = 500 }: { tries?: number; intervalMs?: number } = {},
): Promise<T | undefined> {
    for (let i = 0; i < tries; i++) {
        const value = await read();
        if (isPresent(value)) {
            return value;
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return undefined;
}

/**
 * Seed the shell-context slices from the synced local DB by id — company, outlet
 * and station are all streamed by station-sync now (the company on the `companies`
 * stream → port-louis `companies` collection). A pasted company JSON, if provided,
 * overrides the synced company as a fallback. Updates `hydration` as each piece
 * lands and surfaces a clear "waiting / not found" detail rather than throwing.
 */
async function hydrateShellContext(inputs: BootInputs): Promise<void> {
    hydration = {
        company: false,
        currency: false,
        outlet: false,
        station: false,
        detail: "hydrating…",
    };

    // Hydrate company / outlet / station CONCURRENTLY. Each poll waits up to its
    // budget for sync to deliver; running them in parallel means a missing one
    // doesn't serialize behind the others (a sequential miss stacked ~30s each).
    const [company, outlet, station] = await Promise.all([
        hydrateCompany(inputs),
        hydrateOutlet(inputs),
        hydrateStation(inputs),
    ]);

    // user / flow are intentionally skipped for the smoke: the cart/order/session
    // path needs company/outlet/station, not user/flow.
    const waiting: string[] = [];
    if (!company) waiting.push("company(+currency)");
    if (!outlet) waiting.push("outlet");
    if (!station) waiting.push("station");

    hydration = {
        company,
        currency: company,
        outlet,
        station,
        detail: waiting.length
            ? `waiting for sync / not found: ${waiting.join(", ")}`
            : "context ready",
    };
}

/** Company (+currency). Pasted JSON overrides; else read the synced company by id. */
async function hydrateCompany(inputs: BootInputs): Promise<boolean> {
    let company = inputs.company;
    if (!company) {
        const row = await pollUntil(
            () => getCompanyById(inputs.companyId),
            (c): c is Record<string, unknown> => c != null,
        );
        if (row) {
            // Mirror Render's `normalizedCompany = { ...company, id: company._id }`.
            company = { ...row, id: row._id ?? row.id } as ActiveCompany;
        }
    }
    const currency = (company?.settings as { currency?: string } | undefined)?.currency;
    console.log("[harness] company hydrate:", { id: company?.id ?? null, currency: currency ?? null });
    if (company && currency) {
        posStore.dispatch(setCompany(company));
        posStore.dispatch(ShellActions.updateActiveCompany(company));
        return true;
    }
    return false;
}

/** Outlet — read the synced outlet by id. */
async function hydrateOutlet(inputs: BootInputs): Promise<boolean> {
    const outletRow = await pollUntil(
        () => getOutletById(inputs.outletId),
        (o): o is Record<string, unknown> => o != null,
    );
    if (outletRow) {
        const outlet = { ...outletRow, id: outletRow._id } as ActiveOutlet;
        posStore.dispatch(ShellActions.updateActiveOutlet(outlet));
        return true;
    }
    return false;
}

/** Station — read the synced station by id. */
async function hydrateStation(inputs: BootInputs): Promise<boolean> {
    const stationRow = await pollUntil<Station | null>(
        () => getStationById(inputs.stationId),
        (s): s is Station => s != null,
    );
    if (stationRow) {
        // pos-brain's Station row is structurally the ActiveStation shape.
        const station: ActiveStation = { ...stationRow };
        posStore.dispatch(ShellActions.setStation(station));
        return true;
    }
    return false;
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
 * Open a session directly in the local DB and push it into the runtime
 * shell-context slice (mirrors Render's open-session flow): addSessionToLocalDb →
 * setSession(createSessionFromDb(row)). Requires a booted brain (company currency
 * is read from the synced company settings).
 */
export async function openSession(
    companyId: string,
    stationId: string,
): Promise<string> {
    if (!brain) {
        throw new Error("[harness] boot pos-brain before opening a session");
    }
    const row = await addSessionToLocalDb({
        companyId,
        stationId,
        openingAmount: "0",
        openedBy: "Test",
    });
    posStore.dispatch(setSession(createSessionFromDb(row)));
    return row._id;
}

/**
 * Close the current open session (mirrors Render's close-session): find the open
 * session for the active station → closeSessionInLocalDb → clear the runtime slice.
 */
export async function closeSession(): Promise<void> {
    if (!brain) {
        throw new Error("[harness] boot pos-brain before closing a session");
    }
    const current = await getCurrentSession();
    if (!current?._id) {
        throw new Error("[harness] no open session to close");
    }
    await closeSessionInLocalDb({
        sessionId: current._id,
        stationId: current.stationId,
        closingAmounts: { cash: "0" },
        closedBy: "Test",
        closingNote: "",
    });
    posStore.dispatch(setSession(null));
}

/** Subscribe to the live pos-brain runtime store (cart/order view). */
export function subscribeStore(listener: () => void): () => void {
    return posStore.subscribe(listener);
}

export function getStoreState(): PosState {
    return posStore.getState();
}
