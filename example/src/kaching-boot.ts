// Boot the baked-in POS runtime — OPT-IN via `?kaching=1` (FI-6945).
//
// Two supported topologies for this example:
//  - DIRECTLY under station-home (the staging QA rig): pass `?kaching=1` — the
//    in-bundle runtime boots, connects over the ServiceChannel, and serves
//    `renderClient` in-process (sync/DB/redux).
//  - NESTED inside a flow's iframe (the real embed case): omit the param — the
//    example stays a pure command-frame CLIENT, and `renderClient` rides
//    postMessage up to the PARENT flow's kaching host (the classic
//    flow-under-Render pattern, one level down). Booting a second kaching here
//    would shadow the parent's host with an unhydrated runtime: its handshake
//    announce dies in the middle frame (ServiceChannel is strictly
//    parent<->direct-child), so commands would route into an empty POS.
import { Kaching } from '@final-commerce-internal/kaching';

if (new URLSearchParams(window.location.search).has('kaching')) {
  new Kaching().start();
}
