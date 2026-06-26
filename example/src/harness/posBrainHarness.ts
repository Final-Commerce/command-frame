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
    setCompany,
    ShellActions,
    getCompanySettings,
    getCompanySettingsEAVValues,
    getOutletById,
    getStationById,
    convertEAVValue,
    type EAVType,
    type Station,
    type PosSelection,
    type PosState,
} from "@final-commerce/pos-brain";
import type {
    ActiveCompany,
    ActiveOutlet,
    ActiveStation,
} from "@final-commerce/common/pos-types";
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

interface EavAttribute {
    _id: string;
    name: string;
    type?: EAVType;
}
interface EavValueRow {
    attributeId: string;
    value: string;
}

/**
 * Reconstruct the company `settings` object from synced EAV (no `companies`
 * collection is synced to the client; the company's `settings.*` fields — incl.
 * `currency` — are flattened into `company-settings-eav` keys + per-company
 * `company-settings-eav-values`). This mirrors what Render's `selectCompany`
 * receives pre-built from the hub HTTP endpoint, but sourced from the synced DB.
 *
 * Returns `undefined` until BOTH the attribute keys and this company's values
 * have synced AND a `currency` attribute is present (the field the session path
 * needs) — so the caller can keep waiting rather than seeding an empty company.
 */
async function readCompanySettingsFromEav(
    companyId: string,
): Promise<Record<string, unknown> | undefined> {
    const result = await pollUntil(
        async () => {
            const attributes = (await getCompanySettings({})) as EavAttribute[];
            const values = (await getCompanySettingsEAVValues({
                entityId: companyId,
            })) as EavValueRow[];
            if (!attributes?.length || !values?.length) {
                return undefined;
            }
            const byId = new Map(attributes.map((a) => [a._id, a]));
            const settings: Record<string, unknown> = {};
            for (const row of values) {
                const attr = byId.get(row.attributeId);
                if (attr?.name) {
                    settings[attr.name] = convertEAVValue(row.value, attr.type);
                }
            }
            // Only resolve once currency (the critical field) has actually synced.
            return typeof settings.currency === "string" && settings.currency
                ? settings
                : undefined;
        },
        (settings): settings is Record<string, unknown> => settings !== undefined,
    );
    return result;
}

/**
 * Seed the shell-context slices from the synced DB by the provided IDs. Updates
 * `hydration` as each piece lands; surfaces a clear "waiting for sync / not
 * found" detail rather than throwing when a collection hasn't synced yet.
 */
async function hydrateShellContext(inputs: BootInputs): Promise<void> {
    const waiting: string[] = [];
    hydration = {
        company: false,
        currency: false,
        outlet: false,
        station: false,
        detail: "hydrating…",
    };

    // company (with currency — the critical one for Open-session).
    const settings = await readCompanySettingsFromEav(inputs.companyId);
    if (settings) {
        const company: ActiveCompany = {
            id: inputs.companyId,
            settings,
        };
        posStore.dispatch(setCompany(company));
        posStore.dispatch(ShellActions.updateActiveCompany(company));
        hydration = { ...hydration, company: true, currency: true };
    } else {
        waiting.push("company-settings(+currency)");
    }

    // outlet.
    const outletRow = await pollUntil(
        () => getOutletById(inputs.outletId),
        (o): o is Record<string, unknown> => o != null,
    );
    if (outletRow) {
        const outlet = { ...outletRow, id: outletRow._id } as ActiveOutlet;
        posStore.dispatch(ShellActions.updateActiveOutlet(outlet));
        hydration = { ...hydration, outlet: true };
    } else {
        waiting.push("outlet");
    }

    // station.
    const stationRow = await pollUntil<Station | null>(
        () => getStationById(inputs.stationId),
        (s): s is Station => s != null,
    );
    if (stationRow) {
        // pos-brain's Station row is structurally the ActiveStation shape.
        const station: ActiveStation = { ...stationRow };
        posStore.dispatch(ShellActions.setStation(station));
        hydration = { ...hydration, station: true };
    } else {
        waiting.push("station");
    }

    // user / flow are intentionally skipped for the smoke: the cart/order/session
    // path needs company/outlet/station, not user/flow.

    hydration = {
        ...hydration,
        detail: waiting.length
            ? `waiting for sync / not found: ${waiting.join(", ")}`
            : "context ready",
    };
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
