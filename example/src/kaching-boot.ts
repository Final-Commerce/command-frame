// Boot the baked-in POS runtime. In hosted mode — running inside station-home's
// flow iframe — start() detects the parent window, connects over the
// ServiceChannel, and routes the flow's `renderClient` calls to the real
// in-process runtime (sync/DB/redux). Standalone (no host) it no-ops the
// handshake. No build-time plugin required.
import { Kaching } from "@final-commerce-internal/kaching";

new Kaching().start();
