import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface OrderManagementSectionProps {
  isInIframe: boolean;
}

/** Loading flag + last response for one command button. */
function useCommandRunner(isInIframe: boolean) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');

  const run = async (call: () => Promise<unknown>) => {
    if (!isInIframe) {
      setResponse('Error: Not running in iframe');
      return;
    }
    setLoading(true);
    setResponse('');
    try {
      const result = await call();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, response, setResponse, run };
}

function Result({ response }: { response: string }) {
  if (!response) return null;
  return <JsonViewer data={response} title={response.startsWith('Error') ? 'Error' : 'Success'} />;
}

/** Blank → undefined (target the live cart). */
const optionalId = (value: string) => value.trim() || undefined;

/** Order lifecycle beyond the cart: release / resume, labels, assignment, external payments, custom statuses. */
export function OrderManagementSection({ isInIframe }: OrderManagementSectionProps) {
  // Release From Cart
  const release = useCommandRunner(isInIframe);

  // Resume Order
  const [resumeId, setResumeId] = useState<string>('');
  const resume = useCommandRunner(isInIframe);

  // Set Order Type
  const [typeOrderId, setTypeOrderId] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('delivery');
  const setType = useCommandRunner(isInIframe);

  // Set Order Metadata
  const [metadataOrderId, setMetadataOrderId] = useState<string>('');
  const [metadataKey, setMetadataKey] = useState<string>('gateCode');
  const [metadataValue, setMetadataValue] = useState<string>('4512');
  const setMetadata = useCommandRunner(isInIframe);

  // Assign Order User
  const [assignOrderId, setAssignOrderId] = useState<string>('');
  const [assignUserId, setAssignUserId] = useState<string>('');
  const assign = useCommandRunner(isInIframe);

  // Record External Payment
  const [externalLabel, setExternalLabel] = useState<string>('Paid online');
  const [externalAmount, setExternalAmount] = useState<string>('');
  const [externalTarget, setExternalTarget] = useState<string>('');
  const external = useCommandRunner(isInIframe);

  // Order Statuses
  const getStatuses = useCommandRunner(isInIframe);
  const [statusOrderId, setStatusOrderId] = useState<string>('');
  const [statusId, setStatusId] = useState<string>('');
  const setStatus = useCommandRunner(isInIframe);

  return (
    <div className="section-content">
      {/* Release From Cart */}
      <CommandSection title="Release From Cart">
        <p className="section-description">
          Saves the cart's order as it is (state unchanged) and frees the terminal. The order can be picked up again on
          any station with Resume Order. Unlike Park, it doesn't put the order on hold.
        </p>
        <button
          onClick={() => release.run(() => command.releaseFromCart())}
          disabled={release.loading}
          className="btn btn--primary"
        >
          {release.loading ? 'Releasing...' : 'Release From Cart'}
        </button>
        <Result response={release.response} />
      </CommandSection>

      {/* Resume Order */}
      <CommandSection title="Resume Order">
        <p className="section-description">
          Loads any open order back into the cart: parked or not, paid or not. Refuses orders already in a cart and
          finished ones (completed, refunded, voided). Replaces the current cart without confirmation.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID:</label>
            <input type="text" value={resumeId} onChange={(e) => setResumeId(e.target.value)} placeholder="order-id" />
          </div>
        </div>
        <button
          onClick={() => {
            if (!resumeId.trim()) {
              resume.setResponse('Error: Please enter an order ID');
              return;
            }
            return resume.run(() => command.resumeOrder({ orderId: resumeId.trim() }));
          }}
          disabled={resume.loading}
          className="btn btn--primary"
        >
          {resume.loading ? 'Resuming...' : 'Resume Order'}
        </button>
        <Result response={resume.response} />
      </CommandSection>

      {/* Set Order Type */}
      <CommandSection title="Set Order Type">
        <p className="section-description">
          Free-text label for filtering (e.g. delivery, pickup, takeout). Leave the order ID blank for the live cart;
          leave the type blank to clear it.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={typeOrderId}
              onChange={(e) => setTypeOrderId(e.target.value)}
              placeholder="live cart"
            />
          </div>
          <div className="form-field">
            <label>Order type:</label>
            <input
              type="text"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              placeholder="delivery"
            />
          </div>
        </div>
        <button
          onClick={() =>
            setType.run(() =>
              command.setOrderType({ orderId: optionalId(typeOrderId), orderType: orderType.trim() || null }),
            )
          }
          disabled={setType.loading}
          className="btn btn--primary"
        >
          {setType.loading ? 'Saving...' : 'Set Order Type'}
        </button>
        <Result response={setType.response} />
      </CommandSection>

      {/* Set Order Metadata */}
      <CommandSection title="Set Order Metadata">
        <p className="section-description">
          Sets one key on the order, or removes it when the value is blank. Other keys are left as they are.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={metadataOrderId}
              onChange={(e) => setMetadataOrderId(e.target.value)}
              placeholder="live cart"
            />
          </div>
          <div className="form-field">
            <label>Key:</label>
            <input type="text" value={metadataKey} onChange={(e) => setMetadataKey(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Value (blank removes):</label>
            <input type="text" value={metadataValue} onChange={(e) => setMetadataValue(e.target.value)} />
          </div>
        </div>
        <button
          onClick={() => {
            if (!metadataKey.trim()) {
              setMetadata.setResponse('Error: Please enter a key');
              return;
            }
            return setMetadata.run(() =>
              command.setOrderMetadata({
                orderId: optionalId(metadataOrderId),
                metadata: { [metadataKey.trim()]: metadataValue === '' ? null : metadataValue },
              }),
            );
          }}
          disabled={setMetadata.loading}
          className="btn btn--primary"
        >
          {setMetadata.loading ? 'Saving...' : 'Set Order Metadata'}
        </button>
        <Result response={setMetadata.response} />
      </CommandSection>

      {/* Assign Order User */}
      <CommandSection title="Assign Order User">
        <p className="section-description">
          Assigns a user to the order (e.g. the delivery driver), replacing any current assignee. Leave the user ID
          blank to unassign. The live cart's order must already be saved (parked, paid or transitioned).
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={assignOrderId}
              onChange={(e) => setAssignOrderId(e.target.value)}
              placeholder="live cart"
            />
          </div>
          <div className="form-field">
            <label>User ID:</label>
            <input
              type="text"
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              placeholder="blank = unassign"
            />
          </div>
        </div>
        <button
          onClick={() =>
            assign.run(() =>
              command.assignOrderUser({ orderId: optionalId(assignOrderId), userId: assignUserId.trim() || null }),
            )
          }
          disabled={assign.loading}
          className="btn btn--primary"
        >
          {assign.loading ? 'Assigning...' : 'Assign Order User'}
        </button>
        <Result response={assign.response} />
      </CommandSection>

      {/* Record External Payment */}
      <CommandSection title="Record External Payment">
        <p className="section-description">
          Records a payment taken outside the terminal (paid online, delivery app, voucher) under a label. No money
          moves at the POS: no reader, drawer, tip prompt or change. Leave the amount blank to record the full balance.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Label:</label>
            <input type="text" value={externalLabel} onChange={(e) => setExternalLabel(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Amount (minor units, optional):</label>
            <input
              type="number"
              value={externalAmount}
              onChange={(e) => setExternalAmount(e.target.value)}
              placeholder="full balance"
            />
          </div>
          <div className="form-field">
            <label>Fulfillment after payment (optional):</label>
            <select value={externalTarget} onChange={(e) => setExternalTarget(e.target.value)}>
              <option value="">Default (complete)</option>
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
            </select>
          </div>
        </div>
        <button
          onClick={() =>
            external.run(() =>
              command.recordExternalPayment({
                label: externalLabel,
                ...(externalAmount !== '' ? { amount: Number(externalAmount) } : {}),
                ...(externalTarget ? { checkoutFulfillmentTarget: externalTarget } : {}),
              }),
            )
          }
          disabled={external.loading}
          className="btn btn--primary"
        >
          {external.loading ? 'Recording...' : 'Record External Payment'}
        </button>
        <Result response={external.response} />
      </CommandSection>

      {/* Get Order Statuses */}
      <CommandSection title="Get Order Statuses">
        <p className="section-description">
          The company's custom order statuses (set up in hub-api). Each may move the order to a fulfillment state and
          may require a payment state.
        </p>
        <button
          onClick={() => getStatuses.run(() => command.getOrderStatuses())}
          disabled={getStatuses.loading}
          className="btn btn--primary"
        >
          {getStatuses.loading ? 'Loading...' : 'Get Order Statuses'}
        </button>
        <Result response={getStatuses.response} />
      </CommandSection>

      {/* Set Order Status */}
      <CommandSection title="Set Order Status">
        <p className="section-description">
          Sets one of the company's statuses on the order. A status tied to a fulfillment state moves the order there;
          one that requires a payment state is refused until the order is paid. Never moves money. Leave the status ID
          blank to clear it.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={statusOrderId}
              onChange={(e) => setStatusOrderId(e.target.value)}
              placeholder="live cart"
            />
          </div>
          <div className="form-field">
            <label>Status ID:</label>
            <input
              type="text"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              placeholder="in-kitchen"
            />
          </div>
        </div>
        <button
          onClick={() =>
            setStatus.run(() =>
              command.setOrderStatus({ orderId: optionalId(statusOrderId), statusId: statusId.trim() || null }),
            )
          }
          disabled={setStatus.loading}
          className="btn btn--primary"
        >
          {setStatus.loading ? 'Saving...' : 'Set Order Status'}
        </button>
        <Result response={setStatus.response} />
      </CommandSection>
    </div>
  );
}
