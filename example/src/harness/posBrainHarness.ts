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
    createSessionFromDb,
    setSession,
    type PosSelection,
    type PosState,
} from "@final-commerce/pos-brain";
import { RenderClient } from "@final-commerce/command-frame-real";

/** WS endpoint for station-sync. Override at runtime via `?ws=` or the panel. */
const DEFAULT_WS_URL =
    (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("ws")) ||
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
 * keeps types honest (no `any` stubs). The hydrated shell-context slices are then
 * seeded by sync + by Open Session below.
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

    await b.injectToken(inputs.token);

    const selection: PosSelection = {
        companyId: inputs.companyId,
        outletId: inputs.outletId,
        stationId: inputs.stationId,
        userId: inputs.userId,
        flowId: inputs.flowId,
    };
    await b.setSelection(selection);

    b.mount(rootEl);
    brain = b;
}

export function isBooted(): boolean {
    return brain !== null;
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

/** Subscribe to the live pos-brain runtime store (cart/order view). */
export function subscribeStore(listener: () => void): () => void {
    return posStore.subscribe(listener);
}

export function getStoreState(): PosState {
    return posStore.getState();
}
