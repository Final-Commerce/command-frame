import { GetCompositeAvailability, GetCompositeAvailabilityParams, GetCompositeAvailabilityResponse } from './types';
import type { CFCompositePick } from '../../CommonTypes';
import { MOCK_PRODUCTS, mockBookingAvailability, mockCompositeAtOutlet, mockIsBookable } from '../../demo/database';

// The host's answer (kaching `getCompositeAvailability`): the starts at which every bookable the picks name has the seats
// they need — of one resource, else of several together.
export const mockGetCompositeAvailability: GetCompositeAvailability = async (
  params: GetCompositeAvailabilityParams,
): Promise<GetCompositeAvailabilityResponse> => {
  console.log('[Mock] getCompositeAvailability called', params);
  const timestamp = new Date().toISOString();
  const refuse = (reason: string) => ({ success: false, reason, slots: [], timeZone: null, timestamp });
  const product = MOCK_PRODUCTS.find((candidate) => candidate.variants.some((v) => v._id === params?.variantId));
  if (!product) throw new Error(`Variant with ID ${params?.variantId} not found`);
  if (!product.composite) return refuse(`${product.name} is not a composite: it takes no composite picks`);
  const composite = mockCompositeAtOutlet(product.composite);
  const picks =
    params.composite ??
    composite.parts.flatMap((part): CFCompositePick[] => (part.defaultPick ? [part.defaultPick] : []));
  const seats = new Map<string, { seats: number; resourceId?: string }>();
  for (const pick of picks) {
    const item = composite.parts.flatMap((part) => part.items).find((candidate) => candidate._id === pick.itemId);
    const productId = item?.choices.find((choice) => choice.variantId === pick.variantId)?.productId;
    if (!item || !productId || !mockIsBookable(productId)) continue;
    const entry = seats.get(productId) ?? { seats: 0, resourceId: pick.resourceId };
    seats.set(productId, { ...entry, seats: entry.seats + item.quantity * (pick.quantity ?? 1) });
  }
  if (!seats.size) return refuse(`${product.name}: none of these picks is booked for a date`);
  const from = params.fromDay ? new Date(`${params.fromDay}T00:00:00`) : new Date();
  const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + Math.max(1, params.days ?? 1));
  const perProduct = [...seats].map(([productId, need]) => {
    const { slots, timeZone } = mockBookingAvailability(productId, from, to);
    const fits = slots.filter((slot) => {
      const resources = slot.resources.filter(
        (resource) => !need.resourceId || resource.resourceId === need.resourceId,
      );
      return (
        slot.canStart &&
        (need.resourceId
          ? resources.some((r) => r.free >= need.seats)
          : resources.reduce((sum, r) => sum + r.free, 0) >= need.seats)
      );
    });
    return { fits, timeZone };
  });
  const [first, ...rest] = perProduct;
  const slots = first.fits
    .filter((slot) =>
      rest.every(({ fits }) => fits.some((other) => +new Date(other.startAt) === +new Date(slot.startAt))),
    )
    .map((slot) => ({ startAt: slot.startAt, dayKey: slot.dayKey ?? slot.startAt.slice(0, 10) }));
  return { success: true, slots, timeZone: first.timeZone ?? null, timestamp };
};
