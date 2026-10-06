import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import type { CFBooking, CFBookingAvailability, CFBookingResource } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface BookingsSectionProps {
  isInIframe: boolean;
}

/** Local midnight today and a week out, as the `datetime-local` inputs want them. */
const isoLocal = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const daysFrom = (start: Date, days: number) => new Date(start.getTime() + days * 86400000);

const asMessage = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error');

/**
 * Every booking command, in the order a booking is actually lived through:
 * find the resources, ask what is free, take a window, give it back.
 *
 * A slot row fills the forms below it, and a successful sale fills the id the
 * next command needs — so the whole life of a booking can be driven from here
 * without copying an id by hand, which is what makes it automatable.
 */
export function BookingsSection({ isInIframe: _ }: BookingsSectionProps) {
  // shared across the forms: picking a slot writes into them
  const [productId, setProductId] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [variantId, setVariantId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [reservationInternalId, setReservationInternalId] = useState('');
  const [bookingId, setBookingId] = useState('');

  const [from, setFrom] = useState(isoLocal(startOfToday()));
  const [to, setTo] = useState(isoLocal(daysFrom(startOfToday(), 7)));
  const [includeExpired, setIncludeExpired] = useState(false);

  const [resources, setResources] = useState<CFBookingResource[]>([]);
  const [availability, setAvailability] = useState<CFBookingAvailability | null>(null);
  const [bookings, setBookings] = useState<CFBooking[]>([]);
  const [lastResult, setLastResult] = useState<unknown>(null);

  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  /** One shape for every call: clear, run, show the answer or the refusal. */
  const run = async (name: string, call: () => Promise<unknown>, onOk?: (result: any) => void) => {
    setLoading(name);
    setError('');
    try {
      const result = await call();
      setLastResult(result);
      onOk?.(result);
    } catch (e) {
      setError(`${name}: ${asMessage(e)}`);
    } finally {
      setLoading('');
    }
  };

  /** A slot row, clicked: fill the forms so the next command needs no typing. */
  const fillFromSlot = (slot: { startAt: string; endAt: string; resources?: { resourceId: string }[] }) => {
    setStartAt(slot.startAt);
    setEndAt(slot.endAt);
    const first = slot.resources?.[0]?.resourceId;
    if (first) setResourceId(first);
  };

  const busy = (name: string) => loading === name;
  const anyBusy = loading !== '';

  return (
    <div className="section-content">
      {error && <JsonViewer data={error} title="Error" />}

      <CommandSection title="Get Booking Resources">
        <div className="form-group">
          <div className="form-field">
            <label>Product ID:</label>
            <input
              type="text"
              data-test="bookings-resources-product-id"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="optional — all resources when empty"
            />
          </div>
        </div>
        <button
          onClick={() =>
            run(
              'getBookingResources',
              () => command.getBookingResources(productId ? { productId } : {}),
              (r) => setResources(r?.resources ?? []),
            )
          }
          disabled={anyBusy}
          data-test="bookings-get-resources"
          className="btn btn--primary"
        >
          {busy('getBookingResources') ? 'Loading...' : 'Get Booking Resources'}
        </button>

        {resources.length > 0 && (
          <div className="data-table-wrapper">
            <h4>Resources ({resources.length})</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kind</th>
                  <th>Tag</th>
                  <th>ID</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.name}</td>
                    <td>{resource.kind}</td>
                    <td>{resource.tag || '—'}</td>
                    <td className="text-muted">{resource.id}</td>
                    <td>
                      <button
                        onClick={() => setResourceId(resource.id)}
                        data-test={`bookings-use-resource-${resource.id}`}
                        className="btn"
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CommandSection>

      <CommandSection title="Get Booking Availability">
        <div className="form-group">
          <div className="form-field">
            <label>Product ID:</label>
            <input
              type="text"
              data-test="bookings-availability-product-id"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="required"
            />
          </div>
          <div className="form-field">
            <label>Resource ID:</label>
            <input
              type="text"
              data-test="bookings-availability-resource-id"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              placeholder="optional — every resource when empty"
            />
          </div>
          <div className="form-field">
            <label>From:</label>
            <input
              type="datetime-local"
              data-test="bookings-availability-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>To:</label>
            <input
              type="datetime-local"
              data-test="bookings-availability-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() =>
            run(
              'getBookingAvailability',
              () =>
                command.getBookingAvailability({
                  productId,
                  from: new Date(from).toISOString(),
                  to: new Date(to).toISOString(),
                  ...(resourceId ? { resourceId } : {}),
                }),
              (r) => setAvailability(r?.availability ?? null),
            )
          }
          disabled={anyBusy || !productId}
          data-test="bookings-get-availability"
          className="btn btn--primary"
        >
          {busy('getBookingAvailability') ? 'Loading...' : 'Get Booking Availability'}
        </button>

        {availability && (
          <div className="data-table-wrapper">
            <h4>
              Slots ({availability.slots.length}) · {availability.ratePeriod} · rules{' '}
              <span className="text-muted">{availability.bookingRulesId}</span>
            </h4>
            {/* Why a day can come back empty: past this instant the rules refuse everything. */}
            {availability.beyondWindow && (
              <p className="text-muted">
                Beyond the booking window
                {availability.bookableUntil ? ` (bookable until ${availability.bookableUntil})` : ''}.
              </p>
            )}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Free</th>
                  <th>Can start</th>
                  <th>Resources</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {availability.slots.map((slot) => (
                  <tr key={slot.startAt}>
                    <td>{slot.startAt}</td>
                    <td>{slot.endAt}</td>
                    <td>
                      {slot.free} / {slot.capacity}
                    </td>
                    <td>{slot.canStart ? 'yes' : 'no'}</td>
                    <td className="text-muted">
                      {(slot.resources ?? []).map((r) => `${r.name} (${r.free})`).join(', ') || '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => fillFromSlot(slot)}
                        data-test={`bookings-use-slot-${slot.startAt}`}
                        className="btn"
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CommandSection>

      <CommandSection title="Sell or Hold a Window">
        {/* addBookingToCart claims the window AND adds the line in ONE call. Doing it as
            holdBooking + add would leave a held window nobody can see if the second fails. */}
        <div className="form-group">
          <div className="form-field">
            <label>Product ID:</label>
            <input
              type="text"
              data-test="bookings-sell-product-id"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Resource ID:</label>
            <input
              type="text"
              data-test="bookings-sell-resource-id"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Start At (ISO):</label>
            <input
              type="text"
              data-test="bookings-sell-start-at"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              placeholder="2026-09-24T17:00:00.000Z"
            />
          </div>
          <div className="form-field">
            <label>End At (ISO):</label>
            <input
              type="text"
              data-test="bookings-sell-end-at"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              placeholder="2026-09-24T17:30:00.000Z"
            />
          </div>
          <div className="form-field">
            <label>Variant ID:</label>
            <input
              type="text"
              data-test="bookings-sell-variant-id"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div className="form-field">
            <label>Customer ID:</label>
            <input
              type="text"
              data-test="bookings-sell-customer-id"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="optional"
            />
          </div>
        </div>

        <button
          onClick={() =>
            run(
              'addBookingToCart',
              () =>
                command.addBookingToCart({
                  productId,
                  resourceId,
                  startAt,
                  endAt,
                  ...(variantId ? { variantId } : {}),
                  ...(customerId ? { customerId } : {}),
                }),
              (r) => {
                if (r?.reservationInternalId) setReservationInternalId(r.reservationInternalId);
                if (r?.booking?.id) setBookingId(r.booking.id);
              },
            )
          }
          disabled={anyBusy || !productId || !resourceId || !startAt || !endAt}
          data-test="bookings-add-to-cart"
          className="btn btn--primary"
        >
          {busy('addBookingToCart') ? 'Adding...' : 'Add Booking to Cart'}
        </button>

        <button
          onClick={() =>
            run(
              'holdBooking',
              () =>
                command.holdBooking({
                  productId,
                  resourceId,
                  startAt,
                  endAt,
                  ...(variantId ? { variantId } : {}),
                  ...(customerId ? { customerId } : {}),
                }),
              (r) => {
                if (r?.booking?.id) setBookingId(r.booking.id);
              },
            )
          }
          disabled={anyBusy || !productId || !resourceId || !startAt || !endAt}
          data-test="bookings-hold"
          className="btn"
        >
          {busy('holdBooking') ? 'Holding...' : 'Hold Booking (no cart line)'}
        </button>
      </CommandSection>

      <CommandSection title="Release a Window">
        <div className="form-group">
          <div className="form-field">
            <label>Reservation Internal ID:</label>
            <input
              type="text"
              data-test="bookings-remove-reservation-id"
              value={reservationInternalId}
              onChange={(e) => setReservationInternalId(e.target.value)}
              placeholder="filled by Add Booking to Cart"
            />
          </div>
          <div className="form-field">
            <label>Booking ID:</label>
            <input
              type="text"
              data-test="bookings-cancel-booking-id"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="filled by Add / Hold"
            />
          </div>
        </div>

        <button
          onClick={() => run('removeBookingFromCart', () => command.removeBookingFromCart({ reservationInternalId }))}
          disabled={anyBusy || !reservationInternalId}
          data-test="bookings-remove-from-cart"
          className="btn btn--primary"
        >
          {busy('removeBookingFromCart') ? 'Removing...' : 'Remove Booking from Cart'}
        </button>

        <button
          onClick={() => run('cancelBooking', () => command.cancelBooking({ bookingId }))}
          disabled={anyBusy || !bookingId}
          data-test="bookings-cancel"
          className="btn"
        >
          {busy('cancelBooking') ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      </CommandSection>

      <CommandSection title="Get Bookings">
        <div className="form-group">
          <div className="form-field">
            <label>Product ID:</label>
            <input
              type="text"
              data-test="bookings-list-product-id"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div className="form-field">
            <label>Resource ID:</label>
            <input
              type="text"
              data-test="bookings-list-resource-id"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div className="form-field">
            <label>Customer ID:</label>
            <input
              type="text"
              data-test="bookings-list-customer-id"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                data-test="bookings-list-include-expired"
                checked={includeExpired}
                onChange={(e) => setIncludeExpired(e.target.checked)}
              />
              <span>Include expired</span>
            </label>
          </div>
        </div>

        <button
          onClick={() =>
            run(
              'getBookings',
              () =>
                command.getBookings({
                  from: new Date(from).toISOString(),
                  to: new Date(to).toISOString(),
                  ...(productId ? { productId } : {}),
                  ...(resourceId ? { resourceId } : {}),
                  ...(customerId ? { customerId } : {}),
                  includeExpired,
                }),
              (r) => setBookings(r?.bookings ?? []),
            )
          }
          disabled={anyBusy}
          data-test="bookings-get-list"
          className="btn btn--primary"
        >
          {busy('getBookings') ? 'Loading...' : 'Get Bookings'}
        </button>

        {bookings.length > 0 && (
          <div className="data-table-wrapper">
            <h4>Bookings ({bookings.length})</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>Resource</th>
                  <th>Outlet</th>
                  <th>Time zone</th>
                  <th>ID</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.startAt}</td>
                    <td>{booking.endAt}</td>
                    <td>{booking.status}</td>
                    <td>{booking.productName || booking.productId}</td>
                    <td>{booking.resourceName || booking.resourceId}</td>
                    <td>{booking.outletName || '—'}</td>
                    <td>{booking.timeZone || '—'}</td>
                    <td className="text-muted">{booking.id}</td>
                    <td>
                      <button
                        onClick={() => setBookingId(booking.id)}
                        data-test={`bookings-use-booking-${booking.id}`}
                        className="btn"
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="data-table-footer">
              <strong>Total: {bookings.length} bookings</strong>
            </div>
          </div>
        )}
      </CommandSection>

      {lastResult != null && <JsonViewer data={lastResult} title="Last response" />}
    </div>
  );
}
