// Get Composite Availability Types (FT-83, B41)
import type { CFCompositePick } from '../../CommonTypes';

export interface GetCompositeAvailabilityParams {
  /** The composite's variant — the one `addProductToCart` takes. Its `composite.needsDate` is true. */
  variantId: string;
  /** The picks so far; their bookable items decide the seats asked. Absent = each part's `defaultPick`. */
  composite?: CFCompositePick[];
  /** First shop day, `YYYY-MM-DD` in the shop's zone. Defaults to today. */
  fromDay?: string;
  /** How many shop days from `fromDay`. Defaults to 1. */
  days?: number;
}

/** A start every bookable of the composite can be held at, with the seats its picks need. */
export interface CFCompositeSlot {
  /** ISO 8601 — send it back as `addProductToCart({ compositeSlot: { startAt } })`. */
  startAt: string;
  /** The shop day it falls on, `YYYY-MM-DD` — what a day picker groups by. */
  dayKey: string;
}

export interface GetCompositeAvailabilityResponse {
  /** False when the host refused: not a composite, nothing bookable picked, no booking rules on this till yet. */
  success: boolean;
  reason?: string;
  /** In time order. Empty = nothing free for all of them in those days. */
  slots: CFCompositeSlot[];
  /** The clock `startAt` and `dayKey` read on; null when no bookable serves here. */
  timeZone: string | null;
  timestamp: string;
}

export type GetCompositeAvailability = (
  params: GetCompositeAvailabilityParams,
) => Promise<GetCompositeAvailabilityResponse>;
